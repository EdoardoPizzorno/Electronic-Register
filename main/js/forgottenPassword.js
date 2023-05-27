"use strict"

window.onload = function () {
    $(document).on('keydown', function (event) {
        if (event.keyCode == 13) // ENTER key
            changePassword()
    })
    $("#btnInvia").on("click", changePassword)

    function changePassword() {
        let txtMail = $("#txtMail")
        let receiver = txtMail.val()
        if (!receiver.includes("@") || receiver.trim().length < 7)
            FieldError(txtMail)
        else {
            let txtUser = $("#txtUser")
            if (txtUser.val().trim().length > 3) {
                sendRequest("POST", "php/forgottenPassword/sendEmail.php", { receiver }).catch(error).then(function (newPassword) {
                    newPassword = newPassword["data"]
                    newPassword = CryptoJS.MD5(newPassword.toString()).toString()
                    sendRequest("POST", "php/changePassword.php", { newPassword, "user": txtUser.val() }).catch(error).then(function () {
                        Swal.fire({
                            "title": "Email inviata correttamente",
                            "text": `Controlla l'email "${receiver}"`,
                            "icon": "success",
                            "showConfirmButton": false,
                            "timer": 1000
                        })
                        // Turn to the login page after 2 seconds
                        setInterval(function () { window.location.href = "login.html" }, 1000)
                    })
                })
            } else FieldError(txtUser)
        }
    }
}