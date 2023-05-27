"use strict"

window.onload = function () {
    // Get current user from the session
    sendRequest("GET", "php/getSessionUser.php").catch(function (err) {
        if (err["response"] && err["response"]["status"] == 404) // No session
            window.location.href = "login.html"
        else
            error(err)
    }).then(function (user) {
        user = user["data"]
        sendRequest("GET", "php/getUser.php", { user }).catch(error).then(function (oldPassword) {
            oldPassword = oldPassword["data"]["pass"]
            $(document).on('keydown', function (event) {
                if (event.keyCode == 13) // ENTER key
                    changePassword()
            })
            $("#btnConfirm").on("click", changePassword)


            function changePassword() {
                let txtOldPassword = $("#txtOldPassword")
                let txtNewPassword = $("#txtPassword1")
                let txtConfirmPassword = $("#txtPassword2")
                
                let pass = CryptoJS.MD5(txtOldPassword.val()).toString()
                if (pass == oldPassword) {
                    ClearFieldError(txtOldPassword)
                    if (txtNewPassword.val().length > 7) {
                        ClearFieldError(txtNewPassword)
                        if (txtNewPassword.val() == txtConfirmPassword.val()) {
                            ClearFieldError(txtConfirmPassword)
                            let newPassword = CryptoJS.MD5(txtNewPassword.val()).toString()
                            sendRequest("POST", "php/changePassword.php", { user, newPassword }).catch(error).then(function () {
                                Swal.fire({
                                    "title": "Password cambiata correttamente",
                                    "icon": "success",
                                    "showConfirmButton": false,
                                    "timer": 1000
                                })
                                // Turn to the login page after 2 seconds
                                setInterval(function () { window.location.href = "login.html" }, 1000)
                            })
                        } else FieldError(txtConfirmPassword, "Le password non corrispondono")
                    } else FieldError(txtNewPassword)
                } else FieldError(txtOldPassword, "Parametro errato")
            }
        })
    })
}