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

//#region MUTUAL FUNCTIONS

function NavbarManagement(user_data) {
	let aProfile = $(".dropdown-item.profile").eq(0)
	let aChangePassword = $(".dropdown-item.changePassword").eq(0)
	let aExit = $(".dropdown-item.exit").eq(0)
	let personalInformations = $("div.informations").eq(0)

	$("#img-profile").prop("src", `php/uploads/${user_data["immagine"]}`)

	aProfile.on("click", function () { showCurrentSection(personalInformations) })

	aChangePassword.on("click", function () {
		window.location.href = "changePassword.html"
	})

	aExit.on("click", function () {
		Swal.fire({
			title: "Sei sicuro/a di voler uscire?",
			icon: "question",
			showCancelButton: true,
			confirmButtonColor: '13085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: "Conferma",
			cancelButtonText: "Annulla"
		}).then((result) => {
			if (result["isConfirmed"]) {
				sendRequest("POST", "php/logout.php").catch(error).then(function () {
					window.location.href = "login.html"
				})
			}
		})
	})

	$("#btnEditPersonalInfos").on("click", function () {
		let formFile = $("#formFile")
		let matricola = $("input#matricola").val()
		let inputResidence = $("input#residence")
		let inputAddress = $("input#address")
		formFile.show(400)
		inputResidence.prop("readonly", false)
		inputAddress.prop("readonly", false)

		$("#btnSaveInfos").show(400).on("click", function () {
			let files = formFile.children("input").prop("files")
			let formData = new FormData()

			formData.append("user", user_data["matricola"])
			for (let file of files)
				formData.append("txtFiles[]", file)

			sendRequest("POST", "php/uploadImage.php", formData).catch(error).then(function () {
				sendRequest("POST", "php/editPersonalInformations.php", { matricola, "residence": inputResidence.val(), "address": inputAddress.val() }).catch(error).then(function (response) {
					Swal.fire({
						"title": "Informazioni salvate con successo!",
						"icon": "success",
						"showConfirmButton": false,
						"timer": 1000
					})
					inputResidence.prop("readonly", true)
					inputAddress.prop("readonly", true)
					$("#btnSaveInfos").hide(400)

					window.location.href = ""
				})
			})
		})
	})
}

function showCurrentSection(_section) {
	let specific_sections = $(".spec-section")
	// Hide all sections
	for (let i = 0; i < specific_sections.length; i++)
		specific_sections.eq(i).hide()
	// Show specified section
	_section.show()
}

function FieldError(_param, text = "Parametro troppo corto") {
	let lblError = $("#lblError")
	_param.addClass("is-invalid")
	_param.prev().children("i").addClass("red-icon")
	lblError.children("span").text(text)
	lblError.show()
}

function ClearFieldError(_param) {
	let lblError = $("#lblError")
	_param.removeClass("is-invalid")
	_param.prev().children("i").removeClass("red-icon")
	lblError.hide()
}

function loadPersonalInformations(user_data) {
	let nominative = `${user_data["nome"].toUpperCase()} ${user_data["cognome"].toUpperCase()}`
	$("#nominative").text(nominative)
	$("input#residence").val(`${user_data["residenza"]}`)
	$("input#address").val(`${user_data["indrizzo"]}`)
	$("input#matricola").val(user_data["matricola"])
	if (user_data["docente"] == 0) // Only for students
		$("input#classroom").val(user_data["classe"])
}

async function loadRegister(current_class, table, role = "0", current_subject = "") { // The default role is student
	table.empty() // Use children(tbody) because in case I want to use table.DataTable() I won't have problems

	// Default register page
	$("#week").val((new Date()).toLocaleDateString())
	generateWeekTable(getCurrentWeek(), current_class, table, role, current_subject)
}

function nextWeek(table, current_class, role, current_subject) {
	const currentDate = getCurrentWeek(7)
	generateWeekTable(currentDate, current_class, table, role, current_subject)
}

function prevWeek(table, current_class, role, current_subject) {
	const currentDate = getCurrentWeek(-7)
	generateWeekTable(currentDate, current_class, table, role, current_subject)
}


function getCurrentWeek(n = 0) {
	let currentDate = $("#week").val()
	// From LocalDateString to original format data (new Date())
	const datas = currentDate.split('/')
	const day = datas[0];
	const month = datas[1] - 1; // Sottrai 1 al mese poiché i mesi nell'oggetto Date sono basati su zero (gennaio = 0)
	const year = datas[2]
	currentDate = new Date(year, month, day)
	console.log(currentDate)
	// Set start and end of the week
	const startOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + n))
	const endOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 6))
	return { start: startOfWeek, end: endOfWeek }
}

