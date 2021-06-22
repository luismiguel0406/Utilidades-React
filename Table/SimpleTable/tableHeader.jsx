import React, { Component } from "react";

const TableHeader =({Columns})=>{

 

    return (
      <thead>
        <tr>
          {Columns.map((column) => (
            <th
              style={{ cursor: "pointer" }}
              key={column.path || column.key}
              className="text-center"             
            >
              {column.label} 
            </th>
          ))}
        </tr>
      </thead>
    );
  }


export default TableHeader;
