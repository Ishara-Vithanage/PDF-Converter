// ExcelToPdfStyled.js
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import './App.css';

const ExcelToPdfStyled = () => {
  const [sheetsData, setSheetsData] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const binaryStr = e.target.result;
      const workbook = XLSX.read(binaryStr, { type: 'binary' });
      const allSheets = [];

      workbook.SheetNames.forEach((sheetName) => {
        const worksheet = workbook.Sheets[sheetName];
        const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Determine the max number of columns in the sheet
        const maxCols = Math.max(...sheetData.map(row => row.length));

        // Normalize rows by adding empty cells to match maxCols
        const normalizedData = sheetData.map(row => {
          const newRow = Array(maxCols).fill('');
          row.forEach((cell, index) => {
            newRow[index] = cell;
          });
          return newRow;
        });

        allSheets.push({ name: sheetName, data: normalizedData });
      });

      setSheetsData(allSheets);
    };

    reader.readAsBinaryString(file);
  };

  const downloadPdf = async (sheet) => {
    const tableElement = document.getElementById(`table-${sheet.name}`);
    const canvas = await html2canvas(tableElement, { scale: 3 });
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgWidth = pageWidth - 20;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
    pdf.save(`${sheet.name}.pdf`);
  };

  return (
    <div className="excel-to-pdf">
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      {sheetsData.map((sheet) => (
        <div key={sheet.name} className="sheet-container">
          <h3>{sheet.name}</h3>
          <div id={`table-${sheet.name}`} className="table-container">
            <table>
              <tbody>
                {sheet.data.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, colIndex) => (
                      <td key={colIndex}>{cell !== undefined ? cell : ''}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button onClick={() => downloadPdf(sheet)}>Download {sheet.name} PDF</button>
        </div>
      ))}
    </div>
  );
};

export default ExcelToPdfStyled;
