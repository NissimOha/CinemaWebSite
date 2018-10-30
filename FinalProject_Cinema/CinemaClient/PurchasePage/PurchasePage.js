$(document).ready(function () {
    let rowCtr = -1;
    let userName;
    let purchaseListForStorage;
    let movieNames = new Array();
    let sMovies = new Array();

    var $loading = $("#loading").hide();
    $(document)
        .ajaxStart(function () {
            $loading.show();
        })
        .ajaxStop(function () {
            $loading.hide();
        });

    function init() {
        userName = JSON.parse(sessionStorage.getItem("name"));
        $("#hello")[0].text = "שלום: " + userName;
        isAdmin = JSON.parse(sessionStorage.getItem("isAdmin"));
        if (isAdmin === true)
            setAdminSideBar();
        else
            setUserSideBar();
        
        GlobalAjaxToken(GetMovieUrl() + "GetAllMoivesSecure", "GET", "", JSON.parse(sessionStorage.getItem("token")), getMovies, fail);
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
            <div class="details w3-blue-gray icon" id="${index}"> <i class="fa fa-info-circle"></i></div>
            <div class="w3-blue-gray icon"> <span ></i>כרטיסים זמינים: ${movies.numOfSeat}</span>
            <div class="w3-blue-gray">מספר כרטיסים לרכישה: <input type="number" value="0" min="0" class="greenAlert amount"/></div>
        </td>`
    }

    function validateAmount() {

        var $amount = $('input[type=number]');
        let isEnable = true;

        for (i = 0; i < $amount.length; i++) {
            //remove leading zeros
            $amount[i].value = parseInt($amount[i].value);
            if ($amount[i].value > movies[i].numOfSeat) {
                $amount[i].className = "redAlert";
                isEnable = false;
            }
            else {
                $amount[i].className = "greenAlert";
            }
            if ($amount[i].value === "") {
                $amount[i].value = 0;
            }

            var purchaseBtn = $("#purchase");
            if (isEnable) {
                purchaseBtn.prop("disabled", false);
                purchaseBtn.attr("class", "w3-green");
            }
            else {
                purchaseBtn.prop("disabled", true);
                purchaseBtn.attr("class", "w3-red");
            }
        }
    }

    function purchase() {
        let isEmptyBasket = true;
        let $amount = $('input[type=number]');
        let purchaseListForDisplay = new Array();
        purchaseListForStorage = new Array();

        for (i = 0; i < $amount.length; i++) {
            if ($amount[i].value != "0") {
                isEmptyBasket = false;
                purchaseListForDisplay.push({
                    name: movies[i].name,
                    amount: $amount[i].value,
                    price: movies[i].ticketPrice,
                    totalPrice: parseFloat($amount[i].value) * parseFloat(movies[i].ticketPrice)
                });
                purchaseListForStorage.push({
                    userName: userName,
                    number: movies[i].number,
                    numOfSeat: parseInt($amount[i].value)
                });
            }
        }
        if (isEmptyBasket) {
            alert("You have to buy at least one product");
            return;
        }

        isConfirm = confirmPurchase(purchaseListForDisplay);

    }

    function confirmPurchase(pltd) {
        let totalPrice = 0;
        for (i in pltd) {
            totalPrice += pltd[i].totalPrice;
            $("#purchaseTable").append(getPurTr(pltd[i]));
        }

        $("#purchaseTable").append(`<tr class="purchaseRecords">
            <th>
            </th>
            <th>
            </th>
            <th>
            </th>
            <th>
                <span>${totalPrice} ש"ח</span>
            </th>
        </tr>`);
        document.getElementById('ConfirmPurchaseWindow').style.display = 'block';
    }

    function confirm() {
        GlobalAjaxToken(GetPersonUrl() + "AddPurchase", "POST", purchaseListForStorage, JSON.parse(sessionStorage.getItem("token")), purchaseSuccess, fail);
    }

    function cancel() {
        document.getElementById('ConfirmPurchaseWindow').style.display = 'none';
        clearPurchase();
    }

    function getPurTr(ptd) {
        return `<tr class="purchaseRecords">
            <th>
                <span>${ptd.name}</span>
            </th>
            <th>
                <span>${ptd.amount}</span>
            </th>
            <th>
                <span>${ptd.price} ש"ח</span>
            </th>
            <th>
                <span>${ptd.totalPrice} ש"ח</span>
            </th>
        </tr>`
    }

    function purchaseSuccess(message) {
        if (message === true) {
            alert("הזמנת בוצעה, תודה רבה");
            window.location.href = "../PurchaseHistoryPage/PurchaseHistoryPage.html";
        }
        else {
            alert(message);
            clearPurchase();
            location.reload();
        }
        document.getElementById('ConfirmPurchaseWindow').style.display = 'none';
    }

    function clearPurchase() {
        var $pt = $(".purchaseRecords");
        for (let i = 0; i < $pt.length; i++) {
            $pt.remove();
        }
        document.getElementById('ConfirmPurchaseWindow').style.display = 'none';
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

    function search(sWard) {
        console.log(sWard.value);
        sMovies = [];
        for (var i = 0; i < movies.length; i++) {
            if (movieNames[i].includes(sWard.value))
                sMovies.push(movies[i]);
        }
        clearMovies();
        getSearchMovies(sMovies);
        registerToTableEvent();
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

    function registerToTableEvent() {
        $(".details").on("click", function () { showDetails(this); });
        $('input[type=number]').on("blur", validateAmount);
        $('input[type=number]').on("blur", validateAmount);
        $('.posterImg').on("mouseover", function () { spinImage(this); });
        $('.posterImg').on("mouseout", function () { stopSpinImage(this); });
        AllowOnlynNmbers();
    }

    function registerToEvent() {
        $(".details").on("click", function () { showDetails(this); });
        $('#exitShowDetails').on("click", exitShowDetails);
        $('input[type=number]').on("blur", validateAmount);
        $('input[type=number]').on("blur", validateAmount);
        $("#purchase").on("click", purchase);
        $("#confirm").on("click", confirm);
        $("#cancel").on("click", cancel);
        $('.posterImg').on("mouseover", function () { spinImage(this); });
        $('.posterImg').on("mouseout", function () { stopSpinImage(this); });
        $("#search").on("keyup", function () { search(this); });
        AllowOnlynNmbers();
    }

    function spinImage(img) {
        img.classList.add("image-rotate-horizontal");
    }

    function stopSpinImage(img) {
        img.classList.remove("image-rotate-horizontal");
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