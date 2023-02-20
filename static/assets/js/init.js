let splash = new fancySplash("/assets/style/");
let strings = {};
let config = {};

async function init() {
    await splash.init("Powered by JoLoZs");

    let req = await fetch("/api/config");
    config = await req.json();

    await splash.status("Loading translations...");
    await loadScript("/assets/js/translate.js");
    await translationInit();
    translatePage();

    await splash.status(_("init.load.util"));
    await loadScript("/assets/js/util.js");
    await loadScript("/assets/js/misc.js");

    await splash.status(_("init.load.nav"));
    await loadScript("/assets/js/page.js");
    page("login");

    await splash.status(_("init.load.login"));
    await loadScript("/assets/js/login.js");

    await splash.status(_("init.load.theme"));
    await loadScript("/assets/js/theme.js");

    if (urlParams.get("token")) {
        localStorage.setItem("token", urlParams.get("token"));
    }

    if (urlParams.get("displayMode")) {
        await loadScript("/assets/js/display-mode.js");
    }

    if (localStorage.getItem("token") != undefined) {
        await splash.status(_("init.login"));
        document.querySelector("#login-form input").value =
            localStorage.getItem("token");
        await login({ preventDefault: () => {} });
    }

    await splash.disable();

    if (perm.includes("admin")) {
        await loadScript("/assets/js/updater.js");
    }
}

init();

function loadScript(src) {
    return new Promise((resolve) => {
        let el = document.createElement("script");
        el.addEventListener("load", resolve);
        el.src = src;
        document.body.append(el);
    });
}
