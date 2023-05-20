"use strict"

window.onload = function () {
    let btnProfile = $(".dropdown-toggle.profile").eq(0)

    let personalInformations = $("div.informations").eq(0)

    let teachersDefaultView = $("div.teacher-options").eq(0)
    let teachersMessagesSection = $("div.teacher-messages").eq(0)
    let teachersRegisterSection = $("div.teacher-register").eq(0)
    //let teachersMarksSection = $("div.teacher-marks").eq(0)
    //let teachersAbsencesSection = $("div.teacher-absences").eq(0)
    let teachersClassListSection = $("div.teacher-list").eq(0)
    let teachersAveragesSection = $("div.teacher-averages").eq(0)
    let teachersInterviewsSection = $("div.teacher-interviews").eq(0)

    let navMessages = $(".nav-link").eq(0)
    let navRegister = $(".nav-link").eq(1)
    let navClassList = $(".nav-link").eq(2)
    let navPersonalInformations = $(".nav-link").eq(3)
    let navInterviews = $(".nav-link").eq(4)
    let navAverages = $(".nav-link").eq(5)

    sendRequest("GET", "php/user.php").catch(error).then(function (response) {
        let user_data = response["data"]
        console.log(user_data)
        //ClearErrors()
        let nominative = `${user_data["nome"].toUpperCase()} ${user_data["cognome"].toUpperCase()}`
        // 'btnProfile' management
        btnProfile.html(`<img src=assets/images/${user_data["immagine"]} class="user-profile">&nbsp;&nbsp;${nominative}`)
        NavbarManagement()
        // Show default homepage
        teachersDefaultView.show()
        // Disable teachers buttons
        buttonsEnabled(false)
        // Get all classes
        sendRequest("GET", "php/classes.php").catch(error).then(function (response) {
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
            // Personal informations
            $("#nominative").text(nominative)
            $("#residence").text(`${user_data["residenza"]} (${user_data["indrizzo"]})`)
            $("#classroom").text(classes)
            $("span#matricola").text(user_data["matricola"])
            // Manage homepage buttons
            $("#teachersMessages").on("click", function () { showCurrentSection(teachersMessagesSection) })
            $("#teachersRegister").on("click", function () { showCurrentSection(teachersRegisterSection) })
            $("#personalInformations").on("click", function () { showCurrentSection(personalInformations) })
            $("#teachersList").on("click", function () { showCurrentSection(teachersClassListSection) })
            $("#teachersInterviews").on("click", function () { showCurrentSection(teachersInterviewsSection) })
            $("#averages").on("click", function () { showCurrentSection(teachersAveragesSection) })
            // Manage navlink buttons
            navMessages.on("click", function () { showCurrentSection(teachersMessagesSection) })
            navRegister.on("click", function () { showCurrentSection(teachersRegisterSection) })
            navClassList.on("click", function () { showCurrentSection(teachersClassListSection) })
            navPersonalInformations.on("click", function () { showCurrentSection(personalInformations) })
            navInterviews.on("click", function () { showCurrentSection(teachersInterviewsSection) })
            navAverages.on("click", function () { showCurrentSection(teachersAveragesSection) })
        })
    })

    //#region INTERNAL FUNCTIONS

    function buttonsEnabled(flag) {
        $(".teacher-options button.btn").prop("disabled", !flag)
    }

    //#endregion
}