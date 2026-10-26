(() => {
    const header = document.querySelector(".site-header");
    const menuButton = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");
    const navAnchors = [...document.querySelectorAll('.nav-links a[href^="#"]')];
    const progressBar = document.getElementById("scroll-progress-bar");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const setMenu = (open) => {
        if (!menuButton || !navLinks) return;
        menuButton.setAttribute("aria-expanded", String(open));
        menuButton.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
        navLinks.classList.toggle("is-open", open);
        document.body.classList.toggle("menu-open", open);
    };

    if (menuButton && navLinks) {
        menuButton.addEventListener("click", () => setMenu(menuButton.getAttribute("aria-expanded") !== "true"));
        navAnchors.forEach((link) => link.addEventListener("click", () => setMenu(false)));
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
                setMenu(false);
                menuButton.focus();
            }
        });
        document.addEventListener("click", (event) => {
            if (menuButton.getAttribute("aria-expanded") === "true" && !navLinks.contains(event.target) && !menuButton.contains(event.target)) setMenu(false);
        });
        window.addEventListener("resize", () => { if (window.innerWidth > 680) setMenu(false); });
    }

    const updateScrollUI = () => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
        if (progressBar) progressBar.style.width = `${Math.min(100, progress)}%`;
        if (header) header.classList.toggle("is-scrolled", window.scrollY > 12);
    };
    window.addEventListener("scroll", updateScrollUI, { passive: true });
    updateScrollUI();

    if ("IntersectionObserver" in window && !reducedMotion) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
        document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
    } else {
        document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
    }

    if ("IntersectionObserver" in window) {
        const sections = document.querySelectorAll("main section[id]");
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                navAnchors.forEach((link) => {
                    if (link.getAttribute("href") === `#${entry.target.id}`) link.setAttribute("aria-current", "location");
                    else link.removeAttribute("aria-current");
                });
            });
        }, { rootMargin: "-30% 0px -60% 0px" });
        sections.forEach((section) => sectionObserver.observe(section));
    }

    const copyButton = document.querySelector(".copy-email");
    const copyStatus = document.querySelector(".copy-status");
    if (copyButton && copyStatus) {
        copyButton.addEventListener("click", async () => {
            const email = copyButton.dataset.email;
            try {
                await navigator.clipboard.writeText(email);
                copyStatus.textContent = "Email address copied.";
            } catch {
                copyStatus.textContent = `Email: ${email}`;
            }
        });
    }

    const contactForm = document.getElementById("contact-form");
    const formStatus = document.getElementById("form-status");
    if (contactForm && formStatus) {
        contactForm.addEventListener("submit", (event) => {
            event.preventDefault();
            if (!contactForm.reportValidity()) return;
            const name = document.getElementById("contact-name").value.trim();
            const email = document.getElementById("contact-email").value.trim();
            const message = document.getElementById("contact-message").value.trim();
            const subject = encodeURIComponent(`Portfolio message from ${name}`);
            const body = encodeURIComponent(`${message}

From: ${name}
Reply to: ${email}`);
            formStatus.textContent = "Opening your email app with a draft. The message is not sent until you send it there.";
            window.location.href = `mailto:20rajaditi@gmail.com?subject=${subject}&body=${body}`;
        });
    }

    const year = document.getElementById("current-year");
    if (year) year.textContent = new Date().getFullYear();
})();
