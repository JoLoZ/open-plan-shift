document.getElementById("login-form").addEventListener("submit", login);
async function login(e) {
    e.preventDefault();
    let pass = document.querySelector("#login-form input");
    let button = document.querySelector("#login-form button");

    pass.disabled = true;
    button.disabled = true;
    button.innerText = _("login.loading");

    token = pass.value;
    let prem;
    try {
        perm = await api("permissions");
    } catch (e) {
        console.warn("Login error", e);
        token = undefined;
        if (e.code == 403) {
            document.querySelector("#login-form .text-danger").innerText =
                _("login.error.token");
            pass.disabled = false;
            button.disabled = false;
            button.innerText = _("login.submit");
            pass.focus();
        } else {
            throw e;
        }
        return;
    }
    //Login successful
    localStorage.setItem("token", token);
    if (perm.includes("superadmin") && config.language == undefined) {
        page("setup");
    } else {
        page("home");
    }

    if (perm.includes("admin")) {
        await loadScript("/assets/js/updater.js");
    }

    renderPermElements();
    plan_generate(0);
}

function renderPermElements() {
    document.querySelectorAll("[data-perm]").forEach((node) => {
        if (perm.includes(node.dataset.perm)) {
            node.style.display = "";
        } else {
            node.style.display = "none";
        }
    });
}
