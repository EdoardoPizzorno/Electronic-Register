"use strict"

window.onload = function () {
    let btnProfile = $(".dropdown-toggle.profile").eq(0)
    let aProfile = $(".dropdown-item.profile").eq(0)
    let aExit = $(".dropdown-item.exit").eq(0)

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
        //loadMessages(user_data)
        //loadRegister(user_data)
        loadMarks(user_data)
        //loadAbsences(user_data)
        //loadSchoolReport(user_data)
        //loadInterviews(user_data)
    })

    //#region MAIN FUNCTIONS

    function loadRegister(user_data) {
        let table = $("div.student-register table.table tbody").eq(0)
        sendRequest("GET", "php/register.php", { "class": user_data["classe"] }).catch(error).then(function (response) {
            let topics = response["data"]
            let days = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica"]
            let month_days = [31, 30, 31, 30]
            let calendar_days = []
            let days_index = 0
            let week_days = []
            // Start at 01/03/23
            for (let i = 0; i < month_days.length; i++) { // months' names
                for (let j = 0; j < month_days[i]; j++) { // days number
                    calendar_days.push(`2023-${(i + 3)}-${j + 1}`)
                    week_days.push(days[days_index])
                    if (days_index == 6)
                        days_index = 0
                    else days_index++
                }
            }
            days_index = 0
            // Load table
            for (let i = 0; i < calendar_days.length; i++) {
                sendRequest("GET", "php/subjects.php", { "subjectId": topics[i]["materia"] }).catch(error).then(function (response) {
                    let subject = response["data"]["materia"] // Get subject
                    // Load table
                    let tr = $("<tr>").prop("id", calendar_days[i].split(" ")[1]).appendTo(table) // Row
                    $("<td class='regDate'>").appendTo(tr).html(`<span>${week_days[days_index]}</span><br>${calendar_days[i]}`) // Date
                    $("<td>").appendTo(tr).html(`<b>${subject}</b>`) // Subject
                    $("<td>").appendTo(tr).text(topics[i]["argomento"]) // Topic
                    $("<td>").appendTo(tr) // Notes
                    $("<td>").appendTo(tr) // Absences
                    if (days_index == 6)
                        days_index = 0
                    else days_index++
                })
            }
        })
    }

    function loadMarks(user_data) {
        let table = $("div.student-marks table.table tbody").eq(0)
        sendRequest("GET", "php/marks.php", { "user": user_data["matricola"] }).catch(error).then(function (response) {
            let marks = response["data"]
            marks.reverse()
            for (let mark of marks) {
                sendRequest("GET", "php/subjects.php", { "subjectId": mark["materia"] }).catch(error).then(function (subjects) {
                    let tr = $("<tr>").appendTo(table)
                    $("<td>").appendTo(tr).text(subjects["data"]["materia"])

                    let styleColor = "style='background-color: lightgreen'"
                    if (mark["voto"] < 6)
                        styleColor = "style='background-color: red'"
                    $(`<td class='mark' ${styleColor}>`).appendTo(tr).text(mark["voto"])
                    $("<td>").appendTo(tr).text(mark["data"])
                })
            }
        })
    }

    //#endregion

    //#region INTERNAL FUNCTIONS
    function NavbarManagement() {
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
    //#endregion
}