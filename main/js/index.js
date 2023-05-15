"use strict"

window.onload = function () {
    let btnProfile = $(".dropdown-toggle.profile").eq(0)
    let aProfile = $(".dropdown-item.profile").eq(0)
    let aExit = $(".dropdown-item.exit").eq(0)

    let studentsDefaultView = $("div.student-options").eq(0)
    let studentsMessagesSection = $("div.student-messages").eq(0)
    let studentsRegisterSection = $("div.student-register").eq(0)
    let studentsMarksSection = $("div.student-marks").eq(0)
    let studentsAbsencesSection = $("div.student-absences").eq(0)
    let studentsSchoolReport = $("div.school-report").eq(0)
    let studentsInterviewsSection = $("div.student-interviews-booking").eq(0)

    let personalInformations = $("div.informations").eq(0)

    let teachersDefaultView = $("div.teacher-options").eq(0)
    let teachersMessagesSection = $("div.teacher-messages").eq(0)
    let teachersRegisterSection = $("div.teacher-register").eq(0)
    //let teachersMarksSection = $("div.teacher-marks").eq(0)
    //let teachersAbsencesSection = $("div.teacher-absences").eq(0)
    let teachersClassListSection = $("div.teacher-list").eq(0)
    let teachersAveragesSection = $("div.teacher-averages").eq(0)
    let teachersInterviewsSection = $("div.teacher-interviews").eq(0)

    let firstNavLink = $(".nav-link").eq(0)
    let secondNavLink = $(".nav-link").eq(1)
    let thirdNavLink = $(".nav-link").eq(2)
    let fourthNavLink = $(".nav-link").eq(3)
    let fifthNavLink = $(".nav-link").eq(4)
    let sixthNavLink = $(".nav-link").eq(5)

    let type_current_user = studentsDefaultView

    // Manage buttons click
    $("#studentsMessages").on("click", function () { showCurrentSection(studentsMessagesSection) })
    $("#studentsRegister").on("click", function () { showCurrentSection(studentsRegisterSection) })
    $("#studentsMarks").on("click", function () { showCurrentSection(studentsMarksSection) })
    $("#studentsAbsences").on("click", function () { showCurrentSection(studentsAbsencesSection) })
    $("#personalInformations").on("click", function () { showCurrentSection(personalInformations) })
    $("#schoolReport").on("click", function () { showCurrentSection(studentsSchoolReport) })

    $("#teachersMessages").on("click", function () { showCurrentSection(teachersMessagesSection) })
    $("#teachersRegister").on("click", function () { showCurrentSection(teachersRegisterSection) })
    $("#teachersList").on("click", function () { showCurrentSection(teachersClassListSection) })
    $("#teachersInterviews").on("click", function () { showCurrentSection(teachersInterviewsSection) })
    $("#averages").on("click", function () { showCurrentSection(teachersAveragesSection) })

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

        fourthNavLink.on("click", function () { showCurrentSection(personalInformations) })

        if (user_data["docente"] == 0) {
            studentsDefaultView.show()
            $("#classroom").text(user_data["classe"])
            $("#role").text("Studente")
            // Manage navbar links
            firstNavLink.on("click", function () { showCurrentSection(studentsMessagesSection) })
            secondNavLink.on("click", function () { showCurrentSection(studentsRegisterSection) })
            thirdNavLink.on("click", function () { showCurrentSection(studentsMarksSection) })
            fifthNavLink.on("click", function () { showCurrentSection(studentsAbsencesSection) })
            sixthNavLink.text("Pagella").on("click", function () { showCurrentSection(studentsSchoolReport) })
        } else {
            teachersDefaultView.show()
            // Set the type of the current user (teacher or student)
            type_current_user = teachersDefaultView
            // Disable teachers buttons
            buttonsEnabled(false)
            // Get all classes
            sendRequest("GET", "php/classi.php").catch(error).then(function (response) {
                let classes = []
                for (let _class of response["data"]) {
                    classes.push(_class["nome"])
                    $("<a>").addClass("dropdown-item").text(_class["nome"]).appendTo($(".dropdown-menu.classes").eq(0)).on("click", function () {
                        let current_class = $(this).text()
                        // Change button text
                        $("a.dropdown-toggle.class").text(current_class)
                        // FARE LOGIN NELLA CLASSE CORRENTE
                        buttonsEnabled(true)
                    })
                }
                // Load personal infos
                $("#classroom").text(classes)
                $("#role").text("Docente")
                // Manage navbar links
                firstNavLink.on("click", function () { showCurrentSection(teachersMessagesSection) })
                secondNavLink.on("click", function () { showCurrentSection(teachersRegisterSection) })
                thirdNavLink.on("click", function () { showCurrentSection(teachersMarksSection) })
                fifthNavLink.on("click", function () { showCurrentSection(teachersAbsencesSection) })
                sixthNavLink.text("Media").on("click", function () { showCurrentSection(teachersAveragesSection) })
            })
        }
        // Navbar management
        NavbarManagement()
    })

    function buttonsEnabled(flag) {
        $(".teacher-options button.btn").prop("disabled", !flag)
    }

    function NavbarManagement() {
        aProfile.on("click", function () { showCurrentSection(personalInformations) })

        aExit.on("click", function () {
            sendRequest("POST", "php/logout.php").catch(error).then(function () {
                window.location.href = "login.html"
            })
        })

        $(".navbar-brand").eq(0).on("click", function () { showCurrentSection(type_current_user) })
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