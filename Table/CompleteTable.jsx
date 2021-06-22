import React, { useEffect } from "react";
import CSSTransitionGroup from "react-transition-group/CSSTransitionGroup";
import { Row, Col, Card, CardBody, CardHeader } from "reactstrap";
import { useForm } from "hooks";
import ReactTable from "react-table";
import { downloadExcel } from "lib/utilityFileFunctions";
import "./css/completeTable.css";

// const getTheadTrProps = (state, rowInfo, column) => {
//   return {
//     className: "bg-primary text-white",
//   };
// };

const CompleteTable = ({
  DataTable = [],
  columns = [],
  size = "lg",
  hasContainer = false,
  className,
  containerClassName = {
    boxShadow:
      "rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px",
  },
  excelShetName = "sheet",
  hasExcel = false,
  heigth = "600px",
  defaultPageSize = 5,
  title = "",
  classHeader = { background: "#FFFFFF", color: "#545cd8" },
  ...rest
}) => {
  const InitialState = {
    Busqueda: { Buscar: "" },
    Mapeado: [],
  };

  const {
    handleChange,
    handleChangeInputArray,
    handleChangeState,
    data,
    errors,
  } = useForm(InitialState, null, null);

  const SortBy = ({ currentTarget: input }) => {
    const newData = { ...data };
    newData.Busqueda.Buscar = input.value;
    let datas = [];
    if (DataTable && DataTable.length > 0) {
      datas = DataTable.filter((res) => {
        return JSON.stringify(res)
          .toString()
          .toLocaleLowerCase()
          .includes(input.value.toString().toLocaleLowerCase());
      });
    }
    newData.Mapeado = datas;
    if (!input.value || input.value == "" || input.value == null)
      newData.Mapeado = DataTable;
    handleChangeState(newData);
  };

  const handleDownloadExcel = () => {
    downloadExcel(excelShetName, data.Mapeado);
  };

  useEffect(() => {
    if (!DataTable || !DataTable.length > 0) return;
    const newData = { ...data };
    newData.Mapeado = DataTable;
    handleChangeState(newData);
  }, [DataTable]);

  return (
    <>
      <CSSTransitionGroup
        component="div"
        transitionName="TabsAnimation"
        transitionAppear={true}
        transitionAppearTimeout={0}
        transitionEnter={false}
        transitionLeave={false}
      >
        <Row>
          <Col md="12">
            <Card
              className={`main-card  ${containerClassName}`}
              style={{
                boxShadow:
                  "rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px",
              }}
            >
              {title && (
                <CardHeader style={classHeader}>
                  {title}
                  <div style={{ position: "absolute", right: "10px"}}>
                    <div className="form-group form-groups" style={{ margin:'10px' }}>
                      <span style={{cursor:'pointer'}} onClick={() => handleDownloadExcel()}>Excel</span>
                      <input
                        className="form-field"
                        type="text"
                        placeholder="Buscar"
                        name="Busqueda.Buscar"
                        value={data.Busqueda.Buscar}
                        onChange={SortBy}
                      />
                    </div>                    
                  </div>
                </CardHeader>
              )}

              <CardBody className="cardBody">
                <ReactTable
                  data={data.Mapeado ? data.Mapeado : []}
                  columns={columns}
                  defaultPageSize={defaultPageSize}
                  previousText="Anterior"
                  nextText="Siguiente"
                  noDataText="No hay Datos "
                  pageText="Página"
                  ofText="de"
                  rowsText="filas"
                  loadingText="cargando"
                  style={{
                    height: heigth, // This will force the table body to overflow and scroll, since there is not enough room
                    headerStyle: {
                      background: "#40C4FF",
                      textAlign: "center",
                      color: "white",
                    },
                  }}
                  className={`-striped -highlight  -fixed ${className}`}
                  freezeWhenExpanded={true}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </CSSTransitionGroup>
    </>
  );
};

export default CompleteTable;
