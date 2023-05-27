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

    sendRequest("GET", "php/getUser.php").catch(error).then(function (response) {
        let user_data = response["data"]
        console.log(user_data)
        //ClearErrors()
        // 'btnProfile' management
        btnProfile.html(`<img src=assets/images/${user_data["immagine"]} class="user-profile">&nbsp;&nbsp;${user_data["nome"].toUpperCase()} ${user_data["cognome"].toUpperCase()}`)
        NavbarManagement()
        // Personal informations
        loadPersonalInformations(user_data)
        // Show default homepage
        teachersDefaultView.show()
        // Disable teachers buttons
        buttonsEnabled(false)
        // Load interviews (it doesn't need a specific class)
        loadInterviews(user_data)
        // Get all classes
        sendRequest("GET", "php/getClasses.php").catch(error).then(function (all_classes) {
            let classes = []
            for (let _class of all_classes["data"]) {
                classes.push(_class["nome"])
                $("<a>").addClass("dropdown-item").val(_class["nome"]).html(`${_class["nome"]} <i><b>(${_class["numStudents"]})</b></i>`).appendTo($("div.dropdown-menu.classes").eq(0)).on("click", function () {
                    let current_class = $(this).val()
                    // Change buttons text
                    $("a.dropdown-toggle.class").eq(0).text(current_class)
                    $("#currentClass").text(current_class)
                    // Get all subjects of the current class
                    let btnSubject = $("a.dropdown-toggle.subject").eq(0)
                    btnSubject.show() // Enable subjects' button
                    sendRequest("GET", "php/getAllSubjectsByClass.php", { current_class }).catch(error).then(function (subjectsIds) {
                        subjectsIds = subjectsIds["data"]
                        // Manage homepage buttons
                        ManageTeachersButtons()
                        buttonsEnabled(true) // Enable homepage buttons
                        // Manage subjects dropdown list
                        let dropdownSubjects = $("div.dropdown-menu.subjects").eq(0).empty()
                        let aux = subjectsIds["materie"].split("[")
                        let aux1 = aux[1].split("]")
                        let codes = aux1[0].split(", ")
                        // Now I have all subjects' ids --> get subjects names
                        for (let subjectId of codes) {
                            sendRequest("GET", "php/getSubjectById.php", { subjectId }).catch(error).then(function (subject) {
                                $("<a>").val(subjectId).addClass("dropdown-item").appendTo(dropdownSubjects).text(subject["data"]["materia"]).on("click", function () {
                                    btnSubject.text($(this).text())
                                    // Load register
                                    loadRegister(current_class, $("div.teacher-register table.table").eq(0), user_data["docente"], $(this).text())
                                    loadClassList(user_data, current_class, $(this).text())
                                })
                            })
                        }

                        // LOAD MAIN SECTIONS
                        loadRegister(current_class, $("div.teacher-register table.table").eq(0), user_data["docente"], $("a.dropdown-toggle.subject").eq(0).text())
                        loadReceivers(user_data, current_class) // Load all receivers available
                        loadMessages(user_data, current_class)
                        loadClassList(user_data, current_class, $("a.dropdown-toggle.subject").eq(0).text())
                        loadAverages(current_class)
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
                                "title": "Messaggio inviato correttamente!",
                                "icon": "success",
                                "showConfirmButton": false,
                                "timer": 1000
                            })
                            loadMessages(user_data, receiver)
                            txtOggetto.val("")
                            txtMessage.val("")
                        })
                    } else FieldError(txtMessage)
                } else FieldError(txtOggetto)
            })
        })
    })

    //#region MAIN FUNCTIONS

    function loadReceivers(user_data, current_class) {
        dropdownStudents.empty()
        $("<a>").appendTo(dropdownStudents).addClass("dropdown-item receiver").text($("a.dropdown-toggle.class").eq(0).text()) // The class by default
        sendRequest("GET", "php/getStudentsByClass.php", { "class": current_class }).catch(error).then(function (students) {
            students = students["data"]
            for (let student of students)
                $("<a>").appendTo(dropdownStudents).addClass("dropdown-item receiver").text(student["user"])
            // Manage all receivers available
            $("a.dropdown-item.receiver").on("click", function () {
                let receiver = $(this).text()
                btnDestinatario.text(receiver)
                loadMessages(user_data, receiver)
            })
        })
    }

    function loadMessages(user_data, current_receiver) {
        sendRequest("GET", "php/getTeacherMessages.php", { "user": user_data["user"], current_receiver }).catch(error).then(function (messages) {
            messages = messages["data"]
            $("div.teacher-messages div.card div.card-header span").eq(0).html(`Chat con ${current_receiver}`)
            let messagesWrapper = $("div.teacher-messages div.card-body").eq(0)
            messagesWrapper.empty()
            // Load all the receivers available
            btnDestinatario.text(current_receiver)
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

    function loadClassList(user_data, current_class, subjectName) {
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
                    $("<td>").appendTo(tr).text(student["cognome"].toUpperCase())
                    $("<td>").appendTo(tr).text(student["nome"].toUpperCase())
                    // Marks
                    sendRequest("GET", "php/getSubjectByName.php", { subjectName }).catch(error).then(function (subjectId) {
                        subjectId = subjectId["data"]["id"]
                        sendRequest("GET", "php/getMarksBySubjectAndMatricola.php", { "user": student["matricola"], subjectId }).catch(error).then(function (marks) {
                            let sum = 0
                            let td = $("<td>").appendTo(tr)
                            for (let mark of marks["data"]) {
                                sum += parseFloat(mark["voto"])
                                $("<button>").addClass(`btn btn-mark ${parseFloat(mark["voto"]) >= 6 ? "btn-success" : "btn-danger"}`).appendTo(td).text(mark["voto"]).on("click", function () {
                                    // CHANGE MARK
                                    Swal.fire({
                                        "title": "Modifica voto",
                                        "showCancelButton": true,
                                        "html": `
                                        <div>
                                            <div>
                                            <div style="text-align: center !important">
                                                <div class="form-group">
                                                    <label for="name">Nome:</label>
                                                    <input class="form-control" type="text" id="name" name="name" value=${student["nome"].toUpperCase()} readonly>
                                                </div>
                                                <div class="form-group">
                                                    <label for="surname">Cognome:</label>
                                                    <input class="form-control" type="text" id="surname" name="surname" value=${student["cognome"].toUpperCase()} readonly>
                                                </div>
                                                <div class="form-group">
                                                    <label for="date">Data:</label>
                                                    <input class="form-control" type="date" id="date" name="date" value=${mark["data"]} readonly>
                                                </div>
                                                <div class="form-group">
                                                    <label for="grade">Voto:</label>
                                                    <input class="form-control" type="number" id="grade" name="grade" min="0" max="10" step="0.5" value=${$(this).text()}>
                                                </div>
                                            </div>
                                        </div>`
                                    }).then(function (value) {
                                        if (value["isConfirmed"]) {
                                            let markClicked = $("#grade").val()
                                            if (parseFloat(markClicked) != parseFloat(mark["voto"])) {
                                                sendRequest("POST", "php/editMark.php", { "newMark": markClicked, "id": mark["id"] }).catch(error).then(function () {
                                                    Swal.fire({
                                                        "title": "Voto modificato correttamente!",
                                                        "icon": "success",
                                                        "showConfirmButton": false,
                                                        "timer": 1000
                                                    })
                                                    loadClassList(user_data, current_class, subjectName)
                                                })
                                            }
                                        }
                                    })
                                })
                            }
                            // Average
                            let average = (sum / marks["data"].length).toFixed(2)
                            $("<td>").appendTo(tr).append($("<button>").addClass(`btn ${average >= 6 ? "btn-success" : "btn-danger"}`).prop("disabled", true).html(isNaN(average) ? 0 : average))
                            // Add marks
                            $("<td>").appendTo(tr).append($("<button>").addClass("btn btn-light").append($("<i>").addClass("bi bi-plus")).on("click", function () {
                                // ADD MARKS
                                Swal.fire({
                                    "showCancelButton": true,
                                    "html": `
                                        <div>
                                            <div>
                                                <img src="assets/images/user.jpg" alt="Profilo studente">
                                            </div>
                                            <div style="text-align: center !important">
                                                <div class="form-group">
                                                    <label for="name">Nome:</label>
                                                    <input class="form-control" type="text" id="name" name="name" value=${student["nome"].toUpperCase()} readonly>
                                                </div>
                                                <div class="form-group">
                                                    <label for="surname">Cognome:</label>
                                                    <input class="form-control" type="text" id="surname" name="surname" value=${student["cognome"].toUpperCase()} readonly>
                                                </div>
                                                <div class="form-group">
                                                    <label for="username">Username:</label>
                                                    <input class="form-control" type="text" id="username" name="username" value=${student["user"]} readonly>
                                                </div>
                                                <div class="form-group">
                                                    <label for="grade">Voto:</label>
                                                    <input class="form-control" type="number" id="grade" name="grade" min="1" max="10" step="0.5" required>
                                                </div>
                                            </div>
                                        </div>`
                                }).then(function (value) {
                                    if (value["isConfirmed"]) { // OK button
                                        let mark = $("#grade").val()
                                        if (mark >= 1 && mark <= 10) {
                                            sendRequest("GET", "php/getSubjectByName.php", { "subjectName": $("a.dropdown-toggle.subject").eq(0).text() }).catch(error).then(function (subject) {
                                                sendRequest("POST", "php/insertMark.php", { "matricola": student["matricola"], "subject": subject["data"]["id"], mark, "teacher": user_data["matricola"] }).catch(error).then(function () {
                                                    Swal.fire({
                                                        "title": "Voto inserito correttamente!",
                                                        "icon": "success",
                                                        "showConfirmButton": false,
                                                        "timer": 1000
                                                    })
                                                    loadAverages(current_class) // Update averages after inserting a new mark
                                                    loadClassList(user_data, current_class, subjectName)
                                                })
                                            })
                                        } else {
                                            Swal.fire({
                                                "title": "Inserisci un voto valido!",
                                                "icon": "error"
                                            })
                                        }
                                    }
                                })
                            }))
                            // Absences
                            $("<td>").appendTo(tr).append($("<button>").addClass("btn btn-light").append($("<i>").addClass("bi bi-plus")).on("click", function () {
                                Swal.fire({
                                    "showCancelButton": true,
                                    "html": `
                                <div>
                                    <div>
                                        <img src="assets/images/user.jpg" alt="Profilo studente">
                                    </div>
                                    <div style="text-align: center !important">
                                        <div class="form-group">
                                            <label for="name">Nome:</label>
                                            <input class="form-control" type="text" id="name" name="name" value=${student["nome"].toUpperCase()} readonly>
                                        </div>
                                        <div class="form-group">
                                            <label for="surname">Cognome:</label>
                                            <input class="form-control" type="text" id="surname" name="surname" value=${student["cognome"].toUpperCase()} readonly>
                                        </div>
                                        <div class="form-group">
                                            <label for="username">Username:</label>
                                            <input class="form-control" type="text" id="username" name="username" value=${student["user"]} readonly>
                                        </div>
                                        <div class="form-group">
                                            <label for="username">Username:</label>
                                            <input class="form-control" type="text" id="username" name="username" value=${(new Date()).toLocaleDateString()} readonly>
                                        </div>
                                    </div>
                                </div>`
                                }).then(function (value) {
                                    if (value["isConfirmed"]) {
                                        sendRequest("POST", "php/insertAbsence.php", { "student": student["matricola"] }).catch(error).then(function () {
                                            Swal.fire({
                                                "title": "Assenza inserita con successo!",
                                                "icon": "success",
                                                "showConfirmButton": false,
                                                "timer": 1000
                                            })
                                        })
                                    }
                                })
                            }))
                        })
                    })
                }
            }
        })
    }

    function loadInterviews(user_data) {
        let table = $("div.teacher-interviews table.table tbody").eq(0)
        let teacher = `${user_data["nome"]} ${user_data["cognome"]}`
        sendRequest("GET", "php/getInterviewsByTeacher.php", { teacher }).catch(error).then(function (interviews) {
            interviews = interviews["data"]
            if (interviews.length == 0) {
                $("<span>").appendTo(table).text("Non ci sono colloqui da visualizzare").addClass("text-muted")
            } else {
                // Load table
                for (let interview of interviews) {
                    let tr = $("<tr>").appendTo(table)
                    $("<td>").appendTo(tr).text(`${interview["nome"].toUpperCase()} ${interview["cognome"].toUpperCase()}`)
                    // Get student's class
                    sendRequest("GET", "php/getClassByMatricola.php", { "matricola": interview["matricola"] }).catch(error).then(function (_class) {
                        $("<td>").appendTo(tr).text(`${_class["data"]["classe"]}`)
                    })

                    let date = interview["ora"].split(" ")
                    let hour = date[1].split(":")
                    $("<td>").appendTo(tr).text(date[0])
                    $("<td>").appendTo(tr).text(`${hour[0]}:${hour[1]}`)
                }
            }
        })
    }

    function loadAverages(current_class) {
        let table = $("div.teacher-averages table.table tbody").eq(0)
        table.empty()
        sendRequest("GET", "php/getStudentsByClass.php", { "class": current_class }).catch(error).then(function (students) {
            students = students["data"]
            if (students.length == 0) {

            } else {
                let all_sums = 0
                for (let student of students) {
                    let tr = $("<tr>").appendTo(table)
                    $("<td>").appendTo(tr).text(`${student["nome"].toUpperCase()}`)
                    $("<td>").appendTo(tr).text(`${student["cognome"].toUpperCase()}`)
                    sendRequest("GET", "php/getMarksByMatricola.php", { "user": student["matricola"] }).catch(error).then(function (marks) {
                        let sum = 0
                        for (let mark of marks["data"])
                            sum += parseFloat(mark["voto"])
                        let average = sum / marks["data"].length
                        $("<td>").appendTo(tr).html(`<b>${isNaN(average) ? 0 : average.toFixed(2)}</b>`).css("backgroundColor", average >= 6 ? "lightgreen" : "salmon")
                        all_sums = all_sums + (isNaN(average) ? 0 : average)
                    })
                }
                /*let generalAverage = (all_sums / students.length).toFixed(2)
                $("#classAverage span").empty().html(`<i><b>${generalAverage}</b></i>`).css("color", generalAverage >= 6 ? "lightgreen" : "salmon")*/
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