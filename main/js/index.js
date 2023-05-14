"use strict"

window.onload = function () {
    let btnProfile = $(".dropdown-toggle.profile").eq(0)
    let aProfile = $(".dropdown-item.profile").eq(0)
    let aExit = $(".dropdown-item.exit").eq(0)

    let teachersSection = $("div.teachers").eq(0)
    let studentsDefaultView = $("div.options").eq(0)
    let studentsMessagesSection = $("div.student-messages").eq(0)
    let studentsRegisterSection = $("div.student-register").eq(0)
    let studentsMarksSection = $("div.student-marks").eq(0)
    let studentsAbsencesSection = $("div.student-absences").eq(0)
    let studentsInformations = $("div.informations").eq(0)
    let studentsSchoolReport = $("div.school-report").eq(0)

    // Manage buttons click
    $("#studentsMessages").on("click", function () { showCurrentSection(studentsMessagesSection) })
    $("#studentsRegister").on("click", function () { showCurrentSection(studentsRegisterSection) })
    $("#studentsMarks").on("click", function () { showCurrentSection(studentsMarksSection) })
    $("#studentsAbsences").on("click", function () { showCurrentSection(studentsAbsencesSection) })
    $("#studentsInformations").on("click", function () { showCurrentSection(studentsInformations) })
    $("#schoolReport").on("click", function () { showCurrentSection(studentsSchoolReport) })

    $(".nav-link").eq(0).on("click", function () { showCurrentSection(studentsMessagesSection) })
    $(".nav-link").eq(1).on("click", function () { showCurrentSection(studentsRegisterSection) })
    $(".nav-link").eq(2).on("click", function () { showCurrentSection(studentsMarksSection) })
    $(".nav-link").eq(3).on("click", function () { showCurrentSection(studentsAbsencesSection) })
    $(".nav-link").eq(4).on("click", function () { showCurrentSection(studentsInformations) })
    $(".nav-link").eq(5).on("click", function () { showCurrentSection(studentsSchoolReport) })

    sendRequest("GET", "php/studente.php").catch(error).then(function (response) {
        let user_data = response["data"]
        console.log(user_data)
        //ClearErrors()
        let nominative = `${user_data["nome"].toUpperCase()} ${user_data["cognome"].toUpperCase()}`
        // 'btnProfile' management
        btnProfile.show()
        btnProfile.html(`<img src=assets/images/${user_data["immagine"]} class="user-profile">&nbsp;&nbsp;${nominative}`)
        // Personal informations
        $("#nominative").text(nominative)
        $("#residence").text(`${user_data["residenza"]} (${user_data["indrizzo"]})`)
        // Navbar management
        NavbarManagement()

        if (user_data["docente"] == 0) {
            studentsDefaultView.show()
            $("#classroom").text(user_data["classe"])
            $("#role").text("Studente")
        } else {
            teachersSection.show()
            sendRequest("GET", "php/classi.php").catch(error).then(function (response) {
                // Get all classes
                let classes = []
                for (let _class of response["data"])
                    classes.push(_class["nome"])
                // Load personal infos
                $("#classroom").text(classes)
                $("#role").text("Docente")
            })
        }
    })

    function NavbarManagement() {
        aProfile.on("click", showPersonalInformations)

        aExit.on("click", function () {
            sendRequest("POST", "php/logout.php").catch(error).then(function () {
                window.location.href = "login.html"
            })
        })

        $(".navbar-brand").eq(0).on("click", function () { showCurrentSection(studentsDefaultView) })
    }

    function showPersonalInformations() {
        studentsInformations.show()
        studentsRegisterSection.hide()
        studentsDefaultView.hide()
        studentsMessagesSection.hide()
    }

    function showCurrentSection(_section) {
        let specific_sections = $(".spec-section")
        // Hide all sections
        for (let i = 0; i < specific_sections.length; i++)
            specific_sections.eq(i).hide()
        // Show specified section
        _section.show()
    }
}