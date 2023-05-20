"use strict"

window.onload = function () {
    $("#btnInvia").on("click", function () {
        let txtMail = $("#txtMail")
        let receiver = txtMail.val()
        if (!receiver.includes("@") || receiver.trim().length < 7)
            FieldError(txtMail)
        else {
            let txtUser = $("#txtUser")
            if (txtUser.val().trim().length > 3) {
                sendRequest("POST", "php/forgottenPassword/sendEmail.php", { receiver }).catch(error).then(function (newPassword) {
                    let pass = newPassword["data"]
                    console.log(pass)
                    newPassword = CryptoJS.MD5(pass).toString()
                    console.log(newPassword)
                    sendRequest("POST", "php/changePassword.php", { newPassword, "user": txtUser.val() }).catch(error).then(function () {
                        Swal.fire({
                            "title": "Email inviata correttamente",
                            "text": `Controlla l'email "${receiver}"`,
                            "icon": "success"
                        })
                        // Turn to the login page after 2 seconds
                        //setInterval(function () { window.location.href = "login.html" }, 200)
                    })
                })
            } else FieldError(txtUser)
        }
    })
}