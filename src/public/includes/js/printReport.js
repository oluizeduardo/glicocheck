document.getElementById('btnExport').addEventListener('click', () => {
  const element = document.getElementById('myChart');
  const opt = {
    margin: 15,
    filename: 'Glicocheck-GlucoseReport.pdf',
    html2canvas: {scale: 2},
    jsPDF: {unit: 'mm', format: 'A4', orientation: 'landscape'},
  };
  html2pdf().set(opt).from(element).save();
});
