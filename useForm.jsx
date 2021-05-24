import { useState } from "react";
import Joi, { errors } from "joi-browser";
import { toast } from "react-toastify";
import _ from "lodash";

import { convertImageToBase64 } from "lib/utilityImageFunctions";

import {
  ToggleCheckList,
  removeElementFromList,
  updateElementFromList,
  removePropertysFromObject,
  ToggleManyElementsFromList,
} from "../lib/utilityStateListFunctions";
import { v4 as uuid } from "uuid";

const useForm = (initialState, schema, doSubmit) => {
  const [state, setState] = useState({
    data: initialState,
    errors: {},
  });

  // Esta funcion obtiene el valor del input dependiendo su tipo

  const getInputValue = (input) => {
    if (input && input.type === "checkbox") {
      return input.checked ? 1 : 0;
    }

    if (input && input.type === "date") {
      return input.value.toString();
    }

    if (input && input.type === "file") {
      return input.files;
    }
    return input.value;
  };
  const validateProperty = (input) => {
    const value = getInputValue(input);
    const name = input.name;

    const property = { [name]: value };
    const schemaProperty = { [name]: schema[name] };
    const { error } = Joi.validate(property, schemaProperty);
    return error ? error.details[0].message : null;
  };

  const validate = () => {
    const options = { abortEarly: false, allowUnknown: true };

    const { error } = Joi.validate(state.data, schema, options);

    if (!error) return null;

    const errors = error.details.reduce((previous, current) => {
      previous[current.path[0]] = current.message;
      return previous;
    }, {});

    return errors;
  };

  const getDataFromCallBack = (data, callback, item) => {
    const callbackData =
      callback && typeof callback === "function"
        ? callback(data, item)
        : undefined;
    return callbackData ? callbackData : data;
  };

  //Esta funcion es utilizada para cambiar  el estado los imputs de agregado multiples cada vez que cambian su valor

  const handleSelectMultipleChange = (name) => {
    return (selectedOptions) => {
      setState((prevState) => ({
        ...prevState,
        [name]: selectedOptions.map((option) => option.value),
      }));
    };
  };

  //Esta funcion es utilizada para actualizar el estado los imputs cada vez que cambian su valor

  const handleChange = ({ currentTarget: input }, callback) => {
    const errors = { ...state.errors };

    const data = { ...state.data };
    data[input.name] = getInputValue(input);

    if (callback) {
      callback(data, errors);
    }
    setState({ ...state, data, errors });
  };

  // Esta funcion es utilizada para actualizar el estado de los imput files, convertidos a base 64

  const handleChangeFile = ({ currentTarget: input }, callback) => {
    const errors = { ...state.errors };

    const data = { ...state.data };
    const nameProperty = [input.name];
    const file = input.files[0];

    if (callback) {
      callback(data, errors);
    }

    convertImageToBase64(file, (Base64Image) => {
      setState({
        ...state,
        data: { ...data, [nameProperty]: Base64Image },
        errors,
      });
    });
  };
  //Esta funcion permite cambiar el valor de una propiedad de un elemento de una lista de datos en el estado.

  const handleChangeInputArray = ({ currentTarget: input }) => {
    const errors = { ...state.errors };
    const data = { ...state.data };
    let nombre = input.name.split(".");
    data[nombre[0]][nombre[1]] = getInputValue(input);
    setState({ ...state, data, errors });
  };

  //Esta funcion permite cambiar el valor de una propiedad de un elemento de una lista de datos en el estado.

  const handleChangeInputArrayChild = ({ currentTarget: input }) => {
    const errors = { ...state.errors };
    const data = { ...state.data };
    let nombre = input.name.split(".");
    data[nombre[0]][nombre[1]][nombre[2]] = getInputValue(input);
    setState({ ...state, data, errors });
  };

  //Esta  funcion permite actualizar el valor de una propiedad de tipo boleano de una lista de elementos en el estado

  const handleTogglePropertyOnList = ({
    filterProperty,
    filterValue,
    filterFunction,
    toogleProperty,
    useNumbers = true,

    listStateName,
    callback,
  }) => {
    let itemForToogle;
    let data = { ...state.data };

    if (filterProperty && filterValue) {
      itemForToogle =
        data[listStateName] &&
        data[listStateName].find(
          (item) => item[filterProperty] === filterValue
        );

      if (!itemForToogle) {
        itemForToogle =
          data[listStateName] &&
          data[listStateName].find((item) => item["uuid"] === filterValue);

        filterProperty = itemForToogle ? "uuid" : filterProperty;
      }
    }

    const toggleList = ToggleCheckList({
      list: state.data[listStateName],
      filterProperty,
      filterValue,
      toogleProperty,
      useNumbers,
    });

    data[listStateName] = toggleList;

    data = getDataFromCallBack(data, callback, filterValue);

    setState({ ...state, data });
  };

  //Esta fncion cambia el valor de varios elementos booleano de una lista, y hace el cambio de aquellos valores especificados  por una funcion de filtrado
  const handleToggleManyElementsFromList = ({
    filterFunction,
    toogleProperty,
    checkValue,
    listStateName,
    callback,
  }) => {
    let data = { ...state.data };

    const toggleList = ToggleManyElementsFromList({
      list: state.data[listStateName],
      filterFunction,
      checkValue,
      toogleProperty,
    });

    data[listStateName] = toggleList;

    data = getDataFromCallBack(data, callback);

    setState({ ...state, data });
  };

  //Esta funcion permite la eliminacion de datos de las listas de estado

  const handleRemoveValueFromList = ({
    filterProperty,
    filterValue,
    listStateName,
    callback,
  }) => {
    let itemForRemove;
    let data = { ...state.data };

    if (filterProperty && filterValue) {
      itemForRemove =
        data[listStateName] &&
        data[listStateName].find(
          (item) => item[filterProperty] === filterValue
        );

      if (!itemForRemove) {
        itemForRemove =
          data[listStateName] &&
          data[listStateName].find((item) => item["uuid"] === filterValue);

        filterProperty = itemForRemove ? "uuid" : filterProperty;
      }
    }

    if (itemForRemove) {
      const removedList = removeElementFromList({
        list: state.data[listStateName],
        filterProperty: filterProperty,
        filterValue: filterValue,
      });
      let data = { ...state.data };
      data[listStateName] = removedList;

      data = getDataFromCallBack(data, callback, itemForRemove);
      setState({ ...state, data });
    }
    return;
  };

  //Esta funcion permite la actualizacion de datos a listas de estado

  const handleUpdateValueFromList = ({
    filterProperty,
    filterValue,
    listStateName,
    value,
    hasMessage = true,
    callback,
  }) => {
    let data = { ...state.data };
    let itemForUpdate;
    if (filterProperty && filterValue) {
      itemForUpdate =
        data[listStateName] &&
        data[listStateName].find(
          (item) => item[filterProperty] === filterValue
        );

      if (!itemForUpdate) {
        itemForUpdate =
          data[listStateName] &&
          data[listStateName].find((item) => item["uuid"] === filterValue);

        filterProperty = itemForUpdate ? "uuid" : filterProperty;
      }
    }

    if (itemForUpdate) {
      const updatedList = updateElementFromList({
        list: data[listStateName],
        filterProperty: filterProperty,
        filterValue: filterValue,
        data: value,
        hasMessage,
      });
      data[listStateName] = updatedList;
      data.CodigoUnico = 0;

      data = getDataFromCallBack(data, callback, itemForUpdate);

      setState({ ...state, data });

      return;
    }
  };

  // Esta funcion permite actualizar los datos del estado;

  const handleChangeState = (data, errors, callback) => {
    let newData;
    newData = getDataFromCallBack(data, callback);

    if (errors) {
      return setState((state) => ({ ...state, data: newData, errors }));
    }
    setState((state) => ({ ...state, data: newData }));
  };

  //Esta funcion permite la addicion de datos a listas de estado

  const handleAddValueToList = ({
    listStateName,
    value,
    filterProperty,
    filterValue,
    errors,
    callbackAdd,
    callbackUpdate,
    UpdateProperty = "CodigoUnico",
  }) => {
    let data = { ...state.data };
    let itemForUpdate;
    if (filterProperty && filterValue) {
      itemForUpdate =
        data[listStateName] &&
        data[listStateName].find(
          (item) => item[filterProperty] === filterValue
        );

      if (!itemForUpdate) {
        itemForUpdate =
          data[listStateName] &&
          data[listStateName].find((item) => item["uuid"] === filterValue);

        filterProperty = itemForUpdate ? "uuid" : filterProperty;
      }
    }

    if (itemForUpdate) {
      const updatedList = updateElementFromList({
        list: data[listStateName],
        filterProperty: filterProperty,
        filterValue: filterValue,
        data: value,
      });
      data[listStateName] = updatedList;
      // data.CodigoUnico = 0;
      data[UpdateProperty] = 0;

      data = getDataFromCallBack(data, callbackUpdate, itemForUpdate);

      setState({ ...state, data });

      return;
    }

    if (data[listStateName]) {
      data[listStateName] = [
        ...data[listStateName],
        { ...value, uuid: uuid() },
      ];
    }
    toast.success("Elemento agregado con éxito");

    data = getDataFromCallBack(data, callbackAdd, value);

    setState({ ...state, data });
  };
  //Esta funcion permite remover las propiedades del error

  const updateErrorsState = (propertiesToRemove) => {
    let newError = { ...state.errors };
    removePropertysFromObject(newError, propertiesToRemove);
    //Remove Errors Properties
    setState((state) => ({ ...state, errors: newError }));
  };

  //Esta funcion permite la addicion de datos a listas de estado, permitiendo agregar funciones  con validaciones de errores

  const handleAddElementsWithValidations = ({
    errorFunction,
    listName,
    dataToAdd,
    errorPropertiesToRemove,
    filterProperty,
    filterValue,
    callbackAdd,
    callbackUpdate,
    UpdateProperty,
  }) => {
    let data = { ...state.data };
    let error = errorFunction(data);
    if (Object.entries(error).length === 0) {
      handleAddValueToList({
        listStateName: listName,
        value: dataToAdd,
        filterProperty,
        filterValue,
        callbackAdd,
        callbackUpdate,
        UpdateProperty,
      });

      updateErrorsState(errorPropertiesToRemove);
      return;
    }
    toast.error("Hay errores en los campos, favor corregir antes de Agregar");

    return setState({ data, errors: { ...state.errors, ...error } });
  };

  const handleSubmit = async (e) => {
    e && e.preventDefault();
    // const errors = validate();
    // setState({ ...state, errors: errors || {} });

    // if (errors) return;

    await doSubmit(state, setState);
  };

  return {
    data: state.data,
    errors: state.errors,
    handleChange,
    handleChangeState,
    handleChangeFile,
    handleSubmit,
    handleSelectMultipleChange,
    handleAddValueToList,
    handleTogglePropertyOnList,
    handleRemoveValueFromList,
    handleUpdateValueFromList,
    handleAddElementsWithValidations,
    handleToggleManyElementsFromList,
    setState,
    updateErrorsState,

    handleChangeInputArray,
    handleChangeInputArrayChild,
  };
};

export default useForm;
