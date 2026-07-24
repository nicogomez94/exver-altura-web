const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".main-nav");
const navLinks = navigation.querySelectorAll("a");
const quoteForm = document.querySelector("#quote-form");
const year = document.querySelector("#current-year");

const closeMenu = () => {
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Abrir menú");
  navigation.classList.remove("is-open");
  header.classList.remove("menu-visible");
  document.body.classList.remove("menu-open");
};

menuButton.addEventListener("click", () => {
  const willOpen = menuButton.getAttribute("aria-expanded") !== "true";
  menuButton.setAttribute("aria-expanded", String(willOpen));
  menuButton.setAttribute(
    "aria-label",
    willOpen ? "Cerrar menú" : "Abrir menú",
  );
  navigation.classList.toggle("is-open", willOpen);
  header.classList.toggle("menu-visible", willOpen);
  document.body.classList.toggle("menu-open", willOpen);
});

navLinks.forEach((link) => link.addEventListener("click", closeMenu));

window.addEventListener(
  "scroll",
  () => {
    header.classList.toggle("is-scrolled", window.scrollY > 30);
  },
  { passive: true },
);

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  },
  {
    threshold: 0.12,
    rootMargin: "0px 0px -45px",
  },
);

document.querySelectorAll(".fade-in").forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
  revealObserver.observe(element);
});

quoteForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(quoteForm);
  const name = formData.get("name").trim();
  const clientType = formData.get("client-type");
  const message = formData.get("message").trim();
  const text = `Hola EXVER, soy ${name}. Escribo por parte de un/a ${clientType.toLowerCase()}.\n\nNecesito consultar por: ${message}\n\nQuisiera solicitar un presupuesto sin cargo.`;
  const whatsappUrl = `https://wa.me/5491164576876?text=${encodeURIComponent(text)}`;

  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
});

year.textContent = new Date().getFullYear();
