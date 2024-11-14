// ExcelToPdf.js
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Document, Page, Text, PDFDownloadLink } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import styles from './styles/pdfStyles';
import './App.css';

const ExcelToPdf = () => {
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

  const generatePdfDocument = (sheet) => (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>{sheet.name}</Text>
        {sheet.data.map((row, rowIndex) => (
          <Text key={rowIndex} style={styles.row}>
            {row.join(', ')}
          </Text>
        ))}
      </Page>
    </Document>
  );

  const handlePdfDownload = (sheet) => {
    const blob = new Blob([generatePdfDocument(sheet)], { type: 'application/pdf' });
    saveAs(blob, `${sheet.name}.pdf`);
  };

  return (
    <div className="excel-to-pdf">
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      {sheetsData.map((sheet) => (
        <div key={sheet.name} className="sheet-item">
          <h3>{sheet.name}</h3>
          <PDFDownloadLink
            document={generatePdfDocument(sheet)}
            fileName={`${sheet.name}.pdf`}
          >
            {({ loading }) => (loading ? 'Generating...' : 'Download PDF')}
          </PDFDownloadLink>
          <button onClick={() => handlePdfDownload(sheet)}>Download PDF</button>
        </div>
      ))}
    </div>
  );
};

export default ExcelToPdf;
