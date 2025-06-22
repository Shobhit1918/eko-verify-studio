
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
  let yPosition = 30;

  // Add Eko Shield logo (top right)
  const logoImg = new Image();
  logoImg.src = '/lovable-uploads/cb6255c2-8a31-4856-b9b4-3aaf40ed7f92.png';
  
  // Convert image to base64 and add to PDF
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 50;
  canvas.height = 50;
  
  logoImg.onload = () => {
    if (ctx) {
      ctx.drawImage(logoImg, 0, 0, 50, 50);
      const logoDataUrl = canvas.toDataURL('image/png');
      doc.addImage(logoDataUrl, 'PNG', pageWidth - 60, 10, 40, 40);
    }
  };

  // Add logo placeholder for immediate use
  doc.setFillColor(245, 158, 11); // Gold color matching the logo
  doc.roundedRect(pageWidth - 60, 10, 40, 40, 5, 5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('EKO', pageWidth - 52, 25);
  doc.text('SHIELD', pageWidth - 55, 35);

  // Reset text color
  doc.setTextColor(0, 0, 0);

  // Header with professional styling
  doc.setFillColor(37, 99, 235); // Blue header background
  doc.rect(0, 0, pageWidth, 25, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('EKO SHIELD - VERIFICATION REPORT', 20, 16);

  // Reset text color for body
  doc.setTextColor(0, 0, 0);
  yPosition = 35;

  // Report metadata section
  doc.setFillColor(248, 250, 252); // Light gray background
  doc.rect(15, yPosition, pageWidth - 30, 25, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.rect(15, yPosition, pageWidth - 30, 25);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Report Summary', 20, yPosition + 8);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${new Date().toLocaleString()}`, 20, yPosition + 16);
  doc.text(`Total Verifications: ${results.length}`, 20, yPosition + 22);
  
  const successCount = results.filter(r => r.status === 'SUCCESS').length;
  const successRate = results.length > 0 ? ((successCount / results.length) * 100).toFixed(1) : '0';
  doc.text(`Success Rate: ${successRate}%`, pageWidth - 80, yPosition + 16);
  doc.text(`Successful: ${successCount}`, pageWidth - 80, yPosition + 22);

  yPosition += 35;

  // Add charts section
  if (results.length > 0) {
    // Chart 1: Success vs Failure pie chart
    const chartY = yPosition;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Verification Status Distribution', 20, chartY);
    
    // Draw pie chart
    const centerX = 60;
    const centerY = chartY + 30;
    const radius = 20;
    
    const failureCount = results.length - successCount;
    const successAngle = (successCount / results.length) * 360;
    
    // Success slice (green)
    doc.setFillColor(34, 197, 94);
    if (successCount > 0) {
      drawPieSlice(doc, centerX, centerY, radius, 0, successAngle);
    }
    
    // Failure slice (red)
    doc.setFillColor(239, 68, 68);
    if (failureCount > 0) {
      drawPieSlice(doc, centerX, centerY, radius, successAngle, 360);
    }
    
    // Legend
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setFillColor(34, 197, 94);
    doc.rect(100, chartY + 20, 8, 6, 'F');
    doc.setTextColor(0, 0, 0);
    doc.text(`Success (${successCount})`, 112, chartY + 25);
    
    doc.setFillColor(239, 68, 68);
    doc.rect(100, chartY + 30, 8, 6, 'F');
    doc.text(`Failed (${failureCount})`, 112, chartY + 35);

    // Chart 2: Category breakdown
    const categories = [...new Set(results.map(r => r.category))];
    if (categories.length > 1) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Category Breakdown', pageWidth - 100, chartY);
      
      // Simple bar chart
      const barX = pageWidth - 90;
      const barY = chartY + 15;
      const barWidth = 60;
      const maxBarHeight = 40;
      
      categories.forEach((category, index) => {
        const count = results.filter(r => r.category === category).length;
        const barHeight = (count / results.length) * maxBarHeight;
        const currentBarY = barY + (index * 8);
        
        // Bar background
        doc.setFillColor(226, 232, 240);
        doc.rect(barX, currentBarY, barWidth, 6, 'F');
        
        // Bar fill
        const colors = [
          [59, 130, 246], // Blue
          [16, 185, 129], // Green
          [245, 158, 11], // Orange
          [139, 92, 246], // Purple
          [239, 68, 68]   // Red
        ];
        const color = colors[index % colors.length];
        doc.setFillColor(color[0], color[1], color[2]);
        doc.rect(barX, currentBarY, (count / results.length) * barWidth, 6, 'F');
        
        // Label
        doc.setFontSize(8);
        doc.setTextColor(0, 0, 0);
        doc.text(`${category}: ${count}`, barX + barWidth + 5, currentBarY + 4);
      });
    }

    yPosition += 70;
  }

  // Add separator line
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(20, yPosition, pageWidth - 20, yPosition);
  yPosition += 15;

  // Results section header
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Detailed Verification Results', 20, yPosition);
  yPosition += 15;

  // Individual results with enhanced formatting
  results.forEach((result, index) => {
    // Check if we need a new page
    if (yPosition > pageHeight - 100) {
      doc.addPage();
      yPosition = 30;
    }

    // Result container with enhanced styling
    const boxHeight = 70;
    let headerColor: [number, number, number];
    let bgColor: [number, number, number];
    
    if (result.status === 'SUCCESS') {
      headerColor = [34, 197, 94]; // Green
      bgColor = [240, 253, 244]; // Light green
    } else {
      headerColor = [239, 68, 68]; // Red
      bgColor = [254, 242, 242]; // Light red
    }

    // Main container background (removed shadow effect)
    doc.setFillColor(...bgColor);
    doc.roundedRect(15, yPosition, pageWidth - 30, boxHeight, 3, 3, 'F');

    // Header section
    doc.setFillColor(...headerColor);
    doc.roundedRect(15, yPosition, pageWidth - 30, 15, 3, 3, 'F');
    
    // Result number and service name
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`${index + 1}. ${result.service}`, 20, yPosition + 10);
    
    // Status badge
    doc.setFontSize(9);
    const statusWidth = doc.getTextWidth(result.status) + 6;
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(pageWidth - 25 - statusWidth, yPosition + 3, statusWidth, 9, 2, 2, 'F');
    doc.setTextColor(...headerColor);
    doc.text(result.status, pageWidth - 22 - statusWidth + 3, yPosition + 9);

    // Reset for content
    doc.setTextColor(0, 0, 0);
    yPosition += 20;

    // Content in two columns
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    
    // Left column - Input Data
    doc.setFont('helvetica', 'bold');
    doc.text('Input Parameters:', 20, yPosition);
    doc.setFont('helvetica', 'normal');
    yPosition += 6;
    
    if (result.data && Object.keys(result.data).length > 0) {
      Object.entries(result.data).forEach(([key, value], idx) => {
        if (idx < 3) { // Limit to prevent overflow
          const text = `• ${key}: ${typeof value === 'object' ? JSON.stringify(value).substring(0, 30) + '...' : String(value).substring(0, 30)}`;
          doc.text(text, 22, yPosition);
          yPosition += 4;
        }
      });
    }

    // Right column - Response Data
    const rightColumnX = pageWidth / 2 + 10;
    let rightColumnY = yPosition - (Object.keys(result.data || {}).length * 4) - 6;
    
    doc.setFont('helvetica', 'bold');
    doc.text('Verification Result:', rightColumnX, rightColumnY);
    doc.setFont('helvetica', 'normal');
    rightColumnY += 6;

    if (result.status === 'SUCCESS' && result.response) {
      if (result.response.verified !== undefined) {
        const verifiedText = result.response.verified ? '✓ Verified' : '✗ Not Verified';
        doc.setTextColor(result.response.verified ? 34 : 239, result.response.verified ? 197 : 68, result.response.verified ? 94 : 68);
        doc.text(verifiedText, rightColumnX + 2, rightColumnY);
        doc.setTextColor(0, 0, 0);
        rightColumnY += 5;
      }
      
      if (result.response.confidence !== undefined) {
        doc.text(`Confidence: ${result.response.confidence}%`, rightColumnX + 2, rightColumnY);
        rightColumnY += 5;
      }
    } else if (result.error) {
      doc.setTextColor(239, 68, 68);
      const errorLines = doc.splitTextToSize(`Error: ${result.error}`, pageWidth / 2 - 30);
      doc.text(errorLines, rightColumnX + 2, rightColumnY);
      doc.setTextColor(0, 0, 0);
    }

    // Timestamp
    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128);
    doc.text(`Processed: ${result.timestamp.toLocaleString()}`, 20, yPosition + 15);
    doc.setTextColor(0, 0, 0);

    yPosition += 85;
  });

  // Footer on all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    
    // Footer background
    doc.setFillColor(248, 250, 252);
    doc.rect(0, pageHeight - 20, pageWidth, 20, 'F');
    
    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128);
    doc.text(`Generated by Eko Shield Verification System`, 20, pageHeight - 8);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - 40, pageHeight - 8);
    doc.text(`Confidential Document - ${new Date().toLocaleDateString()}`, pageWidth / 2 - 40, pageHeight - 8);
  }

  // Save the PDF
  doc.save(filename);
};

// Helper function to draw pie slices
function drawPieSlice(doc: jsPDF, centerX: number, centerY: number, radius: number, startAngle: number, endAngle: number) {
  const startRad = (startAngle * Math.PI) / 180;
  const endRad = (endAngle * Math.PI) / 180;
  
  doc.moveTo(centerX, centerY);
  doc.lineTo(centerX + radius * Math.cos(startRad), centerY + radius * Math.sin(startRad));
  
  // Simple arc approximation
  const steps = Math.max(1, Math.floor((endAngle - startAngle) / 10));
  for (let i = 0; i <= steps; i++) {
    const angle = startRad + (i / steps) * (endRad - startRad);
    doc.lineTo(centerX + radius * Math.cos(angle), centerY + radius * Math.sin(angle));
  }
  
  doc.lineTo(centerX, centerY);
  doc.fill();
}
