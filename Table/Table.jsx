import React from "react";
import CSSTransitionGroup from "react-transition-group/CSSTransitionGroup";

import { Row, Col, Card, CardBody } from "reactstrap";

import ReactTable from "react-table";

import { getCurrentUser } from "../../../services/Auth/authService";

import { ButtonExcel } from "components/Commons/Inputs";
import { ButtonPdf } from "components/Commons/Inputs";
import {
  downloadExcel,
  downloadExcelFormated,
  downloadPDF,
} from "lib/utilityFileFunctions";
import { downloadPDF2, downloadPDF3Costos } from "lib/utilityFileFunctions2";
import { connect, useSelector } from "react-redux";
import HPaintLogo from "../../../assets/images/hpaint.png";
import { toast } from "react-toastify";

import ReactExport from "react-data-export";
import ExcelExportComponent from "../../../lib/ExcelExportComponent";

// const getTheadTrProps = (state, rowInfo, column) => {
//   return {
//     className: "bg-primary text-white",
//   };
// };

const user = getCurrentUser();

const Table = ({
  data = [],
  columns,
  hasContainer = false,
  className,
  containerClassName,
  excelShetName = "sheet",
  hasExcel = false,

  hasPdf = false,
  hasPdfManoObra = false,
  hasPdfCostos = false,

  dataToBeDownloaded,

  heigth = "600px",
  defaultPageSize = 5,
  includeTables,
  ifTopHeader,
  hasExcelFormated = false,
  hasExcelFormatedLibrary = false,
  ...rest
}) => {
  const { datos } = useSelector((state) => state.guardarExcel);

  const handelDescargarExcel = () => {
    if (datos !== undefined && datos.length !== 0) {
      downloadExcelFormated(datos);
    } else {
      toast.error("No Hay datos en la tabla", {
        autoClose: 3000,
      });
    }
  };

  const handleDownloadExcel = () => {
    downloadExcel(excelShetName, data);
  };

  const handleDownloadPDF = () => {
    downloadPDF(
      dataToBeDownloaded,
      user.usuario,
      HPaintLogo,
      includeTables,
      ifTopHeader
    );
  };

  const handleDownloadPDFmanoObraTemplate = () => {
    downloadPDF2(dataToBeDownloaded, user.usuario, HPaintLogo, includeTables);
  };
  const handleDownloadPDFCostos = () => {
    downloadPDF3Costos(
      dataToBeDownloaded,
      user.usuario,
      HPaintLogo,
      includeTables,
      ifTopHeader
    );
  };

  const getCantidadPaginas = (cantidad) => {
    if (cantidad <= 5) {
      return 5;
    }
    if (cantidad > 5 && cantidad < 20) {
      return cantidad;
    }

    return 20;
  };

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
            {hasContainer ||
            hasExcel ||
            hasPdf ||
            hasPdfManoObra ||
            hasExcelFormatedLibrary ? (
              <Card className={`main-card mb-3 ${containerClassName}`}>
                <CardBody>
                  <Row>
                    <Col className="my-2 ">
                      {hasExcel && (
                        <ButtonExcel onClick={handleDownloadExcel} />
                      )}
                      {
                        hasExcelFormatedLibrary && (
                          <ExcelExportComponent data={datos} />
                        )
                        /*   <ButtonExcel onClick={handelDescargarExcel} /> */
                      }
                      {hasExcelFormated && (
                        /*    <ExcelExportComponent data={datos}/> */
                        <ButtonExcel onClick={handelDescargarExcel} />
                      )}
                      {hasPdf && <ButtonPdf onClick={handleDownloadPDF} />}
                      {hasPdfManoObra && (
                        <ButtonPdf
                          onClick={handleDownloadPDFmanoObraTemplate}
                        />
                      )}

                      {hasPdfCostos && (
                        <ButtonPdf onClick={handleDownloadPDFCostos} />
                      )}
                    </Col>
                  </Row>

                  <ReactTable
                    data={data ? data : []}
                    columns={columns}
                    defaultPageSize={defaultPageSize}
                    style={{
                      height: heigth, // This will force the table body to overflow and scroll, since there is not enough room
                    }}
                    className="-striped -highlight -fixed "
                    previousText="Anterior"
                    nextText="Siguiente"
                    noDataText="No hay Datos "
                    pageText="Página"
                    ofText="de"
                    rowsText="filas"
                    loadingText="cargando"
                    {...rest}
                  />
                </CardBody>
              </Card>
            ) : (
              <ReactTable
                data={data ? data : []}
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
                }}
                className={`-striped -highlight  -fixed ${className}`}
                freezeWhenExpanded={true}
                {...rest}
              />
            )}
          </Col>
        </Row>
      </CSSTransitionGroup>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    dataToBeDownloaded: state.downloadble.dataToBeDownloaded,
  };
};

export default connect(mapStateToProps)(Table);
