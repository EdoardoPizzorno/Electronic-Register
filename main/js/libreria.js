"use strict"

async function sendRequest(method, url, parameters = {}) {
	let contentType;
	if (method.toUpperCase() == "GET")
		contentType = "application/x-www-form-urlencoded;charset=utf-8";
	else {
		contentType = "application/json; charset=utf-8"
		parameters = JSON.stringify(parameters);
	}

	return $.ajax({
		"url": url,
		"data": parameters,
		"type": method,
		"contentType": contentType,
		"dataType": "json",   // default      
		"timeout": 5000,      // default
	});
}

function error(jqXHR, text_status, string_error) {
	if (jqXHR.status == 0)
		Swal.fire("Connection Refused or Server timeout");
	else if (jqXHR.status == 200)
		Swal.fire("Formato dei dati non corretto : " + jqXHR.responseText);
	else
		Swal.fire("Server Error: " + jqXHR.status + " - " + jqXHR.responseText);
}

function randomNumber(a, b) {
	return Math.floor((b - a + 1) * Math.random()) + a;
}