import React from "react";

interface TableProps {
  tableData: Record<string, any>;
}

function Table({ tableData }: TableProps) {
  return (
    <div className="table">
      <h2>Flavanoids calculations</h2>
      <table className="table table-bordered table-hover" style={{ border: "2px solid black" }}>
        <thead>
          <tr className="class">
            <th style={{backgroundColor:"#d7e3b7"}}>Measure</th>
            {Object.keys(tableData).map((key) => (
              <th key={key} style={{backgroundColor:"#afede4"}}>
                Alcohol Class {String(parseInt(key) + 1)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr >
            <th scope="row">Flavanoid Mean</th>
            {Object.keys(tableData).map((key) => (
              <th key={key}>
                {tableData[key]["flavanoidsMean"]}
              </th>
            ))}
          </tr>
          <tr >
            <th scope="row">Flavanoid Median</th>
            {Object.keys(tableData).map((key) => (
              <th key={key}>
                {tableData[key]["flavanoidsMedian"]}
              </th>
            ))}
          </tr>
          <tr >
            <th scope="row">Flavanoid Mode</th>
            {Object.keys(tableData).map((key) => (
              <th key={key}>
                {tableData[key]["flavanoidsMode"]}
              </th>
            ))}
          </tr>
        </tbody>
      </table>
      <p></p>
      <h2>Gamma Calculations</h2>
      <table className="table table-bordered table-hover" style={{ border: "2px solid black" }}>
        <thead>
          <tr className="class">
          <th style={{backgroundColor:"#d7e3b7"}}>Measure</th>
            {Object.keys(tableData).map((key) => (
              <th key={key} style={{backgroundColor:"#afede4"}}>
                Alcohol Class {String(parseInt(key) + 1)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr >
            <th scope="row">Gamma Mean</th>
            {Object.keys(tableData).map((key) => (
              <th key={key}>
                {tableData[key]["gammaMean"]}
              </th>
            ))}
          </tr>
          <tr style={{ background: "yellow" }}>
            <th scope="row">Gamma Median</th>
            {Object.keys(tableData).map((key) => (
              <th key={key}>
                {tableData[key]["gammaMedian"]}
              </th>
            ))}
          </tr>
          <tr style={{ background: "yellow" }}>
            <th scope="row">Gamma Mode</th>
            {Object.keys(tableData).map((key) => (
              <th key={key}>
                {tableData[key]["gammaMode"]}
              </th>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Table;
