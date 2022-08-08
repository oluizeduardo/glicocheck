function checkAuthToken(){
    const jwtToken = getJwtToken();
    if (!jwtToken) {
        location.href = './index.html';
    }else{
        loadChart();
    }
}

function getJwtToken() {
    return sessionStorage.getItem("jwt")
}

function logOut(){
    sessionStorage.clear();
    location.href = './index.html';
}

checkAuthToken();