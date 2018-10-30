$(document).ready(function () {
    let rUser;

    //ajax animation
    var $loading = $("#loading").hide();
    $(document)
        .ajaxStart(function () {
            $loading.show();
        })
        .ajaxStop(function () {
            $loading.hide();
        });

    function init() {
        sessionStorage.setItem("token", JSON.stringify(""));
        sessionStorage.setItem("isAdmin", JSON.stringify(""));
        registerToEvent();
        AllowOnlynNmbers();
    }

    function signUp() {
        $("#rUserName").val("");
        $("#rPassward").val("");
        $("#rFirstName").val("");
        $("#rLastName").val("");
        document.getElementById('signUpWindow').style.display = 'block';
        $loading = $("#rloading").hide();
    }

    function exitSignUp() {
        document.getElementById('signUpWindow').style.display = 'none';
        $loading = $("#loading").hide();
    }

    function register() {
        let rUserName = $("#rUserName").val();
        let rPassward = $("#rPassward").val();
        let rFirstName = $("#rFirstName").val();
        let rLastName = $("#rLastName").val();
        if (rUserName == "" || rPassward == "" || rFirstName == "" || rLastName == "") {
            alert("You have fill all the fields");
            return;
        }
        rUser = {
            userName: rUserName,
            passward: rPassward,
            firstName: rFirstName,
            lastName: rLastName
        }
        GlobalAjax(GetPersonUrl() + "AddUser/", "POST", rUser, registerSuccess, fail);
    }

    function registerSuccess(message) {
        if (message === true) {
            alert("הרישום עברה בהצלחה");
            exitSignUp();
        }
        else {
            alert(message);
        }
    }

    function login() {
        let userName = $("#userName").val();
        let passward = $("#passward").val();
        user = {
            userName: userName,
            passward: passward
        };

        if (userName == "" || passward == "") {
            alert("You have to type user name and passward");
            return;
        }

        GlobalAjax(GetPersonUrl() + "GetToken", "POST", user, loginSuccess, fail);
    }

    function loginSuccess(message) {
        sessionStorage.setItem("token", JSON.stringify(message));
        sessionStorage.setItem("name", JSON.stringify(user.userName));
        GlobalAjaxToken(GetPersonUrl() + "IsAdmin/" + user.userName, "GET", "", message, loginSelection, fail);
    }

    function loginSelection(message) {
        sessionStorage.setItem("isAdmin", JSON.stringify(message));
        if (message === true || message === false) {
            window.location.href = "../PurchasePage/PurchasePage.html";
        }
        else {
            alert(message);
        }
    }

    function registerToEvent() {
        $("#userName").on("focus", { name: "#userName" }, focused);
        $("#passward").on("focus", { name: "#passward" }, focused);
        $("#userName").on("blur", { name: "#userName" }, lostFocuse);
        $("#passward").on("blur", { name: "#passward" }, lostFocuse);

        $("#rUserName").on("focus", { name: "#rUserName" }, focused);
        $("#rPassward").on("focus", { name: "#rPassward" }, focused);
        $("#rFirstName").on("focus", { name: "#rFirstName" }, focused);
        $("#rLastName").on("focus", { name: "#rLastName" }, focused);
        $("#rUserName").on("blur", { name: "#rUserName" }, lostFocuse);
        $("#rPassward").on("blur", { name: "#rPassward" }, lostFocuse);
        $("#rFirstName").on("blur", { name: "#rFirstName" }, lostFocuse);
        $("#rLastName").on("blur", { name: "#rLastName" }, lostFocuse);
        $("#register").on("click", register);
        $('#exitSignUp').on("click", exitSignUp);

        $("#login").on("click", login);
        $("#signUp").on("click", signUp);
    }

    function focused(event) {
        $(event.data.name).attr("class", "focuse");
    }

    function lostFocuse(event) {
        $(event.data.name).attr("class", "lostFocuse");
    }

    init();
})