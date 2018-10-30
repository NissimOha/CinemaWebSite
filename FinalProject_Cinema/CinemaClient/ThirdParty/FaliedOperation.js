function fail(message) {
    if (message.status == 401) {
        sessionStorage.setItem("token", JSON.stringify(""));
        sessionStorage.setItem("isAdmin", JSON.stringify(""));
        alert("יש להתחבר תחילה");
        window.location.href = "../Login/Login.html";
    }
    else {
        alert("Error occurred: " + "Status: " + message.statusText + " Message: " + message.responseJSON);
    }
}