import React from 'react';
import jsPDF from 'jspdf';

function GenerarPDF() {
  const generatePDF = () => {
    const doc = new jsPDF();

    doc.text('Hello world!', 10, 10);
    doc.text(
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      10,
      20
    );
    
    // You can add more content, images, etc.
    
    doc.save('example.pdf');
  };

  return (
    <div>
      <h1>Generar PDF</h1>
      <button onClick={generatePDF}>Descargar PDF</button>
    </div>
  );
}

export default GenerarPDF;
