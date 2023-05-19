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
    sendRequest("GET", "php/classes.php").catch(error).then(function (response) {
        for (let _class of response["data"])
            $("<option>").appendTo(lstClass).text(_class["nome"])
    })
    // Manage 'signIn' button
    $("#btnRegistrati").on("click", checkSignIn)

    function checkSignIn() {
        let name = $("#txtNome")
        let surname = $("#txtCognome")
        let username = $("#txtUsername")
        let residence = $("#txtResidenza")
        let address = $("#txtIndirizzo")
        let classroom = lstClass.val()
        let role = lstRole.val()
        let password = $("#txtPassword")
        let confirmPassword = $("#txtConfermaPassword")

        if (name.val().length > 3) {
            if (surname.val().length > 3) {
                if (username.val().length > 5) {
                    if (residence.val().length > 5) {
                        if (address.val().length > 5) {
                            if (password.val().length > 7) {
                                if (password.val() == confirmPassword.val()) {
                                    password = CryptoJS.MD5(password.val()).toString() // Crypt the password
                                    if (role == 0) {
                                        sendRequest("POST", "php/insertUser.php", {
                                            "surname": surname.val(),
                                            "name": name.val(),
                                            "username": username.val(),
                                            "residence": residence.val(),
                                            "address": address.val(),
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
                                            "surname": surname.val(),
                                            "name": name.val(),
                                            "username": username.val(),
                                            "residence": residence.val(),
                                            "address": address.val(),
                                            "password": password,
                                            "role": role
                                        }).catch(function (err) {
                                            ErrorSignIn(err)
                                        }).then(function () {
                                            window.location.href = "login.html"
                                        })
                                    }
                                } else FieldError(confirmPassword, "Password non corrispondente")
                            } else FieldError(password)
                        } else FieldError(address)
                    } else FieldError(residence)
                } else FieldError(username)
            } else FieldError(surname)
        } else FieldError(name)
    }

    function FieldError(_param, text = "Parametro troppo corto") {
        _param.addClass("is-invalid")
        _param.prev().children("i").addClass("red-icon")
        console.log(_param)
        lblError.children("span").text(text)
        lblError.show()
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