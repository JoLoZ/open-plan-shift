async function checkUpdate() {
    let req = await fetch(
        "https://raw.githubusercontent.com/JoLoZ/open-plan-shift/master/version"
    );
    let latest = await req.text();
    let current = await api("admin/version");

    if (parseInt(current) < parseInt(latest)) {
        let notify = document.createElement("div");
        notify.classList.add("alert", "alert-secondary", "mt-3");

        let btn = document.createElement("button");
        btn.classList.add("btn", "btn-primary", "float-end");
        btn.innerText = _("update.run");
        btn.addEventListener("click", async () => {
            btn.disabled = true;
            btn.innerText = _("update.running");
            try {
                await api("admin/update");
            } catch {}

            async function retryConnection() {
                try {
                    await api("admin/version");
                } catch {
                    setTimeout(retryConnection, 200);
                }
            }
            retryConnection();
        });
        notify.append(btn);

        let txt = document.createElement("div");
        txt.innerText = _("update.available");
        txt.classList.add("py-2");
        notify.append(txt);

        document.querySelector("#home.page .container").append(notify);
    }
}
checkUpdate();
