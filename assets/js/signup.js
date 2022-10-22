let logIn = document.getElementById("login")
let signUp = document.getElementById("register")
let signBtn = document.getElementById("signUp")

signBtn.addEventListener("click", function () {
    logIn.style.display = 'none'
    signUp.style.visibility = 'visible'
})