import React, { Component } from "react";
import { Button } from 'reactstrap';
import _ from "lodash";
const TableBody = ({ DataTable = [], Columns = [], keyProperty }) => {
  const renderCell = (column, element) => {
    if (column.path === "Accion") {
      return (
        <>
          <Button
            color={column.color || 'primary'}
            onClick={(column.HandleAction) ? () => column.HandleAction(element) : () => {}}
            className="m-1"
          >
            <i className={column.fa || "fa fa-hand-pointer-o"}></i>
          </Button>
        </>
      );
    }
    if (column.path === "Accion") return;

    if (column.content) return column.content(element);
    return _.get(element, column.path);
  };

  const createKey = (column, element) => {
    return element[keyProperty] + (column.path || column.content);
  };

  return (
    <tbody>
      {DataTable.map((element) => (
        <tr key={element[keyProperty]}>
          {Columns.map((column) => (
            <td
              className="text-center text-muted"
              key={createKey(column, element)}
            >
              {renderCell(column, element)}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};

TableBody.defaultProps = {
  keyProperty: "_id",
};

export default TableBody;
