let splash = new fancySplash("/assets/style/");
let strings = {};
let config = {};

async function init() {
    await splash.init("Powered by JoLoZs");
    document.querySelector("#wrapper").style.opacity = 1;

    let req = await fetch("/api/config");
    config = await req.json();
    document.title = config.title || document.title;

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

    if (localStorage.getItem("token") != undefined) {
        await splash.status(_("init.login"));
        document.querySelector("#login-form input").value =
            localStorage.getItem("token");
        await login({ preventDefault: () => {} });
    }

    if (urlParams.get("displayMode")) {
        await loadScript("/assets/js/display-mode.js");
    }

    await splash.disable();
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
