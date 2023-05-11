"use strict"

$(document).ready(function () {
    let txtUser = $("#userCode")
    let txtPassword = $("#pwd")
    let lblError = $("#lblError")
    let frmLogin = $("#frmLogin")
    let navBrand = $(".navbar-brand").eq(0)

    let btnProfile = $(".dropdown-toggle.profile").eq(0)
    let aProfile = $(".dropdown-item.profile").eq(0)
    let aExit = $(".dropdown-item.exit").eq(0)

    let teacherSection = $("div.teachers").eq(0)
    let studentRegisterDefualt = $("div.options").eq(0)
    let studentRegisterSection = $("div.register").eq(0)
    let studentRegistry = $("div.informations").eq(0)

    lblError.hide()
    lblError.children("button").on("click", function () {
        lblError.hide()
    })

    $("#btnLogin").on("click", checkLogin)
    navBrand.on("click", function() { studentRegisterDefualt.show(); studentRegisterSection.hide(); studentRegistry.hide() })

    // Check if ENTER is pressed
    $(document).on('keydown', function (event) {
        if (event.keyCode == 13) // ENTER key
            checkLogin()
    })

    //#region FUNCTIONS
    function checkLogin() {
        ClearErrors()
        lblError.hide()

        if (txtUser.val() == "") {
            UsernameError()
        }
        else if (txtPassword.val() == "") {
            PasswordError()
        }
        else {
            let user = txtUser.val()
            let pass = CryptoJS.MD5(txtPassword.val()).toString()

            sendRequest("POST", "php/login.php", { user, pass }).catch(function (err) {
                console.log(err)
                if (err["response"] && err["response"]["status"] == 401) { // unauthorized
                    lblError.children("span").text(err["response"]["data"])
                    lblError.show()

                    if ((err["response"]["data"]).includes("Password")) {
                        PasswordError()
                    } else if (err["response"]["data"].includes("Username"))
                        UsernameError()
                }
                else
                    error(err)
            }).then(async function (response) {
                let user_data = response["data"]
                //ClearErrors()
                btnProfile.show()
                btnProfile.html(`<i class="bi bi-person-fill"></i>&nbsp;${user_data["nome"].toUpperCase()} ${user_data["cognome"].toUpperCase()}`)

                aProfile.on("click", function () {
                    studentRegistry.show()
                    studentRegisterSection.hide()
                    studentRegisterDefualt.hide()
                })

                frmLogin.hide()
                console.log(response)
                if (user_data["docente"] == 0) {
                    studentRegisterDefualt.show()
                } else {
                    teacherSection.show()
                }
            })
        }
    }

    function ClearErrors() {
        txtUser.removeClass("is-invalid")
        txtUser.prev().children("i").removeClass("red-icon")
        txtPassword.removeClass("is-invalid")
        txtPassword.prev().children("i").removeClass("red-icon")
    }

    function UsernameError() {
        txtUser.addClass("is-invalid")
        txtUser.prev().children("i").addClass("red-icon")
    }

    function PasswordError() {
        txtPassword.addClass("is-invalid")
        txtPassword.prev().children("i").addClass("red-icon")
    }
    //#endregion
})