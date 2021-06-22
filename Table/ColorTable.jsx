import React, { useEffect } from "react";
import { Row, Col, TabPane, TabContent, Card, CardBody } from "reactstrap";
import TableBody from "components/Commons/Table/SimpleTable/tableBody";
import TableHeader from "components/Commons/Table/SimpleTable/tableHeader";
import { useForm } from "hooks";
import { downloadExcel } from "lib/utilityFileFunctions";

const ColorTable = ({
  title = "",
  Column = [],
  DataTable = [],
  excelShetName = "sheet",
  hasBody = false,
  hasExcel = false,
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
    let newArray = [];
    if (DataTable && DataTable.length > 0) {
      let u =
        DataTable.map((array) => {
          for (const obje in array) {
            if (
              array[obje]
                .toString()
                .toLowerCase()
                .includes(data.Busqueda.Buscar.toString().toLowerCase())
            ) {
              if (!newArray.includes(array)) newArray.push(array);
            }
          }
        }) || [];
    }
    newData.Mapeado = newArray;
    if (
      !data.Busqueda.Buscar ||
      data.Busqueda.Buscar == "" ||
      data.Busqueda.Buscar == null
    )
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
      {Column && Column.length > 0 && (
        <>
          <Row>
            <Col>
              {hasBody ? (
                <Card className="Noto">
                  <CardBody>
                    <TabContent className="panel">
                      <TabPane className="panel-heading">
                        <Row>
                          <Col xs="12" sm="3">
                            <h4 className="title">{title}</h4>
                          </Col>
                          <Col xs="12" sm="9">
                            <div className="float-right">
                              <form className="search-box mr-4">
                                <input
                                  name="Busqueda.Buscar"
                                  type="text"
                                  placeholder=" "
                                  value={data.Busqueda.Buscar}
                                  onChange={SortBy}
                                />
                                {"         "}
                              </form>
                              {"         "}{" "}
                              {hasExcel == true && (
                                <button
                                  className="btn btn-success"
                                  title="Excel"
                                  onClick={() => handleDownloadExcel()}
                                >
                                  <i className="fa fa-file-excel-o"></i>
                                </button>
                              )}
                            </div>
                          </Col>
                        </Row>
                      </TabPane>
                      <TabPane className="panel-body table-responsive">
                        <table className="table table-bordered">
                          <TableHeader Columns={Column} />
                          <TableBody
                            Columns={Column}
                            DataTable={data.Mapeado}
                          />
                        </table>
                      </TabPane>
                    </TabContent>
                  </CardBody>
                </Card>
              ) : (
                <TabContent className="panel Noto">
                  <TabPane className="panel-heading">
                    <Row>
                      <Col xs="12" sm="3">
                        <h4 className="title">{title}</h4>
                      </Col>
                      <Col xs="12" sm="9">
                        <div className="float-right">
                          <form className="search-box mr-4">
                            <input
                              name="Busqueda.Buscar"
                              type="text"
                              placeholder="Busqueda..."
                              value={data.Busqueda.Buscar}
                              onChange={SortBy}
                            />
                            {"         "}
                          </form>
                          {"         "}{" "}
                          {hasExcel == true && (
                            <>
                              <button
                                className="btn btn-default"
                                title="Excel"
                                onClick={() => handleDownloadExcel()}
                              >
                                <i className="fa fa-file-excel-o"></i>
                              </button>
                            </>
                          )}
                        </div>
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane className="panel-body table-responsive">
                    <table className="table">
                      <TableHeader Columns={Column} />
                      <TableBody Columns={Column} DataTable={data.Mapeado} />
                    </table>
                  </TabPane>
                </TabContent>
              )}
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ColorTable;
