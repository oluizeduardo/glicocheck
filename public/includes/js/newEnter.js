const btnSave = document.getElementById('btnSave');
let field_Glucose = document.getElementById("field_Glucose");
let field_Date = document.getElementById("field_Date");
let field_Time = document.getElementById("field_Time");
let field_Markermeal = document.getElementById("field_Markermeal");

const CREATED = 200;
const XMLHTTPREQUEST_STATUS_DONE = 4;

btnSave.addEventListener('click', function(event){
    event.preventDefault();

    if(isValidDataEntry()){
        const xmlhttp = new XMLHttpRequest();        
        xmlhttp.onreadystatechange = () => {
            if (xmlhttp.readyState == XMLHTTPREQUEST_STATUS_DONE) 
            {
                if(xmlhttp.status == CREATED)
                {           
                    resetFields();
                    resetChart();                
                }else {
                    alert('Error. Please try again.\n'+xmlhttp.responseText);
                }
            }
        };
        sendPOSTToGlucose(xmlhttp);
    }else{
        showMessageAlert();
    }
});

function isValidDataEntry(){
    return (field_Glucose.value && field_Date.value && 
            field_Time.value && (field_Markermeal.selectedIndex > 0));
}

function sendPOSTToGlucose(xmlhttp){
    let jsonNewEnter = prepareJsonNewEnter();
    const token = getJwtToken();
    xmlhttp.open("POST", "/api/glucose");
    xmlhttp.setRequestHeader('Authorization', 'Bearer '+token);
    xmlhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xmlhttp.send(jsonNewEnter);
}

function prepareJsonNewEnter(){
    return JSON.stringify({
        userId: getUserId(),
        glucose: field_Glucose.value,
        unityId: 1,
        date: field_Date.value.slice(0, 10),
        hour: field_Time.value,
        markerMealId: field_Markermeal.selectedIndex
    });
}

function showMessageAlert(){
    alert('Please, fill in all the fields.');
}

function getJwtToken() {
    return sessionStorage.getItem("jwt")
}

function getUserId() {
    return sessionStorage.getItem("userId")
}

function loadDateAndTimeFields(){
    const field_Time = document.getElementById('field_Time');
    const field_Date = document.getElementById('field_Date');

    const dateObject = new Date();
    field_Time.value = dateObject.toLocaleTimeString('pt-BR');
    field_Date.value = dateObject.toLocaleDateString();
}

function resetFields(){
    field_Glucose.value='';
    field_Markermeal.selectedIndex = 0;

    // panel_welcome_center.removeChild(welcome_center)
    panel_welcome_center.classList.add('invisible');
    ctx.classList.remove('invisible');
    ctx.classList.add('visible');
}

function resetChart(){    
    destroyChart();
    loadGlucoseReadingsByUserId();
}