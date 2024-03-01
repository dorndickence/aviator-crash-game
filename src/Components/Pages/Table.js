import React, { useState, useEffect } from "react";

const Table = () => {
  const [tableData, setTableData] = useState([
    { id: 1, name: "John", amount: 100 },
    { id: 2, name: "Alice", amount: 50 },
    { id: 3, name: "Bob", amount: 200 },
  ]);

  // Function to sort the table data by the "amount" column
  const sortTableByAmount = () => {
    const sortedData = [...tableData].sort((a, b) => b.amount - a.amount);
    setTableData(sortedData);
  };

  // Call the sortTableByAmount function whenever tableData changes
  useEffect(() => {
    sortTableByAmount();
  }, [tableData]);

  // Function to add a new row to the table
  const addRow = () => {
    const newRow = {
      id: Math.random(),
      name: "New User",
      amount: Math.random() * 1000,
    }; // Example new row data
    setTableData((prevData) => [...prevData, newRow]); // Add new row to tableData
  };

  return (
    <div>
      <button onClick={addRow}>Add Row</button>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row) => (
            <tr key={row.id}>
              <td>{row.name}</td>
              <td>{row.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
