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
                sendRequest("GET", "php/utente.php").catch(error).then(function (response) {
                    console.log(response["data"])
                    if (response["data"]["docente"] == 0) // student
                        window.location.href = "studente.html"
                    else window.location.href = "docente.html" // teacher
                })
            })
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
    }
})