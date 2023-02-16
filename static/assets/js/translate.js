let translationStrings = {};
async function translationInit() {
    let req = await fetch("/api/translation");
    translationStrings = await req.json();
}

function _(key) {
    return translationStrings[key];
}
