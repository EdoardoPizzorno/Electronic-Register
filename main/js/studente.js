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
    let subjectDetails = $("div.subject-details").eq(0)

    let navMessages = $(".nav-link").eq(0)
    let navRegister = $(".nav-link").eq(1)
    let navMarks = $(".nav-link").eq(2)
    let navPersonalInformations = $(".nav-link").eq(3)
    let navAbsences = $(".nav-link").eq(4)
    let navSchoolReport = $(".nav-link").eq(5)
    let navInterviews = $(".nav-link").eq(6)

    $(".navbar-brand").eq(0).on("click", function () { showCurrentSection(studentsDefaultView) })

    let subjectDetailsChart = ""

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
        $("#matricola").text(user_data["matricola"])
        $("#residence").text(`${user_data["residenza"]} (${user_data["indrizzo"]})`)
        $("#classroom").text(user_data["classe"])
        $("span#matricola").text(user_data["matricola"])
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
        loadRegister(user_data)
        loadMessages(user_data)
        loadMarks(user_data)
        loadAbsences(user_data)
        loadSchoolReport(user_data)
        loadInterviews(user_data)
    })

    //#region MAIN FUNCTIONS

    function loadMessages(user_data) {
        let messagesList = $(".student-messages ul.list-group").eq(0)
        sendRequest("GET", "php/messages.php", { "user": user_data["user"], "class": user_data["classe"] }).catch(error).then(function (messages) {
            messages = messages["data"]
            messages.reverse() // From oldest to the newest
            if (messages.length == 0) {
                $("<li>").appendTo(messagesList).addClass("list-group-item").text("Non ci sono messaggi da visualizzare")
            } else {
                for (let message of messages) {
                    let li = $("<li>").appendTo(messagesList).addClass("list-group-item")
                    // Bell button
                    if (parseInt(message["visualizzato"]) == 0) {
                        $("<button>").css({
                            "position": "absolute",
                            "margin-left": "46%"
                        }).prop("id", message["id"]).appendTo(li).addClass("btn btn-secondary btn-sm").html('<i class="bi bi-bell-fill"></i>').on("click", function () {
                            let messageId = $(this).prop("id")
                            $(this).hide()
                            // Change column 'visualizzato' to 1 (default at 0)
                            sendRequest("POST", "php/message_read.php", { messageId }).catch(error)
                        })
                    }

                    $("<img>").appendTo(li).prop("src", "assets/images/user.jpg").css({
                        "height": "52px",
                        "padding": "6px"
                    })
                    $("<h2>").appendTo(li).addClass("list-group-item-heading").text(message["mittente"].toUpperCase()).append($("<br>")) // Message object
                    $("<h4>").appendTo(li).addClass("list-group-item-heading").text(message["oggetto"]) // Message object
                    $("<p>").appendTo(li).text(message["testo"]) // Message text

                    let time = message["orario"].split(".")[0]
                    $("<p>").appendTo(li).addClass("text-muted").css("float", "right").text(`${time}`) // Message date
                    $("<hr>").appendTo(messagesList)
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
                if (j < topics.length - 3) {
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
            }
            //table.DataTable()
        })
    }

    function loadMarks(user_data) {
        let table = $("div.student-marks table.table").eq(0)
        sendRequest("GET", "php/marks.php", { "user": user_data["matricola"] }).catch(error).then(function (marks) {
            marks = marks["data"]
            if (marks.length == 0) {
                $("<span>").appendTo(table.children("tbody")).text("Non ci sono voti da visualizzare").addClass("text-muted")
            } else {
                marks.reverse()
                for (let mark of marks) {
                    sendRequest("GET", "php/getSubjectById.php", { "subjectId": mark["materia"] }).catch(error).then(function (subjects) {
                        let subject = subjects["data"]["materia"]
                        let tr = $("<tr>").appendTo(table.children("tbody"))
                        $("<td>").appendTo(tr).text(mark["data"])
                        $("<td>").addClass("subject").appendTo(tr).text(subject).on("click", function () {
                            loadSubjectDetails(user_data["matricola"], subject)
                        })

                        let styleColor = "style='background-color: lightgreen'"
                        if (mark["voto"] < 6)
                            styleColor = "style='background-color: salmon'"
                        $(`<td class='mark' ${styleColor}>`).appendTo(tr).text(mark["voto"])
                        // Load teacher who loaded the mark
                        sendRequest("GET", "php/getTeacherByMatricola.php", { "teacher": mark["docente"] }).catch(error).then(function (teacher) {
                            $("<td>").appendTo(tr).text(`${teacher["data"]["nome"].toUpperCase()} ${teacher["data"]["cognome"].toUpperCase()}`)
                        })
                    })
                }
            }
            //table.DataTable()
        })
    }

    function loadAbsences(user_data) {
        let table = $("div.student-absences table.table tbody").eq(0)
        table.empty()
        sendRequest("GET", "php/absences.php", { "user": user_data["matricola"] }).catch(error).then(function (response) {
            let absences = response["data"]
            $(".student-absences h2").text(`Assenze: ${absences.length}`)
            if (absences.length == 0) {
                let tr = $("<tr>").appendTo(table)
                $("<span>").appendTo(tr).text("Nessuna assenza registrata").addClass("text-muted")
            } else {
                absences.reverse()
                for (let absence of absences) {
                    let tr = $("<tr>").appendTo(table)
                    $("<td>").appendTo(tr).text(absence["data"])

                    if (parseInt(absence["giustificato"]) == 1) { // If justified 
                        $("<td>").appendTo(tr).text("Assenza giustificata")
                        $("<td>").appendTo(tr).append($("<button>").addClass("btn btn-light").html("<i class='bi bi-info-circle'></ i>").on("click", function () {
                            Swal.fire({
                                "html": `<div style="height: 100%">
                                <h2> Modifica assenza</h2>
                                <table align="center">
                                <tr>
                                <td><label for="date-input">Data:</label></td>
                                <td><input type="text" id="date-input" class="form-control" disabled></td>
                                </tr>
                                <tr>
                                <td><label for="reason-input">Motivazione:</label></td>
                                <td><input type="text" id="reason-input" class="form-control" disabled></td>
                                </tr>
                                </table>
                                <button id="edit-button" class="btn btn-primary">Modifica</button>
                              </div>
                              `,
                                "showCancelButton": true,
                            }).then(function (value) {
                                let reason = $("#reason-input").val()
                                if (value["isConfirmed"] && reason.trim() != absence["motivazione"].trim()) { // if button 'OK' is pressed AND the previous reason is different to the new
                                    sendRequest("POST", "php/editAbsence.php", { "id": absence["id"], reason }).catch(error).then(function () {
                                        Swal.fire({
                                            "text": "Assenza modificata con successo!",
                                            "icon": "success"
                                        })
                                        loadAbsences(user_data)
                                    })
                                }
                            })
                            // Set previous absence values (the next fields are in the SweetAlert)
                            let reasonInput = $("#reason-input")
                            reasonInput.val(absence["motivazione"])
                            $("#date-input").val(absence["data"])
                            $("#edit-button").on("click", function () {
                                reasonInput.prop("disabled", false)
                            })
                        }))
                    } else {
                        tr.css({
                            "color": "red",
                            "background-color": "rgba(255, 0, 0, 0.1)"
                        })
                        $("<td>").appendTo(tr).html("<b>Assenza non giustificata</b>")
                        $("<td>").appendTo(tr).append($("<button>").prop("id", absence["id"]).addClass("btn btn-danger").html("<i class='bi bi-info-circle'></ i>").on("click", function () {
                            let id = $(this).prop("id")
                            Swal.fire({
                                "width": "760px",
                                "showCancelButton": true,
                                "html": `
                                <div id="absenceJustify">
                                    <!--<div class="form-group">
                                        <label for="jSign">Nome e cognome</label>
                                        <input id="jSign" type="text" class="form-control" placeholder="Inserisci nome e cognome per giustificare">
                                    </div><br>-->
                                    <div class="form-group">
                                        <label for="justification-reason">Motivazione assenza</label>
                                        <input id="justification-reason" class="form-control" name="justification-reason" rows="4" required placeholder="Inserisci la motivazione...">
                                    </div><br>
                                    <div class="form-group" style="overflow-x: auto; margin-bottom: 20px">
                                        <label for="canvasDraw">Inserisci la firma</label>
                                        <canvas id="canvasDraw" width="700" height="300" style="border:1px solid black;"></canvas>
                                        <button id="btnClear" class="btn btn-primary" style="margin-top: 10px">Pulisci firma</button>
                                    </div>
                                    <!--<div class="form-group">
                                        <div class="custom-control custom-switch">
                                            <input type="checkbox" class="custom-control-input" id="customSwitches" name="customSwitches" disabled>
                                            <label class="custom-control-label" for="customSwitches">Giustifica</label>
                                        </div>
                                    </div>-->
                                </div>`
                            }).then(function (value) {
                                if (value["isConfirmed"]) { // 'OK' alert button
                                    // Check fields
                                    //if ($("#customSwitches").prop("checked")) {
                                    let sign = $("#canvasDraw").get(0).toDataURL()
                                    if (sign.length > 5826) { // An all white canvas has a string length of 5826
                                        let reason = $("#justification-reason").val()
                                        if (reason.trim() == "")
                                            reason = "Salute"
                                        // Justify the absence
                                        sendRequest("POST", "php/justifyAbsence.php", { id, reason, sign }).catch(error).then(function () {
                                            loadAbsences(user_data)
                                            Swal.fire({
                                                "text": "Assenza giustificata con successo!",
                                                "icon": "success"
                                            })
                                        })
                                    }
                                    //}
                                }
                            })
                            LoadCanvasDraw()
                            // Absence justifications' fields management
                            /*$("input#jSign").on("input", function () {
                                let inputSwitch = $("#customSwitches")
                                let fullname = user_data["nome"] + " " + user_data["cognome"]
                                if (this.value.toLowerCase() == fullname)
                                    inputSwitch.prop("disabled", false)
                                else {
                                    inputSwitch.prop("disabled", true)
                                    inputSwitch.prop("checked", false)
                                }
                            })*/
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
            if (marks.length == 0) {
                $("<tr>").appendTo(table).text("Non ci sono voti da visualizzare").addClass("text-muted")
            } else {
                for (let mark of marks) {
                    let request = sendRequest("GET", "php/getSubjectById.php", { "subjectId": mark["materia"] }).catch(error).then(function (subjects) {
                        let subject = subjects["data"]["materia"]
                        if (!all_subjects.hasOwnProperty(subject))
                            all_subjects[subject] = [] // If there's no array, create it

                        all_subjects[subject].push(parseInt(mark["voto"]))
                    })
                    promises.push(request)
                }
            }

            // Load table
            Promise.all(promises).then(function () {
                let all_averages = 0
                let numSubjects = 0
                for (let subject in all_subjects) {
                    let sum = 0
                    // Calculate average for the current subject
                    for (let mark of all_subjects[subject])
                        sum += mark
                    let average = Math.round(sum / all_subjects[subject].length)
                    all_averages += average
                    // Load table
                    let tr = $("<tr>").appendTo(table)
                    $("<td>").addClass("subject").appendTo(tr).text(subject).on("click", function () {
                        loadSubjectDetails(user_data["matricola"], subject)
                    })
                    $("<td>").appendTo(tr).html(`<b>${average}</b>`).css("background-color", average >= 6 ? "lightgreen" : "salmon")
                    numSubjects++ // Count how many subject there are (for the general school report average)
                }
                // General school report average
                all_averages = (all_averages / numSubjects).toFixed(2) // Now it's the total average
                let tr = $("<tr>").appendTo(table)
                $("<td>").appendTo(tr).html("<i>Media pagella generale: </i>")
                $("<td>").appendTo(tr).html(`<i><b>${all_averages}</b></i>`).css("background-color", all_averages >= 6 ? "#30da30" : "#ff3d3d")
            })
        })
    }

    function loadSubjectDetails(matricola, subjectName) {
        let table = $("div.subject-details table.table tbody").eq(0)
        table.empty().show()
        sendRequest("GET", "php/getSubjectByName.php", { subjectName }).catch(error).then(function (subjectId) {
            subjectId = subjectId["data"]["id"]
            sendRequest("GET", "php/getSubjectDetails.php", { matricola, subjectId }).catch(error).then(function (marks) {
                marks = marks["data"]
                // Set data to load the chart and Calculate subject average
                let all_marks = []
                let all_dates = []
                let sum = 0
                for (let mark of marks) {
                    let current_mark = parseFloat(mark["voto"])
                    all_marks.push(current_mark)
                    all_dates.push(mark["data"])
                    // Load table
                    let tr = $("<tr>").prependTo(table)
                    $("<td>").appendTo(tr).text(mark["data"])
                    $("<td>").appendTo(tr).html(`<b>${current_mark}</b>`).css("background-color", current_mark >= 6 ? "lightgreen" : "salmon")
                    // For the average
                    sum += current_mark
                }
                // Section title
                subjectDetails.children("h2").html(`VOTI di ${subjectName.toUpperCase()} <b>[${(sum / all_marks.length).toFixed(2)}]</b`)
                // Set chart data
                let subjectDetailsChartOptions = {
                    type: "line",
                    data: {
                        labels: all_dates,
                        datasets: [{
                            data: all_marks,
                            backgroundColor: "black",
                            borderColor: "black",
                        }]
                    },
                    options: {
                        responsive: true,
                        scales: {
                            y: {
                                suggestedMin: 4,
                                suggestedMax: 10,
                                /*ticks: {
                                    stepSize: 0.5
                                }*/
                            }
                        },
                        plugins: {
                            title: {
                                display: true,
                                text: "Andamento voti"
                            },
                            legend: {
                                display: false,
                                position: "top",
                            }
                        }
                    }
                }
                // Load chart
                if (subjectDetailsChart)
                    subjectDetailsChart.destroy()
                subjectDetailsChart = new Chart($("#subjectDetailsChart").get(0), subjectDetailsChartOptions)
                showCurrentSection(subjectDetails)
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
                    current_teacher = $(this).text()
                    $("#frmBookInterview").show()
                    $("a.dropdown-toggle.teachers").eq(0).text(current_teacher.toUpperCase())
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
        sendRequest("GET", "php/getInterviewsByMatricola.php", { "user": matricola }).catch(error).then(function (interviews) {
            interviews = interviews["data"]
            if (interviews.length == 0) {
                $("<span>").appendTo(table).addClass("text-muted").text("Non ci sono colloqui da visualizzare")
            } else {
                for (let interview of interviews) {
                    let date = interview["ora"].split(" ")
                    let hour = date[1].split(":")

                    let tr = $("<tr>").appendTo(table)
                    $("<td>").appendTo(tr).text(date[0])
                    $("<td>").appendTo(tr).text(`${hour[0]}:${hour[1]}`)
                    $("<td>").appendTo(tr).text(interview["docente"])
                }
            }
        })
    }

    //#endregion

    //#region CANVAS DRAW

    function LoadCanvasDraw() {
        const canvas = document.getElementById("canvasDraw");
        const context = canvas.getContext('2d');
        let isDrawing = false;
        let x = 0;
        let y = 0;
        var offsetX;
        var offsetY;
        startup()

        function startup() {
            canvas.addEventListener('touchstart', handleStart);
            canvas.addEventListener('touchend', handleEnd);
            canvas.addEventListener('touchcancel', handleCancel);
            canvas.addEventListener('touchmove', handleMove);
            canvas.addEventListener('mousedown', (e) => {
                x = e.offsetX;
                y = e.offsetY;
                isDrawing = true;
            });

            canvas.addEventListener('mousemove', (e) => {
                if (isDrawing) {
                    drawLine(context, x, y, e.offsetX, e.offsetY);
                    x = e.offsetX;
                    y = e.offsetY;
                }
            });

            canvas.addEventListener('mouseup', (e) => {
                if (isDrawing) {
                    drawLine(context, x, y, e.offsetX, e.offsetY);
                    x = 0;
                    y = 0;
                    isDrawing = false;
                }
            });
        }

        //document.addEventListener("DOMContentLoaded", startup);

        const ongoingTouches = [];

        function handleStart(evt) {
            evt.preventDefault();
            const touches = evt.changedTouches;
            offsetX = canvas.getBoundingClientRect().left;
            offsetY = canvas.getBoundingClientRect().top;
            for (let i = 0; i < touches.length; i++) {
                ongoingTouches.push(copyTouch(touches[i]));
            }
        }

        function handleMove(evt) {
            evt.preventDefault();
            const touches = evt.changedTouches;
            for (let i = 0; i < touches.length; i++) {
                const color = "black";
                const idx = ongoingTouchIndexById(touches[i].identifier);
                if (idx >= 0) {
                    context.beginPath();
                    context.moveTo(ongoingTouches[idx].clientX - offsetX, ongoingTouches[idx].clientY - offsetY);
                    context.lineTo(touches[i].clientX - offsetX, touches[i].clientY - offsetY);
                    context.lineWidth = 1;
                    context.strokeStyle = color;
                    context.lineJoin = "round";
                    context.closePath();
                    context.stroke();
                    ongoingTouches.splice(idx, 1, copyTouch(touches[i]));  // Swap in the new touch record
                }
            }
        }

        function handleEnd(evt) {
            evt.preventDefault();
            const touches = evt.changedTouches;
            for (let i = 0; i < touches.length; i++) {
                const color = "black";
                let idx = ongoingTouchIndexById(touches[i].identifier);
                if (idx >= 0) {
                    context.lineWidth = 1;
                    context.fillStyle = color;
                    ongoingTouches.splice(idx, 1);  // Remove it; we're done
                }
            }
        }

        function handleCancel(evt) {
            evt.preventDefault();
            const touches = evt.changedTouches;
            for (let i = 0; i < touches.length; i++) {
                let idx = ongoingTouchIndexById(touches[i].identifier);
                ongoingTouches.splice(idx, 1);  // Remove it; we're done
            }
        }

        function copyTouch({ identifier, clientX, clientY }) {
            return { identifier, clientX, clientY };
        }

        function ongoingTouchIndexById(idToFind) {
            for (let i = 0; i < ongoingTouches.length; i++) {
                const id = ongoingTouches[i].identifier;
                if (id === idToFind) {
                    return i;
                }
            }
            return -1;    // not found
        }

        function drawLine(context, x1, y1, x2, y2) {
            context.beginPath();
            context.strokeStyle = "black";
            context.lineWidth = 11;
            context.lineJoin = "round";
            context.moveTo(x1, y1);
            context.lineTo(x2, y2);
            context.closePath();
            context.stroke();
        }

        $("#btnClear").on("click", clearArea)

        function clearArea() {
            context.setTransform(1, 0, 0, 1, 0, 0);
            context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        }
    }

    //#endregion
}