import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface PrescriptionPdfData {
  clinicName?: string;
  doctorName?: string;
  doctorDegree?: string;
  doctorRegNo?: string;
  patientName: string;
  patientAge?: number;
  patientGender?: string;
  patientCaseId: string;
  prescriptionDate: string;
  remedies: Array<{
    remedy_name: string;
    potency?: string;
    dosage?: string;
    repetition?: string;
    instructions?: string;
  }>;
  followUpDate?: string;
  notes?: string;
}

export function generatePrescriptionPdf(data: PrescriptionPdfData) {
  const doc = new jsPDF();

  // Header Banner
  doc.setFillColor(15, 23, 42); // Slate-900
  doc.rect(0, 0, 210, 35, 'F');

  // Clinic Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(data.clinicName || "Dr. ZAID'S HOMEO CARE", 14, 18);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Advanced Homeopathic Clinic & EMR System', 14, 25);

  // Doctor Details Right Aligned
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(data.doctorName || 'Dr. MD Zaid', 196, 15, { align: 'right' });
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(data.doctorDegree || 'B.H.M.S. (Homeopathy)', 196, 21, { align: 'right' });
  doc.text(`Reg. No: ${data.doctorRegNo || 'REG-58291'}`, 196, 27, { align: 'right' });

  // Patient Info Box
  doc.setDrawColor(226, 232, 240); // Slate-200
  doc.setFillColor(248, 250, 252); // Slate-50
  doc.roundedRect(14, 42, 182, 28, 3, 3, 'FD');

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`Patient Name: ${data.patientName}`, 18, 51);
  doc.text(`Case ID: ${data.patientCaseId}`, 18, 59);

  const ageGenderStr = `${data.patientAge ? `${data.patientAge} yrs` : ''} ${data.patientGender ? `/ ${data.patientGender}` : ''}`;
  doc.text(`Age / Gender: ${ageGenderStr || 'N/A'}`, 130, 51);
  doc.text(`Date: ${data.prescriptionDate}`, 130, 59);

  // Rx Symbol
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(5, 150, 105); // Emerald-600
  doc.text('Rx', 14, 80);

  // Remedies Table
  const tableData = data.remedies.map((item, index) => [
    (index + 1).toString(),
    item.remedy_name,
    item.potency || '-',
    item.dosage || '-',
    item.repetition || '-',
    item.instructions || '-',
  ]);

  autoTable(doc, {
    startY: 85,
    head: [['#', 'Remedy Name', 'Potency', 'Dosage', 'Repetition', 'Instructions']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [5, 150, 105], // Emerald-600
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 9,
      cellPadding: 4,
    },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 50, fontStyle: 'bold' },
      2: { cellWidth: 25 },
      3: { cellWidth: 30 },
      4: { cellWidth: 30 },
      5: { cellWidth: 37 },
    },
  });

  // Footer / Follow up
  const finalY = (doc as any).lastAutoTable?.finalY || 150;

  if (data.followUpDate) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(`Next Follow-Up Date: ${data.followUpDate}`, 14, finalY + 15);
  }

  // Doctor Signature Placeholder
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text("Doctor's Signature", 196, finalY + 30, { align: 'right' });
  doc.setLineWidth(0.5);
  doc.line(140, finalY + 23, 196, finalY + 23);

  // Bottom Notice
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Take medicines strictly as prescribed. Keep away from strong sunlight or pungent odors.', 105, 285, { align: 'center' });

  // Save PDF
  doc.save(`Prescription_${data.patientCaseId}_${new Date().toISOString().split('T')[0]}.pdf`);
}