function generateWeekTable(currentWeek, current_class, table, role = "0", current_subject = "") {
	let days = ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"]

	table.empty()
	// Set input value
	$("#week").val(currentWeek["start"].toLocaleDateString())
	// Load table
	for (let i = 0; i < 7; i++) {
		const currentDate = new Date(currentWeek.start)
		currentDate.setDate(currentDate.getDate() + i)

		let date = currentDate.toLocaleDateString().split("/")
		let finalDate = `${date[2]}-${date[1].padStart(2, '0')}-${date[0].padStart(2, '0')}`
		let tr = $('<tr>').appendTo(table).prop("id", finalDate).addClass("tr-topics")
		$('<td>').appendTo(tr).addClass("regDate").html(`${currentDate.toLocaleDateString()}<br><span>${days[i]}</span>`) // Date
		$("<td>").appendTo(tr).addClass("td-subject").html("") // Subject
		$("<td>").appendTo(tr).addClass("td-topic").html("") // Topic
		if (role == "1" && i != 0 && i != 6) {
			$("<td>").appendTo(tr).append($("<button>").addClass("btn btn-light").append($("<i>").addClass("bi bi-plus")).css({
				"border": "1px solid black",
				"margin-top": "30px"
			}).on("click", function () {
				// ADD TOPICS
				Swal.fire({
					"showCancelButton": true,
					"html": `
					<div>
						<h1>Inserisci lezione</h1>
						<div>
							<div class="form-group">
								<label for="subject">Materia</label>
								<input class="form-control" type="text" id="subject" name="subject" value=${current_subject} readonly>
							</div>
							<div class="form-group">
								<label for="date">Data</label>
								<input class="form-control" type="text" id="date" name="date" value=${currentDate.toLocaleDateString()} readonly>
							</div>
							<div class="form-group">
								<label for="description">Descrizione</label>
								<input class="form-control" id="description" name="description" required>
							</div>
						</div>
					</div>
					`
				}).then(function (value) {
					if (value["isConfirmed"]) {
						let topic = $("input#description")
						if (topic.val().length != 0) {
							sendRequest("GET", "php/getSubjectByName.php", { "subjectName": current_subject }).catch(error).then(function (subject) {
								sendRequest("POST", "php/insertLesson.php", { "topic": topic.val(), "date": finalDate, "class": current_class, "subject": subject["data"]["id"] }).catch(error).then(function () {
									Swal.fire({
										"title": "Lezione inserita correttamente!",
										"showConfirmButton": false,
										"icon": "success",
										"timer": 1000,
									})
									loadRegister(current_class, table, role, current_subject)
								})
							})
						} else FieldError(topic)
					}
				})
			}))
		}
	}
	// Get lessons
	sendRequest("GET", "php/getRegister.php", { "class": current_class, "sunday": currentWeek.start, "saturday": currentWeek.end }).catch(error).then(async function (lessons) {
		lessons = lessons["data"]
		// Load lessons on the register
		let trTopics = $(".tr-topics")
		let tdSubjects = $(".td-subject")
		let tdTopics = $(".td-topic")

		let topicIndex = 0
		let rowTable = 0
		while (lessons[topicIndex] != undefined) {
			rowTable = trTopics.filter(`[id="${lessons[topicIndex]["data"]}"]`).index()
			let row_date = trTopics.eq(rowTable).prop("id")
			while (lessons[topicIndex]["data"] == row_date) {
				let lesson_topic = lessons[topicIndex]["argomento"]
				await sendRequest("GET", "php/getSubjectById.php", { "subjectId": lessons[topicIndex]["materia"] }).catch(error).then(async function (subject) {
					subject = subject["data"]["materia"]
					let prevSubjHtml = tdSubjects.eq(rowTable).html()
					let prevTopHtml = tdTopics.eq(rowTable).html()
					let newSubjHtml = `${prevSubjHtml}<br><b>${subject}</b>`
					let newTopHtml = `${prevTopHtml}<br>${lesson_topic}`

					if (prevSubjHtml == "" && prevTopHtml == "") {
						newSubjHtml = `<span class='line-span'><b>${subject.toUpperCase()}</b></span>`
						newTopHtml = `<span class='line-span'>${lesson_topic}</span>`
					} else {
						newSubjHtml = `${prevSubjHtml}<br><br><span class='line-span'><b>${subject.toUpperCase()}</b></span>`
						newTopHtml = `${prevTopHtml}<br><br><span class='line-span'>${lesson_topic}</span>`
					}

					tdSubjects.eq(rowTable).html(newSubjHtml)
					tdTopics.eq(rowTable).html(newTopHtml)
				})
				topicIndex++
			}
		}
	})
}