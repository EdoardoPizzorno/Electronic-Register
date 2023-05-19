"use strict"

window.onload = function () {
    let btnProfile = $(".dropdown-toggle.profile").eq(0)

    let personalInformations = $("div.informations").eq(0)

    let studentsDefaultView = $("div.student-options").eq(0)
    let studentsMessagesSection = $("div.student-messages").eq(0)
    let studentsRegisterSection = $("div.student-register").eq(0)
    let studentsMarksSection = $("div.student-marks").eq(0)
    let studentsAbsencesSection = $("div.student-absences").eq(0)
    let studentsSchoolReport = $("div.school-report").eq(0)
    let studentsInterviewsSection = $("div.student-interviews-booking").eq(0)

    let navMessages = $(".nav-link").eq(0)
    let navRegister = $(".nav-link").eq(1)
    let navMarks = $(".nav-link").eq(2)
    let navPersonalInformations = $(".nav-link").eq(3)
    let navAbsences = $(".nav-link").eq(4)
    let navSchoolReport = $(".nav-link").eq(5)
    let navInterviews = $(".nav-link").eq(6)

    sendRequest("GET", "php/user.php").catch(error).then(function (response) {
        let user_data = response["data"]
        console.log(user_data)
        //ClearErrors()
        let nominative = `${user_data["nome"].toUpperCase()} ${user_data["cognome"].toUpperCase()}`
        // 'btnProfile' management
        btnProfile.html(`<img src=assets/images/${user_data["immagine"]} class="user-profile">&nbsp;&nbsp;${nominative}`)
        NavbarManagement()
        // Personal informations
        $("#nominative").text(nominative)
        $("#residence").text(`${user_data["residenza"]} (${user_data["indrizzo"]})`)
        $("#classroom").text(user_data["classe"])
        // Show default homepage
        studentsDefaultView.show()
        // Manage homepage buttons
        $("#studentsMessages").on("click", function () { showCurrentSection(studentsMessagesSection) })
        $("#studentsRegister").on("click", function () { showCurrentSection(studentsRegisterSection) })
        $("#studentsMarks").on("click", function () { showCurrentSection(studentsMarksSection) })
        $("#studentsAbsences").on("click", function () { showCurrentSection(studentsAbsencesSection) })
        $("#personalInformations").on("click", function () { showCurrentSection(personalInformations) })
        $("#schoolReport").on("click", function () { showCurrentSection(studentsSchoolReport) })
        $("#studentsInterviews").on("click", function () { showCurrentSection(studentsInterviewsSection) })
        // Manage navlink buttons
        navMessages.on("click", function () { showCurrentSection(studentsMessagesSection) })
        navRegister.on("click", function () { showCurrentSection(studentsRegisterSection) })
        navMarks.on("click", function () { showCurrentSection(studentsMarksSection) })
        navPersonalInformations.on("click", function () { showCurrentSection(personalInformations) })
        navAbsences.on("click", function () { showCurrentSection(studentsAbsencesSection) })
        navSchoolReport.on("click", function () { showCurrentSection(studentsSchoolReport) })
        navInterviews.on("click", function () { showCurrentSection(studentsInterviewsSection) })

        // LOAD MAIN SECTIONS
        loadMessages(user_data)
        loadMarks(user_data)
        loadAbsences(user_data)
        loadSchoolReport(user_data)
        loadInterviews(user_data)
        loadRegister(user_data)
    })

    //#region MAIN FUNCTIONS

    function loadMessages(user_data) {
        let messagesList = $(".student-messages ul.list-group").eq(0)
        sendRequest("GET", "php/messages.php", { "user": user_data["user"], "class": user_data["classe"] }).catch(error).then(function (messages) {
            messages = messages["data"]
            if (messages.length == 0) {
                $("<li>").appendTo(messagesList).addClass("list-group-item").text("Non ci sono messaggi da visualizzare")
            } else {
                for (let message of messages) {
                    let li = $("<li>").appendTo(messagesList).addClass("list-group-item")
                    // Bell button
                    if (parseInt(message["visualizzato"]) == 0) {
                        $("<button>").css("float", "right").prop("id", message["id"]).appendTo(li).addClass("btn btn-secondary btn-sm").html('<i class="bi bi-bell-fill"></i>').on("click", function () {
                            let messageId = $(this).prop("id")
                            $(this).hide()
                            // Change column 'visualizzato' to 1 (default at 0)
                            sendRequest("POST", "php/message_read.php", { messageId }).catch(error)
                        })
                    }

                    $("<h4>").appendTo(li).addClass("list-group-item-heading").text(message["oggetto"]) // Message object
                    $("<p>").appendTo(li).text(message["testo"]) // Message text

                    let aux = message["orario"].split(" ")
                    let date = aux[0]
                    let hour = aux[1].split(".")[0]
                    $("<p>").appendTo(li).addClass("text-muted").css("float", "right").text(`${date} ${hour}`) // Message date
                }
            }
        })
    }

    function loadRegister(user_data) {
        let table = $("div.student-register table.table").eq(0)
        sendRequest("GET", "php/register.php", { "class": user_data["classe"] }).catch(error).then(function (response) {
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
                $("<td>").appendTo(tr) // Notes
                $("<td>").appendTo(tr) // Absences
                // Manage days' index
                if (days_index == 6)
                    days_index = 0
                else days_index++
            }
            // Load lessons on the register
            let trTopics = $(".tr-topics")
            let tdSubjects = $(".td-subject")
            let tdTopics = $(".td-topic")

            let j = 0
            for (let i = 0; i < topics.length; i++) {
                let row_date = trTopics.eq(i).prop("id")
                if (topics[j]["data"] != undefined) {
                    while (topics[j]["data"] == row_date) {
                        let lesson_topic = topics[j]["argomento"]
                        sendRequest("GET", "php/subject.php", { "subjectId": topics[j]["materia"] }).catch(error).then(function (response) {
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
            }
            table.DataTable()
        })
    }

    function loadMarks(user_data) {
        let table = $("div.student-marks table.table").eq(0)
        sendRequest("GET", "php/marks.php", { "user": user_data["matricola"] }).catch(error).then(function (marks) {
            marks = marks["data"]
            marks.reverse()
            for (let mark of marks) {
                sendRequest("GET", "php/subject.php", { "subjectId": mark["materia"] }).catch(error).then(function (subjects) {
                    let tr = $("<tr>").appendTo(table.children("tbody"))
                    $("<td>").appendTo(tr).text(mark["data"])
                    $("<td>").appendTo(tr).text(subjects["data"]["materia"])

                    let styleColor = "style='background-color: lightgreen'"
                    if (mark["voto"] < 6)
                        styleColor = "style='background-color: salmon'"
                    $(`<td class='mark' ${styleColor}>`).appendTo(tr).text(mark["voto"])
                })
            }
            table.DataTable()
        })
    }

    function loadAbsences(user_data) {
        let table = $("div.student-absences table.table tbody").eq(0)
        table.empty()
        sendRequest("GET", "php/absences.php", { "user": user_data["matricola"] }).catch(error).then(function (response) {
            let absences = response["data"]
            absences.reverse()
            $(".student-absences h2").text(`Assenze: ${absences.length}`)
            if (absences.length == 0) {
                let tr = $("<tr>").appendTo(table)
                $("<span>").appendTo(tr).text("Nessuna assenza registrata").addClass("text-muted")
            } else {
                for (let absence of absences) {
                    let tr = $("<tr>").appendTo(table)
                    $("<td>").appendTo(tr).text(absence["data"])

                    if (parseInt(absence["giustificato"]) == 1) {
                        $("<td>").appendTo(tr).text("Assenza giustificata")
                        $("<td>").appendTo(tr).append($("<button>").addClass("btn btn-light").html("<i class='bi bi-info-circle'></ i>"))
                    } else {
                        tr.css({
                            "color": "red",
                            "background-color": "rgba(255, 0, 0, 0.1)"
                        })
                        $("<td>").appendTo(tr).html("<b>Assenza non giustificata</b>")
                        $("<td>").appendTo(tr).append($("<button>").prop("id", absence["id"]).addClass("btn btn-danger").html("<i class='bi bi-info-circle'></ i>").on("click", function () {
                            let id = $(this).prop("id")
                            Swal.fire({
                                "width": "380px",
                                "showCancelButton": true,
                                "html": `
                                <div id="absenceJustify">
                                    <div class="form-group">
                                        <label for="jSign">Nome e cognome</label>
                                        <input id="jSign" type="text" class="form-control" placeholder="Inserisci nome e cognome per giustificare">
                                    </div><br>
                                    <div class="form-group">
                                        <label for="justification-reason">Motivazione assenza</label>
                                        <textarea id="justification-reason" name="justification-reason" rows="4" required></textarea>
                                    </div><br>
                                    <div class="form-group">
                                        <div class="custom-control custom-switch">
                                            <input type="checkbox" class="custom-control-input" id="customSwitches" name="customSwitches" disabled>
                                            <label class="custom-control-label" for="customSwitches">Giustifica</label>
                                        </div>
                                    </div>
                                </div>`
                            }).then(function (value) {
                                if (value["isConfirmed"]) { // 'OK' alert button
                                    // Check fields
                                    if ($("#customSwitches").prop("checked")) {
                                        let justification = $("#justification-reason").val()
                                        if (justification.trim() == "")
                                            justification = "Salute"
                                        // Justify the absence
                                        sendRequest("POST", "php/updateAbsence.php", { id, justification }).catch(error).then(function () {
                                            loadAbsences(user_data)
                                            Swal.fire({
                                                "text": "Assenza giustificata con successo!",
                                                "icon": "success"
                                            })
                                        })
                                    }
                                }
                            })
                            // Absence justifications' fields management
                            $("input#jSign").on("input", function () {
                                let inputSwitch = $("#customSwitches")
                                let fullname = user_data["nome"] + " " + user_data["cognome"]
                                if (this.value.toLowerCase() == fullname)
                                    inputSwitch.prop("disabled", false)
                                else {
                                    inputSwitch.prop("disabled", true)
                                    inputSwitch.prop("checked", false)
                                }
                            })
                        }))
                    }
                }
            }
        })
    }

    function loadSchoolReport(user_data) {
        let table = $("div.school-report table.table tbody").eq(0)
        let all_subjects = {}
        let promises = []
        sendRequest("GET", "php/marks.php", { "user": user_data["matricola"] }).catch(error).then(function (marks) {
            marks = marks["data"]
            // Create JSON with all marks for each subject
            for (let mark of marks) {
                let request = sendRequest("GET", "php/subject.php", { "subjectId": mark["materia"] }).catch(error).then(function (subjects) {
                    let subject = subjects["data"]["materia"];
                    if (!all_subjects.hasOwnProperty(subject))
                        all_subjects[subject] = [] // If there's no array, create it

                    all_subjects[subject].push(parseInt(mark["voto"]))
                })
                promises.push(request);
            }

            // Load table
            Promise.all(promises).then(function () {
                for (let subject in all_subjects) {
                    let sum = 0
                    // Calculate average for the current subject
                    for (let mark of all_subjects[subject])
                        sum += mark
                    let average = Math.round(sum / all_subjects[subject].length)
                    // Load table
                    let tr = $("<tr>").appendTo(table)
                    $("<td>").appendTo(tr).text(subject)
                    $("<td>").appendTo(tr).text(average).css("background-color", average >= 6 ? "lightgreen" : "salmon")
                }
            })
        })
    }

    function loadInterviews(user_data) {
        let txtName = $("#name")
        let txtSurname = $("#surname")
        let txtMatricola = $("#matricola")
        // Set default fields
        txtName.val(user_data["nome"])
        txtSurname.val(user_data["cognome"])
        txtMatricola.val(user_data["matricola"])

        let current_teacher = ""
        sendRequest("GET", "php/peopleType_list.php", { "type": 1 }).catch(error).then(function (type_list) {
            type_list = type_list["data"]

            let dropdownMenu = $("div.dropdown-menu.teachers-list").eq(0)
            for (let person of type_list) {
                $("<a>").addClass("dropdown-item").appendTo(dropdownMenu).text(`${person["nome"]} ${person["cognome"]}`).on("click", function () {
                    current_teacher = person["cognome"]
                    $("#frmBookInterview").show()
                    $("a.dropdown-toggle.teachers").eq(0).text(current_teacher)
                })
            }
            getInterviews(user_data["matricola"])
        })
        // Manage the booking
        $(".student-interviews-booking a.book").eq(0).on("click", function () {
            let nome = txtName.val()
            let cognome = txtSurname.val()
            let matricola = txtMatricola.val()
            let data = $("#date").val()
            let time = $("#time").val()

            data = data + " " + time

            sendRequest("POST", "php/insertInterview.php", { nome, cognome, matricola, data, "docente": current_teacher }).catch(error).then(function () {
                getInterviews(user_data["matricola"])
                Swal.fire({
                    "text": "Colloquio prenotato con successo!",
                    "icon": "success"
                })
            })
        })
    }

    //#endregion

    //#region INTERNAL FUNCTIONS

    function getInterviews(matricola) {
        let table = $("div.student-interviews-booking table.table tbody").eq(0)
        table.empty()
        sendRequest("GET", "php/interviews.php", { "user": matricola }).catch(error).then(function (interviews) {
            for (let interview of interviews["data"]) {
                let date = interview["ora"].split(" ")
                let hour = date[1].split(":")

                let tr = $("<tr>").appendTo(table)
                $("<td>").appendTo(tr).text(date[0])
                $("<td>").appendTo(tr).text(`${hour[0]}:${hour[1]}`)
                $("<td>").appendTo(tr).text(interview["docente"])
            }
        })
    }

    //#endregion
}