function page(slug) {
    document
        .querySelectorAll(".page")
        .forEach((el) => (el.style.display = "none"));

    document.querySelector(".page#" + slug).style.display = "";
}
