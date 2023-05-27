"use strict"

window.onload = function () {
    let lstRole = $("#lstRuolo")
    let lstClass = $("#lstClassi")
    let lblError = $("#lblError")

    lblError.hide()
    lstRole.on("change", function () {
        if (parseInt($(this).val()) == 1) {
            lstClass.prop({
                "disabled": true,
                "selectedIndex": -1
            })
        }
        else {
            lstClass.prop({
                "disabled": false,
                "selectedIndex": 0
            })
        }
    })
    // On key ENTER press
    $(document).on('keydown', function (event) {
        if (event.keyCode == 13) // ENTER key
            checkSignIn()
    })
    // Load available classes
    sendRequest("GET", "php/getClasses.php").catch(error).then(function (response) {
        for (let _class of response["data"])
            $("<option>").appendTo(lstClass).text(_class["nome"])
    })
    // Manage 'signIn' button
    $("#btnRegistrati").on("click", checkSignIn)

    function checkSignIn() {
        let txtName = $("#txtNome")
        let txtSurname = $("#txtCognome")
        let txtUsername = $("#txtUsername")
        let txtResidence = $("#txtResidenza")
        let txtAddress = $("#txtIndirizzo")
        let classroom = lstClass.val()
        let role = lstRole.val()
        let txtPassword = $("#txtPassword")
        let txtConfirmPassword = $("#txtConfermaPassword")

        if (txtName.val().length > 3) {
            ClearFieldError(txtName)
            if (txtSurname.val().length > 3) {
                ClearFieldError(txtSurname)
                if (txtUsername.val().length > 5) {
                    ClearFieldError(txtUsername)
                    if (txtResidence.val().length > 2) {
                        ClearFieldError(txtResidence)
                        if (txtAddress.val().length > 5) {
                            ClearFieldError(txtAddress)
                            if (txtPassword.val().length > 7) {
                                ClearFieldError(txtPassword)
                                if (txtPassword.val() == txtConfirmPassword.val()) {
                                    ClearFieldError(txtConfirmPassword)
                                    let password = CryptoJS.MD5(txtPassword.val()).toString() // Crypt the password
                                    if (role == 0) {
                                        sendRequest("POST", "php/insertUser.php", {
                                            "surname": txtSurname.val(),
                                            "name": txtName.val(),
                                            "username": txtUsername.val(),
                                            "residence": txtResidence.val(),
                                            "address": txtAddress.val(),
                                            "password": password,
                                            "classroom": classroom,
                                            "role": role
                                        }).catch(function (err) {
                                            ErrorSignIn(err)
                                        }).then(function () {
                                            window.location.href = "login.html"
                                        })
                                    } else {
                                        sendRequest("POST", "php/insertUser.php", {
                                            "surname": txtSurname.val(),
                                            "name": txtName.val(),
                                            "username": txtUsername.val(),
                                            "residence": txtResidence.val(),
                                            "address": txtAddress.val(),
                                            "password": password,
                                            "role": role
                                        }).catch(function (err) {
                                            ErrorSignIn(err)
                                        }).then(function () {
                                            window.location.href = "login.html"
                                        })
                                    }
                                } else FieldError(txtConfirmPassword, "Password non corrispondente")
                            } else FieldError(txtPassword)
                        } else FieldError(txtAddress)
                    } else FieldError(txtResidence)
                } else FieldError(txtUsername)
            } else FieldError(txtSurname)
        } else FieldError(txtName)
    }

    function ErrorSignIn(err) {
        console.log(err["response"])
        if (err["response"]) {
            if (err["response"]["status"] == 404) {
                FieldError($("#txtUsername"))
            }
            lblError.children("span").text(err["response"]["data"])
            lblError.show()
        }
        else
            error(err)
    }
}