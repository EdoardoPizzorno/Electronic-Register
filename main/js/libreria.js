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

function error(err) {
	if (!err.response)
		Swal.fire("Connection Refused or Server timeout");
	else if (err.response.status == 200)
		Swal.fire("Formato dei dati non corretto : " + err.response.data);
	else if (err.response.status == 401) {
		Swal.fire(err.response.data)
		window.location.href = "index.html"
	}
	else Swal.fire("Server Error: " + err.response.status + " - " + err.response.data);
}

function randomNumber(a, b) {
	return Math.floor((b - a + 1) * Math.random()) + a;
}