$("#loginButton").on("click", async function () {
    let username = $("#username").val()
    let password = $("#password").val()
    username.replace(/\s/g, '')
    password.replace(/\s/g, '')

    if (username === "" || password === "") {
        $("#errorText").text("All data have to be filled in")
    } else {
        let response = await login(username, password)
        if (response.success) {
            await Cookies.set("token", response.token, {expires: 1})
            window.open("myFridge.html", "_self")
        } else {
            $("#errorText").text(response.message)
        }
    }
})


if(Cookies.get("token")){
    open("myFridge.html", "_self")
}