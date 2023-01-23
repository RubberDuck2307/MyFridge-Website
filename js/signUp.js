$("#registerButton").on("click", async function () {
    let username = $("#username").val()
    let password = $("#password").val()
    let firstName = $("#firstName").val()
    let lastName = $("#lastName").val()
    let email = $("#email").val()
    username.replace(/\s/g, '')
    password.replace(/\s/g, '')
    firstName.replace(/\s/g, '')
    lastName.replace(/\s/g, '')
    email.replace(/\s/g, '')
    if (username === "" || password === "" || firstName === "" || lastName === "" || email === "") {
        $("#errorText").text("All data have to be filled in")
    } else {
       let response = await signUp(username, password, email, firstName, lastName)
        if (!response.success){
            $("#errorText").text(response.message)
        }
        else {
           await Cookies.set("token", response.token, {expires:1})
            window.open("myFridge.html", "_self")
        }
    }

})

