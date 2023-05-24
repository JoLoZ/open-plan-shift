document.body.classList.add("displayMode");
let display_params = new URLSearchParams(location.search);

async function displayModeLoop() {
    let home = document.querySelector("#home");
    let days = parseInt(display_params.get("days") || "2");
    let bar = document.querySelector(".dm-bar .progress-bar");

    while (true) {
        await plan_generate(-1, false, true);
        let percPerDay = 100 / days;

        let perc = 0;
        bar.style.transition = "0ms";
        bar.style.width = perc + "%";
        bar.innerText;
        bar.style.transition = "";

        for (let index = 0; index < days; index++) {
            let data = await plan_move(1);

            let percPerMove =
                percPerDay / Math.ceil(home.scrollHeight / window.innerHeight);

            for (let y = 0; y < home.scrollHeight; y += window.innerHeight) {
                home.scrollTo({
                    top: y,
                    behavior: "smooth",
                });
                perc += percPerMove;
                bar.style.width = perc + "%";

                await new Promise((resolve) => setTimeout(resolve, 5000));
            }
        }
    }
}

displayModeLoop();
