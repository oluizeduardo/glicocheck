function checkAuthToken(){
    const jwtToken = getJwtToken();
    if (!jwtToken) {
        location.href = './index.html';
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