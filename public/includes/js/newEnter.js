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
                    alert('Saved!!');
                
                }else {
                    alert('Error. Please try again.');
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
        userId: 1,
        glucose: field_Glucose.value,
        unityId: 1,
        date: field_Date.value.slice(0, 10),
        hour: '00:00:00',
        markerMealId: field_Markermeal.selectedIndex
    });
}

function showMessageAlert(){
    alert('Please, fill in all the fields.');
}

function getJwtToken() {
    return sessionStorage.getItem("jwt")
}