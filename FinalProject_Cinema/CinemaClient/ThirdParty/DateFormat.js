function getDateFormat(datetime) {
    let year = datetime.substring(0, datetime.indexOf("-"));
    datetime = datetime.substring(datetime.indexOf("-") + 1, datetime.indexOf("T"));
    let month = datetime.substring(0, datetime.indexOf("-"));
    let day = datetime.substring(datetime.indexOf("-") + 1);
    return "תאריך: " + day + "/" + month + "/" + year;
}

function getHourFormat(datetime) {
    return "שעה: " + datetime.substring(datetime.indexOf("T") + 1, datetime.indexOf("T") + 1 + 8);
}