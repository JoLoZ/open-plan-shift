function loadTheme(name) {
    document.getElementById(
        "theme-css"
    ).href = `https://bootswatch.com/5/${name}/bootstrap.min.css`;
}
loadTheme(config.theme);
