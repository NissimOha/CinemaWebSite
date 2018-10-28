$(document).ready(function () {
    let rowCtr = -1;
    let movies;
    let movieNames = new Array();
    let sMovies = new Array();

    function init() {
        let isAdmin = JSON.parse(sessionStorage.getItem("isAdmin"));
        if (isAdmin === true)
            setAdminSideBar();
        else if (isAdmin === false)
            setUserSideBar();
        else
            setViewerSideBar();

        token = JSON.parse(sessionStorage.getItem("token"));
        GlobalAjax(GetMovieUrl() + "GetAllMoives", "GET", "", getMovies, fail);
    }

    function getMovies(allMovies) {
        let ctr = 1;
        let curTr = $("#movies");
        movies = allMovies;

        for (i in movies) {
            movieNames.push(movies[i].name);
        }

        for (i in movies) {
            if (ctr % 4 != 0) {
                curTr.append(getTr(movies[i], i));
                ctr++;
            }
            else {
                curTr.append(getTr(movies[i], i));
                curTr = $("<tr>");
                $("#movies").append(curTr);
                ctr++;
            }
        }

        registerToEvent();
    }

    function getTr(movies, index) {
        rowCtr = rowCtr + 1;
        return `<td class="Movies">
            <div class="w3-blue-gray">${movies.name}</div>
            <img class="w3-centered posterImg" src="${movies.posterUrl}"></img>
            <div id="${index}" class="details w3-blue-gray"><i class="fa fa-info-circle"></i></div>
        </td>`
    }

    function showDetails(movie) {
        let i = movie.id;
        let date = getDateFormat(movies[i].movieDate);
        let time = getHourFormat(movies[i].movieDate);

        $("#movieName").html(movies[i].name);
        $("#movieDate").html(date + "\n" + time);
        $("#numOfSeat").html(movies[i].numOfSeat);
        $("#ticketPrice").html(movies[i].ticketPrice + " ש\"ח");
        $("#pYear").html(movies[i].pYear);
        $("#length").html(movies[i].length);
        $("#catagory").html(movies[i].catagory);


        document.getElementById('ShowDetailsWindow').style.display = 'block';
    }

    function exitShowDetails() {
        document.getElementById('ShowDetailsWindow').style.display = 'none';
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

    function registerToEvent() {
        $(".details").on("click", function () { showDetails(this); });
        $('#exitShowDetails').on("click", exitShowDetails);
        $('.posterImg').on("mouseover", function () { spinImage(this); });
        $('.posterImg').on("mouseout", function () { stopSpinImage(this); });
        $("#search").on("keyup", function () { search(this); });
    }

    function search(sWard) {
        console.log(sWard.value);
        sMovies = [];
        for (var i = 0; i < movies.length; i++) {
            if (movieNames[i].includes(sWard.value))
                sMovies.push(movies[i]);
        }
        clearMovies();
        getSearchMovies(sMovies);
    }

    function getSearchMovies(searchMovies) {
        let ctr = 1;
        let curTr = $("#movies");

        for (i in searchMovies) {
            if (ctr % 4 != 0) {
                curTr.append(getTr(searchMovies[i], i));
                ctr++;
            }
            else {
                curTr.append(getTr(searchMovies[i], i));
                curTr = $("<tr>");
                $("#movies").append(curTr);
                ctr++;
            }
        }
        ctr = 0;
    }

    function clearMovies() {
        var $movTd = $("td");
        for (let i = 0; i < $movTd.length; i++) {
            $movTd.remove();
        }
        var $movT = $("tbody");
        for (let i = 0; i < $movT.length; i++) {
            $movT.remove();
        }
    }

    function spinImage(img) {
        img.classList.add("image-rotate-horizontal");
    }

    function stopSpinImage(img) {
        img.classList.remove("image-rotate-horizontal");
    }

    function setAdminSideBar() {
        $("#hello")[0].text = "שלום: " + JSON.parse(sessionStorage.getItem("name"));
        $("#hello").attr("class", "visible w3-bar-item w3-center w3-teal");
        $("#aLogin").attr("href", "../Login/login.html");
        $("#aLogin")[0].text = "התנתק";
        $("#aLogin").attr("class", "visible w3-bar-item w3-button w3-center");
        $("#aAdminPage").attr("class", "visible w3-bar-item w3-button w3-center");
    }

    function setUserSideBar() {
        $("#hello")[0].text = "שלום: " + JSON.parse(sessionStorage.getItem("name"));
        $("#hello").attr("class", "visible w3-bar-item w3-center w3-teal");
        $("#aLogin").attr("href", "../Login/login.html");
        $("#aLogin")[0].text = "התנתק";
        $("#aLogin").attr("class", "visible w3-bar-item w3-button w3-center");
        $("#aAdminPage").attr("class", "none");
    }

    function setViewerSideBar() {
        $("#hello").attr("class", "none");
        $("#aLogin").attr("href", "../Login/login.html");
        $("#aLogin")[0].text = "התחברות";
        $("#aLogin").attr("class", "visible w3-bar-item w3-button w3-center");
        $("#aPurchasePage").attr("class", "none");
        $("#PurchaseHistoryPage").attr("class", "none");
        $("#aAdminPage").attr("class", "none");
    }

    init();
})