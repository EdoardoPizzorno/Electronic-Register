"use strict"

$(document).ready(function () {
    let txtUser = $("#userCode")
    let txtPassword = $("#pwd")
    let lblError = $("#lblError")

    lblError.hide()
    lblError.children("button").on("click", function () {
        lblError.hide()
    })

    $("#btnLogin").on("click", checkLogin)
    $("#btnSignIn").on("click", function () { window.location.href = "signin.html" })
    $("#btnPasswordLost").on("click", function () { window.location.href = "forgottenPassword.html" })

    // Check if ENTER is pressed
    $(document).on('keydown', function (event) {
        if (event.keyCode == 13) // ENTER key
            checkLogin()
    })

    //#region FUNCTIONS
    function checkLogin() {
        ClearFieldErrors()
        lblError.hide()

        if (txtUser.val().trim().length < 4) {
            FieldError(txtUser)
        }
        else if (txtPassword.val().trim().length < 7) {
            FieldError(txtPassword)
        }
        else {
            ClearFieldErrors()
            let user = txtUser.val()
            let pass = CryptoJS.MD5(txtPassword.val()).toString()

            sendRequest("POST", "php/login.php", { user, pass }).catch(function (err) {
                if (err["response"] && err["response"]["status"] == 401) { // unauthorized
                    lblError.children("span").text(err["response"]["data"])
                    lblError.show()

                    if ((err["response"]["data"]).includes("Password")) {
                        FieldError(txtPassword, "Password errata")
                    } else if (err["response"]["data"].includes("Username"))
                        FieldError(txtUser, "Username errato")
                }
                else
                    error(err)
            }).then(function () {
                sendRequest("GET", "php/getUser.php").catch(error).then(function (response) {
                    if (response["data"]["docente"] == 0) // student
                        window.location.href = "studente.html"
                    else window.location.href = "docente.html" // teacher
                })
            })
        }

        function ClearFieldErrors() {
            txtUser.removeClass("is-invalid")
            txtUser.prev().children("i").removeClass("red-icon")
            txtPassword.removeClass("is-invalid")
            txtPassword.prev().children("i").removeClass("red-icon")
        }

        //#endregion
    }
})