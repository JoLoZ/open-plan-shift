function setup_step(id) {
    document.querySelectorAll("#setup .card-body").forEach((node) => {
        node.style.display = "none";
    });

    document.querySelector("#setup .card-body#" + id).style.display = "block";
}
