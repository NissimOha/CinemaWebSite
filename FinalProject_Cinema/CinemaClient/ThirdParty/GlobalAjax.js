function GlobalAjax(url, type, details, success_callback, error_callback) {
    $.ajax({
        dataType: "json",
        url: url,
        contentType: "application/json; charset=utf-8",
        type: type,
        data: JSON.stringify(details),
        success: success_callback,
        error: error_callback
    });
}

function GlobalAjaxForFiles(url, type, form, key, success_callback, error_callback) {
    $.ajax({
        headers: { "Authorization": 'Bearer ' + key },
        processData: false,
        url: url,
        contentType: false,
        type: type,
        data: form,
        success: success_callback,
        error: error_callback
    });
}

function GlobalAjaxToken(url, type, details, key, success_callback, error_callback) {
    $.ajax({
        headers: { "Authorization": 'Bearer ' + key},
        dataType: "json",
        url: url,
        contentType: "application/json; charset=utf-8",
        type: type,
        data: JSON.stringify(details),
        success: success_callback,
        error: error_callback
    });
}