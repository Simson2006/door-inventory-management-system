(function () {
    const body = document.body;
    const toggle = document.querySelector(".sidebar-toggle");
    const sidebar = document.querySelector(".sidebar");
    const backdrop = document.querySelector(".sidebar-backdrop");

    if (!toggle || !sidebar || !backdrop) {
        return;
    }

    function setSidebarOpen(isOpen) {
        body.classList.toggle("sidebar-open", isOpen);
        toggle.setAttribute("aria-expanded", String(isOpen));
        toggle.setAttribute("aria-label", isOpen ? "Close sidebar" : "Open sidebar");
    }

    toggle.addEventListener("click", function () {
        setSidebarOpen(!body.classList.contains("sidebar-open"));
    });

    backdrop.addEventListener("click", function () {
        setSidebarOpen(false);
    });

    sidebar.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
            setSidebarOpen(false);
        });
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            setSidebarOpen(false);
        }
    });
}());
