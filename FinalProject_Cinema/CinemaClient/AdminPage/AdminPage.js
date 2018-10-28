$(document).ready(function () {
    let ctr = -1;
    let token;

    var $loading = $("#loading").hide();
    $(document)
        .ajaxStart(function () {
            $loading.show();
        })
        .ajaxStop(function () {
            $loading.hide();
        });

    function getMovies() {
        $("#hello")[0].text = "שלום: " + JSON.parse(sessionStorage.getItem("name"));
        setAdminSideBar();
        token = JSON.parse(sessionStorage.getItem("token"));
        GlobalAjaxToken(GetMovieUrl() + "GetAllMoivesSecure", "GET", "", token, init, fail);
    }

    function init(movies) {
        for (i in movies) {
            $("#movies").append(getTr(movies[i]));
        }
        AllowOnlynNmbers();
        registerToEvent();
    }

    function deleteMove(movie) {
        if (confirm("Are you sure you want to delete this movie?")) {
            var number = $(".pNumber" + movie.className.substring(19, 20))[0].innerHTML;
            GlobalAjaxToken(GetMovieUrl() + "DeleteMovie/" + number, "PUT", "", token, refresh, fail);
        } else {
            return;
        }
    }

    function addMovie() {
        $("#aMovieName").val("");
        $("#aNumOfSeat").val("");
        $("#aTicketPrice").val("");
        $("#aPYear").val("");
        $("#alength").val("");
        $("#aPoster").val("");

        var registerbuttn = $("#addToDb");
        registerbuttn.prop("disabled", true);
        registerbuttn.attr("class", "w3-red");

        document.getElementById('addMovieWindow').style.display = 'block';
        $loading = $("#aloading").hide();
    }

    function addToDb() {
        let form = new FormData();
        form.append("name", $("#aMovieName").val());
        form.append("movie_date", $("#aMovieDate").val());
        form.append("num_of_seat", $("#aNumOfSeat").val());
        form.append("ticket_price", $("#aTicketPrice").val());
        form.append("p_year", $("#aPYear").val());
        form.append("length", $("#alength").val());
        form.append("poster_url", $("#aPoster").val());
        form.append("catagory", $("#catagotyOptions option:selected").text());
        form.append("img", $("#aPoster")[0].files[0]);
        
        GlobalAjaxForFiles(GetMovieUrl() + "AddMovie", "POST", form, token, refresh, fail);
    }

    function validateAmount() {
        var amount = document.getElementsByTagName("input");
        let isEnable = true;
        let dateTime = $("#aMovieDate").val();

        let year = dateTime.substring(0, dateTime.indexOf("-"));

        if ($("#aMovieDate").val() == "" || $("#aMovieDate").val() == undefined) {
            isEnable = false;
            $("#aMovieDate").attr("class", "redAlert");
        }

        if (year < Date.now.year || year > 2050) {
            isEnable = false;
            $("#aMovieDate").attr("class", "redAlert");
        }

        for (i = 0; i < amount.length; i++) {
            if (!amount[i].checkValidity()) {
                isEnable = false;
                amount[i].className = "redAlert";
            }
        }
        var registerbuttn = $("#addToDb");
        if (isEnable) {
            registerbuttn.prop("disabled", false);
            registerbuttn.attr("class", "w3-green");
        }
        else {
            registerbuttn.prop("disabled", true);
            registerbuttn.attr("class", "w3-red");
        }
    }

    function exitAddMovie() {
        document.getElementById('addMovieWindow').style.display = 'none';
        $loading = $("#loading").hide();
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

    function refresh(message) {
        if (message === true) {
            location.reload();
        }
        else {
            alert(message);
            sessionStorage.removeItem("token");
            location.reload();
        }
    }

    function getTr(movies) {
        ctr = ctr + 1;
        let date = getDateFormat(movies.movieDate);
        let time = getHourFormat(movies.movieDate);

        return `<tr class="trStyle tr">
                                    <td>
                                        <span class="pNumber${ctr}">${movies.number}</span>
                                    </td>
                                    <td>
                                        <span class="pName">${movies.name}</span>
                                    </td>
                                    <td>
                                        <span class="p_date">${date}</span>
                                        <br \>
                                        <span class="p_date">${time}</span>
                                    </td>
                                    <td>
                                        <span class="pnOs">${movies.numOfSeat}</span>
                                    </td>
                                    <td>
                                        <span class="oTp">${movies.ticketPrice} ש"ח</span>
                                    </td>
                                    <td>
                                        <span class="pyear">${movies.pYear}</span>
                                    </td>
                                    <td>
                                        <span class="plen">${movies.length}</span>
                                    </td>
                                    <td>
                                        <span class="pcat">${movies.catagory}</span>
                                    </td>
                                    <td class="t">
                                        <img class="w3-centered posterImg pposter" src="${movies.posterUrl}"></img>
                                    </td>
                                    <td>
                                        <i class="fa fa-trash delete ${ctr}"></i>
                                    </td>
                                </tr>`
    }

    function setAdminSideBar() {
        $("#hello")[0].text = "שלום: " + JSON.parse(sessionStorage.getItem("name"));
        $("#aLogin").attr("href", "../Login/login.html");
        $("#aLogin")[0].text = "התנתק";
        $("#aLogin").attr("class", "visible w3-bar-item w3-button w3-center");
    }

    function registerToEvent() {
        $('input').on("blur", validateAmount);
        $("#addToDb").on("click", addToDb);
        $("#addMovie").on("click", addMovie);
        $('#exitAddMovie').on("click", exitAddMovie);
        $(".delete").on("click", function () { deleteMove(this); });

        $("#aMovieName").on("focus", { name: "#aMovieName" }, focused);
        $("#aMovieDate").on("focus", { name: "#aMovieDate" }, focused);
        $("#aNumOfSeat").on("focus", { name: "#aNumOfSeat" }, focused);
        $("#aTicketPrice").on("focus", { name: "#aTicketPrice" }, focused);
        $("#aPYear").on("focus", { name: "#aPYear" }, focused);
        $("#alength").on("focus", { name: "#alength" }, focused);
        $("#aPoster").on("focus", { name: "#aPoster" }, focused);
        $("#aMovieName").on("blur", { name: "#aMovieName" }, lostFocuse);
        $("#aMovieDate").on("blur", { name: "#aMovieDate" }, lostFocuse);
        $("#aNumOfSeat").on("blur", { name: "#aNumOfSeat" }, lostFocuse);
        $("#aTicketPrice").on("blur", { name: "#aTicketPrice" }, lostFocuse);
        $("#aPYear").on("blur", { name: "#aPYear" }, lostFocuse);
        $("#alength").on("blur", { name: "#alength" }, lostFocuse);
        $("#aPoster").on("blur", { name: "#aPoster" }, lostFocuse);
    }

    function focused(event) {
        $(event.data.name).attr("class", "focuse");
    }

    function lostFocuse(event) {
        $(event.data.name).attr("class", "lostFocuse");
    }

    getMovies();
})