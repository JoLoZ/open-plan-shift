document.getElementById("login-form").addEventListener("submit", login);
function login(e) {
    e.preventDefault();
    let pass = document.querySelector("#login-form input");
    let button = document.querySelector("#login-form button");

    pass.disabled = true;
    button.disabled = true;
    button.innerText = _("login.loading");
}
