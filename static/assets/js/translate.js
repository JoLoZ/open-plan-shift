let translationStrings = {};
async function translationInit() {
    let req = await fetch("/api/translation");
    translationStrings = await req.json();
}

function _(key) {
    return translationStrings[key];
}

function translatePage() {
    var els = document.querySelectorAll("[data-txt]");
    for (const el of els) {
        el.innerText = _(el.dataset.txt);
    }
}
