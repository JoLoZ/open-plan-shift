let token = "";
async function api(path, options = {}) {
    var param = new URLSearchParams();
    for (const [key, value] of Object.entries(options)) {
        param.set(key, value);
    }
    param.set("token", token);
    let req = await fetch(`/api/${path}?${param.toString()}`);

    if (req.status != 200) {
        let error = new Error(req.status.toString() + " - " + req.statusText);
        error.code = req.status;
        error.text = req.statusText;
        throw error;
    }

    try {
        return await req.json();
    } catch {
        return await req.text();
    }
}
