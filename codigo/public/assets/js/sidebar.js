import { logout, isAuthenticated } from './auth.js'

document.addEventListener("DOMContentLoaded", () => {
    hamburguer()

    if (!isAuthenticated()) window.location.href = '/login'
})

function hamburguer(){
    const hamBurger = document.querySelector(".toggle-btn")

    hamBurger.addEventListener("click", () =>
        document.querySelector("#sidebar").classList.toggle("expand")
    )
}

document.getElementById('logout-btn').addEventListener('click', (e) => {
    e.preventDefault()
    logout()
})