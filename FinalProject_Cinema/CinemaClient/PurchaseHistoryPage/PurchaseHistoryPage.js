$(document).ready(function () {

    function init() {
        let userName = JSON.parse(sessionStorage.getItem("name"));
        let token = JSON.parse(sessionStorage.getItem("token"));

        $("#hello")[0].text = "שלום: " + userName;
        isAdmin = JSON.parse(sessionStorage.getItem("isAdmin"));
        if (isAdmin === true)
            setAdminSideBar();
        else
            setUserSideBar();


        GlobalAjaxToken(GetPersonUrl() + "GetPurchaseHistory/" + userName, "Get", "", token, success, fail);
    }

    function success(purchaseHistory) {
        for (i in purchaseHistory) {
            $("#movies").append(getTr(purchaseHistory[i]));
        }
    }

    function getTr(purchaseHistory) {
        let date = getDateFormat(purchaseHistory.purchaseDate);
        let time = getHourFormat(purchaseHistory.purchaseDate);

        return `<tr class="trStyle tr">
                                    <td>
                                        <span">${purchaseHistory.movieName}</span>
                                        <br />
                                        <img class="posterImg w3-container" src="${purchaseHistory.posterUrl}"></img>
                                    </td>
                                    <td>
                                        <span class="p_date">${date}</span>
                                        <br \>
                                        <span class="p_date">${time}</span>
                                    </td>
                                    <td>
                                        <span class="pnOs">${purchaseHistory.purchaseAmount}</span>
                                    </td>
                                    <td>
                                        <span class="oTp">${purchaseHistory.ticketPrice} ש"ח</span>
                                    </td>
                                    <td>
                                        <span class="pyear">${purchaseHistory.totalPrice} ש"ח</span>
                                    </td>
                                </tr>`
    }

    function fail(message) {
        if (message.status == 401) {
            alert("You have to login first");
            window.location.href = "../Login/Login.html";
        }
        else {
            alert("error occured: " + "Status: " + message.statusText + " message: " + message);
        }
    }

    function setAdminSideBar() {
        $("#aLogin").attr("href", "../Login/login.html");
        $("#aLogin")[0].text = "התנתק";
        $("#aLogin").attr("class", "visible w3-bar-item w3-button w3-center");
        $("#aAdminPage").attr("class", "visible w3-bar-item w3-button w3-center");
    }

    function setUserSideBar() {
        $("#aLogin").attr("href", "../Login/login.html");
        $("#aLogin")[0].text = "התנתק";
        $("#aLogin").attr("class", "visible w3-bar-item w3-button w3-center");
        $("#aAdminPage").attr("class", "none");
    }

    init();
})