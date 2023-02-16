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

    await splash.status(_("init.load.nav"));
    await loadScript("/assets/js/page.js");
    page("login");

    await splash.status(_("init.load.login"));
    await loadScript("/assets/js/login.js");

    await splash.status(_("init.load.theme"));
    await loadScript("/assets/js/theme.js");

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
