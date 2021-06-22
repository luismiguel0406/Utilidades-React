import React, { useEffect } from "react";
import { Input } from "../../Inputs";
import { Row, Col, Table } from "reactstrap";
import "../css/TableBootstrap.css";
import PropTypes from "prop-types";
import TableHeader from "./tableHeader";
import TableBody from "./tableBody";
import { useForm } from "../../../../hooks";

export const SimpleTable = ({
  Columns = [],
  DataTable = [],
  TableClass = "lila",
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

  const { Busqueda, Mapeado } = data;
  const { Buscar } = Busqueda;

  const SortBy = (event) => {
    handleChangeInputArray(event);
  };

  return (
    <>
      {Columns && Columns.length > 0 && (
        <>
          <Row className="float-right">
            <Col md={4}>
              <Input
                name="Busqueda.Buscar"
                label=""
                errors={errors}
                id="Buscar"
                value={Buscar}
                onChange={SortBy}
                disabled={false}
                placeholder="Buscar"
              />
            </Col>
          </Row>
          <br />
          <Row>
            <Col>
              <Table striped className={`${TableClass} panel`}>
                <TableHeader Columns={Columns} />
                <TableBody Columns={Columns} DataTable={DataTable} />
              </Table>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

// SimpleTable.propTypes = {
//   columns: PropTypes.arrayOf(
//     PropTypes.oneOfType([
//       PropTypes.shape({
//         path: PropTypes.string,
//         label: PropTypes.string,
//       }),
//       PropTypes.shape({
//         content: PropTypes.func,
//         key: PropTypes.string,
//       }),
//     ])
//   ).isRequired,
//   sortColumn: PropTypes.shape({
//     order: PropTypes.oneOf(["asc", "desc"]).isRequired,
//     path: PropTypes.string.isRequired,
//   }).isRequired,
//   onSort: PropTypes.func.isRequired,

//   DataTable: PropTypes.arrayOf(PropTypes.object).isRequired,
// };

export default SimpleTable;
