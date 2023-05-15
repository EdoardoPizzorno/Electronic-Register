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

    sendRequest("GET", "php/utente.php").catch(error).then(function (response) {
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
        $("#role").text("Studente")
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
    })

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