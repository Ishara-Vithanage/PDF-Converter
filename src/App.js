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
        allSheets.push({ name: sheetName, data: sheetData });
      });

      setSheetsData(allSheets);
    };

    reader.readAsBinaryString(file);
  };

  const downloadPdf = async (sheet) => {
    // Select the table by ID
    const tableElement = document.getElementById(`table-${sheet.name}`);
    
    // Capture the HTML content as a canvas
    const canvas = await html2canvas(tableElement, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');

    // Set up jsPDF with landscape orientation and A4 size
    const pdf = new jsPDF({
      orientation: 'landscape', // Options: 'portrait' or 'landscape'
      unit: 'mm',
      format: 'a4',
    });

    // Adjust dimensions to fit content on the page
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth - 20;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Set font sizes
    pdf.setFontSize(14); // Adjust font size as needed

    // Add image to PDF at calculated size
    pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);

    // Save the generated PDF
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
          <button onClick={() => downloadPdf(sheet)}>Download PDF</button>
        </div>
      ))}
    </div>
  );
};

export default ExcelToPdfStyled;
