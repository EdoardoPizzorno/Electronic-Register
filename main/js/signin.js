"use strict"

window.onload = function () {
    // Load available classes
    sendRequest("GET", "php/classes.php").catch(error).then(function(classes) {
        classes = classes["data"]
        console.log(classes)
    })
    $("#btnRegistrati").on("click", function () {
        let surname = $("#txtCognome").val()
        let name = $("#txtNome").val()
        let residence = $("#txtResidenza").val()
        let address = $("#txtIndirizzo").val()
        let classroom = $("#txtClasse").val()
        let role = $("#txtRuolo").val()
        let password = $("#txtPassword").val()
        let confirmPassword = $("txtConfermaPassword").val()

        if (surname != "" && name != "" && residence != "" && address != "" ){

        }
    })
}