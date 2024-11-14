// ExcelToStyledPdf.js
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { PDFDocument, rgb } from 'pdf-lib';
import { saveAs } from 'file-saver';

const ExcelToStyledPdf = () => {
  const [sheetsData, setSheetsData] = useState([]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const binaryStr = e.target.result;
      const workbook = XLSX.read(binaryStr, { type: 'binary' });
      const allSheets = [];

      workbook.SheetNames.forEach((sheetName) => {
        const worksheet = workbook.Sheets[sheetName];
        const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false });
        allSheets.push({ name: sheetName, data: sheetData });
      });

      setSheetsData(allSheets);
    };

    reader.readAsBinaryString(file);
  };

  const generateStyledPdf = async (sheet) => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]); // A4 size in points (72 DPI)
    const fontSize = 10;
    const rowHeight = 20;
    const margin = 40;
    let yPosition = page.getHeight() - margin;

    sheet.data.forEach((row, rowIndex) => {
      let xPosition = margin;

      row.forEach((cell, colIndex) => {
        // Draw cell background color for illustration (adjust color based on need)
        page.drawRectangle({
          x: xPosition,
          y: yPosition - rowHeight,
          width: 100,
          height: rowHeight,
          color: rgb(0.95, 0.95, 0.95),
        });

        // Draw cell text
        page.drawText(cell ? cell.toString() : '', {
          x: xPosition + 5,
          y: yPosition - 15,
          size: fontSize,
          color: rgb(0, 0, 0),
        });

        // Draw cell border (for illustration, adjust width and colors as desired)
        page.drawLine({
          start: { x: xPosition, y: yPosition - rowHeight },
          end: { x: xPosition + 100, y: yPosition - rowHeight },
          thickness: 0.5,
          color: rgb(0.2, 0.2, 0.2),
        });
        page.drawLine({
          start: { x: xPosition, y: yPosition },
          end: { x: xPosition, y: yPosition - rowHeight },
          thickness: 0.5,
          color: rgb(0.2, 0.2, 0.2),
        });

        xPosition += 100;
      });
      yPosition -= rowHeight;
    });

    const pdfBytes = await pdfDoc.save();
    saveAs(new Blob([pdfBytes], { type: 'application/pdf' }), `${sheet.name}.pdf`);
  };

  return (
    <div className="excel-to-pdf">
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      {sheetsData.map((sheet) => (
        <div key={sheet.name} className="sheet-item">
          <h3>{sheet.name}</h3>
          <button onClick={() => generateStyledPdf(sheet)}>Download Styled PDF</button>
        </div>
      ))}
    </div>
  );
};

export default ExcelToStyledPdf;
