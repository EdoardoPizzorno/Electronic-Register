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
		Swal.fire({
			title: "Sei sicuro di voler uscire?",
			icon: "question",
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: "Conferma",
			cancelButtonText: "Annulla"
		}).then((result) => {
			if (result.isConfirmed) {
				sendRequest("POST", "php/logout.php").catch(error).then(function () {
					window.location.href = "login.html"
				})
			}
		})
	})
}

//#region MUTUAL FUNCTIONS

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

function loadRegister(current_class, table, role = "0", current_subject = "") { // The default role is student
	table.children("tbody").empty() // Use children(tbody) because in case I want to use table.DataTable() I won't have problems
	sendRequest("GET", "php/getRegister.php", { "class": current_class }).catch(error).then(function (response) {
		let topics = response["data"]
		let days = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica"]
		let month_days = [31, 30, 31, 30]
		let calendar_days = []
		let days_index = 0
		let week_days = []
		// Start at 01/03/23
		for (let i = 0; i < month_days.length; i++) { // months' names
			for (let j = 5; j < month_days[i]; j++) { // days number
				let date = ""
				if (i < 9 && j < 9) {
					date = `2023-0${(i + 3)}-0${j + 1}`
				} else if (i < 9 && j >= 9) {
					date = `2023-0${(i + 3)}-${j + 1}`
				} else if (i > 9 && j < 9)
					date = `2023-${(i + 3)}-0${j + 1}`
				else date = `2023-${(i + 3)}-${j + 1}`
				calendar_days.push(date)
				week_days.push(days[days_index])
				if (days_index == 6)
					days_index = 0
				else days_index++
			}
		}
		// Load table
		days_index = 0
		for (let i = 0; i < calendar_days.length; i++) {
			let tr = $("<tr>").appendTo(table.children("tbody")).prop("id", calendar_days[i]).addClass("tr-topics") // Row
			$("<td>").appendTo(tr).addClass("regDate").html(`${calendar_days[i]}<br><span>${week_days[days_index]}</span>`) // Date
			$("<td>").appendTo(tr).addClass("td-subject").html("") // Subject
			$("<td>").appendTo(tr).addClass("td-topic").html("") // Topic
			if (role == "1") // That's a teacher
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
								<div>
									<label for="subject">Materia</label>
									<input class="form-control" type="text" id="subject" name="subject" value=${current_subject} readonly>
								</div>
								<div>
									<label for="date">Data</label>
									<input class="form-control" type="date" id="date" name="date" value=${calendar_days[i]} readonly>
								</div>
								<div>
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
									sendRequest("POST", "php/insertLesson.php", { "topic": topic.val(), "date": $("input#date").val(), "class": current_class, "subject": subject["data"]["id"] }).catch(error).then(function () {
										Swal.fire({
											"text": "Lezione inserita correttamente!",
											"icon": "success"
										})
										loadRegister(current_class, table, role, current_subject)
									})
								})
							} else FieldError(topic)
						}
					})
				}))
			// Manage days' index
			if (days_index == 6)
				days_index = 0
			else days_index++
		}
		// Load lessons on the register
		let trTopics = $(".tr-topics")
		let tdSubjects = $(".td-subject")
		let tdTopics = $(".td-topic")

		console.log(topics)
		let j = 0
		for (let i = 0; i < topics.length; i++) {
			let row_date = trTopics.eq(i).prop("id")
			//console.log(i, j)
			while (topics[j]["data"] == row_date) {
				let lesson_topic = topics[j]["argomento"]
				sendRequest("GET", "php/getSubjectById.php", { "subjectId": topics[j]["materia"] }).catch(error).then(function (response) {
					let subject = response["data"]["materia"]
					let prevSubjHtml = tdSubjects.eq(i).html()
					let prevTopHtml = tdTopics.eq(i).html()
					let newSubjHtml = `${prevSubjHtml}<br><b>${subject}</b>`
					let newTopHtml = `${prevTopHtml}<br>${lesson_topic}`
					if (prevSubjHtml == "" && prevTopHtml == "") {
						newSubjHtml = `<span class='line-span'><b>${subject.toUpperCase()}</b></span>`
						newTopHtml = `<span class='line-span'>${lesson_topic}</span>`
					} else {
						newSubjHtml = `${prevSubjHtml}<br><br><span class='line-span'><b>${subject.toUpperCase()}</b></span>`
						newTopHtml = `${prevTopHtml}<br><br><span class='line-span'>${lesson_topic}</span>`
					}
					tdSubjects.eq(i).html(newSubjHtml)
					tdTopics.eq(i).html(newTopHtml)
				})
				j++
			}
		}
		/*let topicIndex = 0
		let rowTable = 0
		for (let i = 0; i < topics.length; i++) {
			let row_date = trTopics.eq(rowTable).prop("id")
			console.log(topics[topicIndex])
			console.log(row_date, topics[topicIndex]["data"], rowTable, topicIndex)
			while (topics[topicIndex]["data"] == row_date) {
				let lesson_topic = topics[topicIndex]["argomento"]
				sendRequest("GET", "php/getSubjectById.php", { "subjectId": topics[topicIndex]["materia"] }).catch(error).then(function (subject) {
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
					console.log("ciao")
				})
				topicIndex++
			}
			rowTable = trTopics.filter(`[id="${topics[topicIndex]["data"]}"]`).index()
		}*/
		//table.DataTable()
	})
}