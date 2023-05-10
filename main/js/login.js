"use strict"

$(document).ready(function () {
    let txtUser = $("#userCode")
    let txtPassword = $("#pwd")
    let lblError = $("#lblError")

    lblError.hide()

    $("#btnLogin").on("click", checkLogin)

    // Check if ENTER is pressed
    $(document).on('keydown', function (event) {
        if (event.keyCode == 13) // ENTER key
            checkLogin()
    })

    function checkLogin() {
        txtUser.removeClass("is-invalid")
        txtUser.prev().removeClass("red-icon")
        txtPassword.removeClass("is-invalid")
        txtPassword.prev().removeClass("red-icon")

        lblError.hide()

        if (txtUser.val() == "") {
            txtUser.addClass("is-invalid")
            txtUser.prev().addClass("red-icon")
        }
        else if (txtPassword.val() == "") {
            txtPassword.addClass("is-invalid")
            txtPassword.prev().addClass("red-icon")
        }
        else {
            let user = txtUser.val()
            let pass = CryptoJS.MD5(txtPassword.val()).toString()
            console.log(user, pass)
            sendRequest("GET", "php/login.php", { user, pass }).catch(function (err) {
                console.log(err)
                if (err && err.status == 401) { // unauthorized
                    lblError.children("span").text(err.responseText)
                    lblError.show()
                }
                else
                    error(err)
            }).then(function (response) {
                console.log(response)
            })
        }
    }
    lblError.children("button").on("click", function () {
        lblError.hide()
    })
})