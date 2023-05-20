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
	if (!err.response)
		Swal.fire("Connection Refused or Server timeout")
	else if (err.response.status == 200)
		Swal.fire("Formato dei dati non corretto : " + err.response.data)
	else if (err.response.status == 403)
		window.location.href = "login.html"
	else Swal.fire("Server Error: " + err.response.status + " - " + err.response.data)
}

function randomNumber(a, b) {
	return Math.floor((b - a + 1) * Math.random()) + a;
}

function NavbarManagement() {
	let aProfile = $(".dropdown-item.profile").eq(0)
	let aExit = $(".dropdown-item.exit").eq(0)
	let personalInformations = $("div.informations").eq(0)

	aProfile.on("click", function () { showCurrentSection(personalInformations) })

	aExit.on("click", function () {
		sendRequest("POST", "php/logout.php").catch(error).then(function () {
			window.location.href = "login.html"
		})
	})

	$(".navbar-brand").eq(0).on("click", function () { showCurrentSection($("div.student-options").eq(0)) })
}

function showCurrentSection(_section) {
	let specific_sections = $(".spec-section")
	// Hide all sections
	for (let i = 0; i < specific_sections.length; i++)
		specific_sections.eq(i).hide()
	// Show specified section
	_section.show()
}