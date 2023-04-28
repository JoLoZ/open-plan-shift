document.body.classList.add("displayMode");

async function displayModeLoop() {
    let home = document.querySelector("#home");
    while (true) {
        plan_generate(0);
        await new Promise((resolve) => setTimeout(resolve, 7000));
        if (home.scrollHeight > window.innerHeight) {
            home.scrollTo({
                top: 9999,
                behavior: "smooth",
            });
            await new Promise((resolve) => setTimeout(resolve, 7000));
        }

        plan_generate(1);
        await new Promise((resolve) => setTimeout(resolve, 7000));
        if (home.scrollHeight > window.innerHeight) {
            home.scrollTo({
                top: 9999,
                behavior: "smooth",
            });
            await new Promise((resolve) => setTimeout(resolve, 7000));
        }

        plan_generate(2);
        await new Promise((resolve) => setTimeout(resolve, 7000));
        if (home.scrollHeight > window.innerHeight) {
            home.scrollTo({
                top: 9999,
                behavior: "smooth",
            });
            await new Promise((resolve) => setTimeout(resolve, 7000));
        }
    }
}
displayModeLoop();
