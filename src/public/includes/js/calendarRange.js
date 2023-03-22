let today = new Date();
let day = today.getDate();
let month = today.getMonth() + 1;
const year = today.getFullYear();
if (day < 10) {
  day = '0' + day;
}
if (month < 10) {
  month = '0' + month;
}

today = year + '-' + month + '-' + day;
dateMin = (year-120) + '-01-01';
document.getElementById('field_DateOfBirth').setAttribute('min', dateMin);
document.getElementById('field_DateOfBirth').setAttribute('max', today);

const thisMonth = year+'-'+month;
const minMonth = (year-120)+'-'+month;
document.getElementById('field_DateOfDiagnosis').setAttribute('min', minMonth);
document.getElementById('field_DateOfDiagnosis').setAttribute('max', thisMonth);
