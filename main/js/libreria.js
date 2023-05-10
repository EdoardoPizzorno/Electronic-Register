"use strict"

const _URL = ""

async function sendRequest(method, url, parameters = {}) {
	let config = {
		"baseURL": _URL,
		"url": url,
		"method": method.toUpperCase(),
		"headers": {
			"Accept": "application/json",
		},
		"timeout": 5000,
		"responseType": "json",
	}
	if (parameters instanceof FormData) {
		config.headers["Content-Type"] = 'multipart/form-data;'
		config["data"] = parameters     // Accept FormData, File, Blob
	}
	else if (method.toUpperCase() == "GET") {
		config.headers["Content-Type"] = 'application/x-www-form-urlencoded;charset=utf-8'
		config["params"] = parameters
	}
	else {
		//config.headers["Content-Type"] = 'application/json; charset=utf-8' 
		config.headers["Content-Type"] = 'application/x-www-form-urlencoded;charset=utf-8'
		config["data"] = parameters
	}
	return axios(config)
}

function error(err) {
	if (!err["response"])
		Swal.fire("Connection Refused or Server timeout");
	else Swal.fire("Server Error: " + err["response"]["status"] + " - " + err["response"]["data"]);
}

function randomNumber(a, b) {
	return Math.floor((b - a + 1) * Math.random()) + a;
}