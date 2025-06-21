
import jsPDF from 'jspdf';

interface Result {
  id: number;
  service: string;
  category: string;
  status: string;
  data: any;
  response: any;
  error?: string;
  timestamp: Date;
}

export const generatePDF = (results: Result[], filename: string = 'verification_results.pdf') => {
  const doc = new jsPDF();
  const pageHeight = doc.internal.pageSize.height;
  let yPosition = 20;

  // Header
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Eko Shield - Verification Results Report', 20, yPosition);
  yPosition += 15;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, yPosition);
  yPosition += 10;

  doc.text(`Total Results: ${results.length}`, 20, yPosition);
  yPosition += 20;

  // Results
  results.forEach((result, index) => {
    // Check if we need a new page
    if (yPosition > pageHeight - 60) {
      doc.addPage();
      yPosition = 20;
    }

    // Result header
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`${index + 1}. ${result.service}`, 20, yPosition);
    yPosition += 8;

    // Result details
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    doc.text(`Category: ${result.category}`, 25, yPosition);
    yPosition += 6;
    
    doc.text(`Status: ${result.status}`, 25, yPosition);
    yPosition += 6;
    
    doc.text(`Timestamp: ${result.timestamp.toLocaleString()}`, 25, yPosition);
    yPosition += 6;

    // Input data
    if (result.data && Object.keys(result.data).length > 0) {
      doc.text('Input Data:', 25, yPosition);
      yPosition += 6;
      Object.entries(result.data).forEach(([key, value]) => {
        const text = `  ${key}: ${typeof value === 'object' ? JSON.stringify(value) : String(value)}`;
        const lines = doc.splitTextToSize(text, 160);
        doc.text(lines, 25, yPosition);
        yPosition += lines.length * 5;
      });
    }

    // Response data
    if (result.response) {
      doc.text('Response:', 25, yPosition);
      yPosition += 6;
      
      if (result.response.verified !== undefined) {
        doc.text(`  Verified: ${result.response.verified ? 'Yes' : 'No'}`, 25, yPosition);
        yPosition += 5;
      }
      
      if (result.response.confidence !== undefined) {
        doc.text(`  Confidence: ${result.response.confidence}%`, 25, yPosition);
        yPosition += 5;
      }
      
      if (result.response.details || result.response.message) {
        const details = result.response.details || result.response.message;
        const detailText = typeof details === 'object' ? JSON.stringify(details) : String(details);
        const lines = doc.splitTextToSize(`  Details: ${detailText}`, 160);
        doc.text(lines, 25, yPosition);
        yPosition += lines.length * 5;
      }
    }

    // Error if any
    if (result.error) {
      doc.setFont('helvetica', 'italic');
      const errorLines = doc.splitTextToSize(`Error: ${result.error}`, 160);
      doc.text(errorLines, 25, yPosition);
      yPosition += errorLines.length * 5;
      doc.setFont('helvetica', 'normal');
    }

    yPosition += 10; // Space between results
  });

  // Save the PDF
  doc.save(filename);
};
