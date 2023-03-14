document.getElementById('btnExport').addEventListener('click', () => {
  const myCanvas = document.getElementById('myChart');
  const url = myCanvas.toDataURL();
  const win = window.open();
  const html = `<html>
      <head><title>Glicocheck - Report</title></head>
      <body>
        <img src='${url}'/>
      </body>
    <html>`;
  win.document.write(html);
  win.document.addEventListener(
      'load',
      function() {
        win.document.close();
        win.focus();
        win.print();
      },
      true,
  );
});
