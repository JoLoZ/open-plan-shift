let token = "";
async function api(path, options) {
    var param = new URLSearchParams();
    for (const [key, value] of Object.entries(options)) {
        param.set(key, value);
    }
    param.set("token", token);
    let req = await fetch(`/api/${path}?${param.toString()}`);

    if (req.status != 200) {
        throw new Error(req.statusText);
    }

    try {
        return await req.json();
    } catch {
        return await req.text();
    }
}
