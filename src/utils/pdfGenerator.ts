
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
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  let yPosition = 20;

  // Add Eko Shield logo placeholder (top right)
  doc.setFillColor(0, 102, 204); // Blue color for logo background
  doc.rect(pageWidth - 60, 10, 50, 20, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('EKO SHIELD', pageWidth - 55, 18);
  doc.text('LOGO', pageWidth - 45, 25);

  // Reset text color
  doc.setTextColor(0, 0, 0);

  // Header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Eko Shield - Verification Results Report', 20, yPosition);
  yPosition += 20;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, yPosition);
  yPosition += 8;

  doc.text(`Total Results: ${results.length}`, 20, yPosition);
  yPosition += 20;

  // Add a separator line
  doc.setLineWidth(0.5);
  doc.line(20, yPosition, pageWidth - 20, yPosition);
  yPosition += 15;

  // Results
  results.forEach((result, index) => {
    // Check if we need a new page
    if (yPosition > pageHeight - 80) {
      doc.addPage();
      yPosition = 20;
    }

    // Determine colors based on status
    let boxColor: [number, number, number];
    let headerColor: [number, number, number];
    
    if (result.status === 'SUCCESS') {
      boxColor = [220, 252, 231]; // Light green
      headerColor = [34, 197, 94]; // Green
    } else {
      boxColor = [254, 226, 226]; // Light red
      headerColor = [239, 68, 68]; // Red
    }

    // Draw colored box background
    doc.setFillColor(...boxColor);
    doc.rect(15, yPosition - 5, pageWidth - 30, 50, 'F');

    // Draw border
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.rect(15, yPosition - 5, pageWidth - 30, 50);

    // Result header with colored background
    doc.setFillColor(...headerColor);
    doc.rect(15, yPosition - 5, pageWidth - 30, 12, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`${index + 1}. ${result.service}`, 20, yPosition + 3);
    
    // Status badge
    doc.setFontSize(10);
    doc.text(`[${result.status}]`, pageWidth - 60, yPosition + 3);

    // Reset text color for content
    doc.setTextColor(0, 0, 0);
    yPosition += 15;

    // Result details
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    
    doc.text(`Category: ${result.category}`, 20, yPosition);
    yPosition += 5;
    
    doc.text(`Timestamp: ${result.timestamp.toLocaleString()}`, 20, yPosition);
    yPosition += 8;

    // Input data section
    if (result.data && Object.keys(result.data).length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.text('Input Data:', 20, yPosition);
      doc.setFont('helvetica', 'normal');
      yPosition += 5;
      
      Object.entries(result.data).forEach(([key, value]) => {
        const text = `• ${key}: ${typeof value === 'object' ? JSON.stringify(value) : String(value)}`;
        const lines = doc.splitTextToSize(text, pageWidth - 50);
        doc.text(lines, 25, yPosition);
        yPosition += lines.length * 4;
      });
    }

    yPosition += 3;

    // Response section
    if (result.response && result.status === 'SUCCESS') {
      doc.setFont('helvetica', 'bold');
      doc.text('Response:', 20, yPosition);
      doc.setFont('helvetica', 'normal');
      yPosition += 5;
      
      if (result.response.verified !== undefined) {
        const verifiedText = result.response.verified ? '✓ Verified' : '✗ Not Verified';
        doc.setTextColor(result.response.verified ? 34 : 239, result.response.verified ? 197 : 68, result.response.verified ? 94 : 68);
        doc.text(`• ${verifiedText}`, 25, yPosition);
        doc.setTextColor(0, 0, 0);
        yPosition += 4;
      }
      
      if (result.response.confidence !== undefined) {
        doc.text(`• Confidence: ${result.response.confidence}%`, 25, yPosition);
        yPosition += 4;
      }
      
      if (result.response.details || result.response.message) {
        const details = result.response.details || result.response.message;
        const detailText = typeof details === 'object' ? JSON.stringify(details) : String(details);
        const lines = doc.splitTextToSize(`• Details: ${detailText}`, pageWidth - 50);
        doc.text(lines, 25, yPosition);
        yPosition += lines.length * 4;
      }
    }

    // Error section
    if (result.error) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(239, 68, 68); // Red color for errors
      doc.text('Error:', 20, yPosition);
      doc.setFont('helvetica', 'normal');
      yPosition += 5;
      
      const errorLines = doc.splitTextToSize(`• ${result.error}`, pageWidth - 50);
      doc.text(errorLines, 25, yPosition);
      yPosition += errorLines.length * 4;
      doc.setTextColor(0, 0, 0); // Reset color
    }

    yPosition += 15; // Space between results
  });

  // Footer on last page
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - 40, pageHeight - 10);
    doc.text('Generated by Eko Shield', 20, pageHeight - 10);
  }

  // Save the PDF
  doc.save(filename);
};
