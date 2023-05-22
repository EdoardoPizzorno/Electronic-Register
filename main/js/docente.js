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

    let dropdownStudents = $("div.dropdown-menu.class-students").eq(0)
    let btnDestinatario = $("#destinatario")

    $(".navbar-brand").eq(0).on("click", function () { showCurrentSection(teachersDefaultView) })

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
        sendRequest("GET", "php/classes.php").catch(error).then(function (all_classes) {
            let classes = []
            for (let _class of all_classes["data"]) {
                classes.push(_class["nome"])
                $("<a>").addClass("dropdown-item").text(_class["nome"]).appendTo($("div.dropdown-menu.classes").eq(0)).on("click", function () {
                    let current_class = $(this).text()
                    // Change button text
                    $("a.dropdown-toggle.class").eq(0).text(current_class)
                    // Get all subjects of the current class
                    let btnSubject = $("a.dropdown-toggle.subject").eq(0)
                    btnSubject.show() // Enable subjects' button
                    sendRequest("GET", "php/getAllSubjectsByClass.php", { current_class }).catch(error).then(function (subjectsIds) {
                        subjectsIds = subjectsIds["data"]
                        // Manage homepage buttons
                        ManageTeachersButtons()
                        // Manage subjects dropdown list
                        let dropdownSubjects = $("div.dropdown-menu.subjects").eq(0)
                        let aux = subjectsIds["materie"].split("[")
                        let aux1 = aux[1].split("]")
                        let codes = aux1[0].split(", ")
                        // Now I have all subjects' ids --> get subjects names
                        dropdownSubjects.empty()
                        for (let subjectId of codes) {
                            sendRequest("GET", "php/getSubjectById.php", { subjectId }).catch(error).then(function (subject) {
                                $("<a>").addClass("dropdown-item").appendTo(dropdownSubjects).text(subject["data"]["materia"]).on("click", function () {
                                    buttonsEnabled(true) // Enable homepage buttons
                                    btnSubject.text($(this).text())
                                })
                            })
                        }

                        // LOAD MAIN SECTIONS
                        loadMessages(user_data, current_class)
                        loadClassList(current_class)
                    })
                })
            }
            // Send message
            $("#btnInvia").on("click", function () {
                let txtOggetto = $("#oggetto")
                let txtMessage = $("#messaggio")
                if (txtOggetto.val().length > 3) {
                    if (txtMessage.val().length != 0) {
                        let receiver = btnDestinatario.text()
                        sendRequest("POST", "php/sendMessage.php", { receiver, "sender": user_data["user"], "oggetto": txtOggetto.val(), "text": txtMessage.val() }).catch(error).then(function () {
                            Swal.fire({
                                "text": "Messaggio inviato correttamente!",
                                "icon": "success"
                            })
                            loadMessages(user_data, receiver)
                            txtOggetto.val("")
                            txtMessage.val("")
                        })
                    } else FieldError(txtMessage)
                } else FieldError(txtOggetto)
            })
            // Personal informations
            $("#nominative").text(nominative)
            $("#residence").text(`${user_data["residenza"]} (${user_data["indrizzo"]})`)
            $("#classroom").text(classes)
            $("span#matricola").text(user_data["matricola"])
        })
    })

    //#region MAIN FUNCTIONS

    function loadMessages(user_data, current_receiver) {
        sendRequest("GET", "php/getTeacherMessages.php", { "user": user_data["user"], current_receiver }).catch(error).then(function (messages) {
            messages = messages["data"]
            $("div.teacher-messages div.card div.card-header span").eq(0).html(`Chat con ${current_receiver}`)
            let messagesWrapper = $("div.teacher-messages div.card-body").eq(0)
            messagesWrapper.empty()
            // Load all the receivers available
            dropdownStudents.empty()
            btnDestinatario.text(current_receiver)
            $("<a>").appendTo(dropdownStudents).addClass("dropdown-item receiver").text($("a.dropdown-toggle.class").eq(0).text()) // The class by default
            sendRequest("GET", "php/getStudentsByClass.php", { "class": current_receiver }).catch(error).then(function (students) {
                students = students["data"]
                for (let student of students) {
                    $("<a>").appendTo(dropdownStudents).addClass("dropdown-item receiver").text(student["user"])
                }
                // Manage all receivers available
                $("a.dropdown-item.receiver").on("click", function () {
                    let receiver = $(this).text()
                    btnDestinatario.text(receiver)
                    loadMessages(user_data, receiver)
                })
            })
            // View messages
            if (messages.length == 0) {
                $("<p>").text("Non ci sono messaggi da visualizzare").appendTo(messagesWrapper).addClass("text-muted")
            } else {
                for (let message of messages) {
                    let messageDiv = $("<div>").appendTo(messagesWrapper).addClass("d-flex justify-content-start mb-4 message")
                    let imageDiv = $("<div>").appendTo(messageDiv).addClass("img_cont_msg")
                    $("<img>").appendTo(imageDiv).prop("src", "assets/images/user.jpg").css({
                        "height": "26px",
                        "padding": "3px"
                    })
                    let messageContainer = $("<div>").addClass("msg_container").appendTo(messageDiv)
                    $("<span>").appendTo(messageContainer).html(`<b>[${message["oggetto"].toUpperCase()}]</b> ${message["testo"]}`).addClass("msg")

                    let dateSplit = message["orario"].split(" ")
                    let prevTime = dateSplit[1].split(".")
                    let time = prevTime[0].split(":")
                    $("<span>").appendTo(messageContainer).text(`${dateSplit[0]} ${time[0]}:${time[1]}`).addClass("msg_time")

                    $("<hr>").appendTo(messagesWrapper).addClass("divider")
                }
            }
        })
    }

    function loadClassList(current_class) {
        let table = $("div.teacher-list table.table tbody").eq(0)
        table.empty()
        sendRequest("GET", "php/getStudentsByClass.php", { "class": current_class }).catch(error).then(function (students) {
            students = students["data"]
            // Load table
            if (students.length == 0) {
                $("<tr>").appendTo(table).html(`<br>Non ci sono studenti nella classe ${current_class}`).addClass("text-muted")
            } else {
                for (let student of students) {
                    let tr = $("<tr>").appendTo(table)
                    $("<td>").appendTo(tr).text(student["nome"].toUpperCase())
                    $("<td>").appendTo(tr).text(student["cognome"].toUpperCase())
                    $("<td>").appendTo(tr).append($("<button>").addClass("btn btn-light").append($("<i>").addClass("bi bi-plus")).on("click", function () {
                        // ADD MARKS
                        console.log(student)
                    }))
                    $("<td>").appendTo(tr).append($("<button>").addClass("btn btn-light").append($("<i>").addClass("bi bi-plus")).on("click", function () {
                        // ADD ABSENCE
                        console.log(student)
                    }))
                }
            }
        })
    }

    //#endregion

    //#region INTERNAL FUNCTIONS

    function ManageTeachersButtons() {
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
    }

    function buttonsEnabled(flag) {
        $(".teacher-options button.btn").prop("disabled", !flag)
    }

    //#endregion
}