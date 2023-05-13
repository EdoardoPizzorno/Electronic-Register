"use strict"

window.onload = function () {
    let btnProfile = $(".dropdown-toggle.profile").eq(0)
    let aProfile = $(".dropdown-item.profile").eq(0)
    let aExit = $(".dropdown-item.exit").eq(0)

    let teacherSection = $("div.teachers").eq(0)
    let studentRegisterDefault = $("div.options").eq(0)
    let studentRegisterSection = $("div.register").eq(0)
    let studentRegistry = $("div.informations").eq(0)

    sendRequest("GET", "php/studente.php").catch(error).then(function (response) {
        let user_data = response["data"]
        console.log(user_data)
        //ClearErrors()
        btnProfile.show()
        btnProfile.html(`<i class="bi bi-person-fill"></i>&nbsp;${user_data["nome"].toUpperCase()} ${user_data["cognome"].toUpperCase()}`)

        NavbarManagement()

        if (user_data["docente"] == 0) {
            studentRegisterDefault.show()
        } else {
            teacherSection.show()
        }
    })

    function NavbarManagement() {
        aProfile.on("click", function () {
            studentRegistry.show()
            studentRegisterSection.hide()
            studentRegisterDefault.hide()
        })

        aExit.on("click", function () {
            sendRequest("POST", "php/logout.php").catch(error).then(function () {
                window.location.href = "login.html"
            })
        })

        $(".navbar-brand").eq(0).on("click", function () {
            studentRegisterDefault.show()
            studentRegisterSection.hide()
            studentRegistry.hide()
        })
    }
}