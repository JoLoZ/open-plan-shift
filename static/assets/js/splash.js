class fancySplash {
    constructor(path) {
        //Load CSS
        var link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = path + "fancySplash.css";

        this.link = link;
        document.head.append(link);

        this.path = path;
    }

    async init(defaultStatus = "Powered by JoLoZs") {
        if (this.link.sheet == undefined) {
            await new Promise((resolve) => {
                this.link.addEventListener("load", resolve);
            });
        }

        console.log("[FANCY SPLASH] Loaded CSS");

        var container = document.createElement("div");
        container.classList.add("fancySplash");

        //Create status text element
        var layer = document.createElement("div");
        layer.classList.add("layer");
        var child = document.createElement("div");
        child.innerText = defaultStatus;
        child.classList.add("status");
        layer.append(child);
        container.append(layer);

        this.text = child;

        //Create bg-cover element
        layer = document.createElement("div");
        layer.classList.add("layer");
        child = document.createElement("div");
        child.classList.add("bg-cover");
        layer.append(child);
        container.append(layer);

        //Create spinner element
        layer = document.createElement("div");
        layer.classList.add("layer");
        child = document.createElement("div");
        child.classList.add("spinner");
        layer.append(child);
        container.append(layer);

        //Create logo element
        layer = document.createElement("div");
        layer.classList.add("layer");
        child = document.createElement("img");
        child.src = this.path + "fancySplash.png";
        child.classList.add("logo");
        layer.append(child);
        container.append(layer);

        document.body.append(container);
        await new Promise((resolve) => child.addEventListener("load", resolve));
        setTimeout(() => container.classList.add("enabled"), 1);

        this.container = container;

        return this;
    }

    async status(text) {
        this.text.classList.add("updated");
        this.text.style.opacity = 0;
        await new Promise((res) => setTimeout(res, 250));
        this.text.innerText = text;
        this.text.style.opacity = 1;
        await new Promise((res) => setTimeout(res, 250));
    }

    async disable() {
        this.container.classList.add("out");
    }
}
