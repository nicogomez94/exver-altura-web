const galleries = {
  "hotel-americas": {
    title: "Hotel de las Américas",
    description: "Mantenimiento y reparación de fachada en altura",
    images: Array.from(
      { length: 15 },
      (_, index) =>
        `assets/trabajos/hotel-americas/${String(index + 1).padStart(2, "0")}.jpg?v=3`,
    ),
  },
  austria: {
    title: "Obra Austria",
    description: "Reparación y puesta en valor de superficies exteriores",
    images: Array.from(
      { length: 13 },
      (_, index) =>
        `assets/trabajos/austria/${String(index + 1).padStart(2, "0")}.jpg?v=3`,
    ),
  },
  borges: {
    title: "Obra Borges",
    description: "Reparación de balcones, mampostería y terminaciones",
    images: Array.from(
      { length: 20 },
      (_, index) =>
        `assets/trabajos/borges/${String(index + 1).padStart(2, "0")}.jpg?v=3`,
    ),
  },
  "palermo-soho": {
    title: "Palermo Soho",
    description: "Intervención exterior mediante acceso por cuerdas",
    images: Array.from(
      { length: 5 },
      (_, index) =>
        `assets/trabajos/palermo-soho/${String(index + 1).padStart(2, "0")}.jpg?v=3`,
    ),
  },
  "river-plate": {
    title: "Trabajo River Plate",
    description: "Mantenimiento de estructuras y sectores de difícil acceso",
    images: Array.from(
      { length: 44 },
      (_, index) =>
        `assets/trabajos/river-plate/${String(index + 1).padStart(2, "0")}.jpg?v=3`,
    ),
  },
};

const dialog = document.querySelector("#gallery-dialog");
const dialogTitle = document.querySelector("#gallery-title");
const galleryImage = document.querySelector("#gallery-image");
const galleryCaption = document.querySelector("#gallery-caption");
const galleryCurrent = document.querySelector("#gallery-current");
const galleryTotal = document.querySelector("#gallery-total");
const thumbnails = document.querySelector("#gallery-thumbnails");
const figure = document.querySelector(".gallery-figure");
const closeButton = document.querySelector(".gallery-close");
const previousButton = document.querySelector(".gallery-prev");
const nextButton = document.querySelector(".gallery-next");
const previewButtons = document.querySelectorAll(".project-preview");

let activeGallery = null;
let activeIndex = 0;
let touchStartX = 0;
let touchStartY = 0;
let lastTrigger = null;

const formatNumber = (number) => String(number).padStart(2, "0");

const preloadNeighbor = (offset) => {
  if (!activeGallery) return;
  const index =
    (activeIndex + offset + activeGallery.images.length) %
    activeGallery.images.length;
  const image = new Image();
  image.src = activeGallery.images[index];
};

const updateGallery = (index) => {
  if (!activeGallery) return;

  activeIndex =
    (index + activeGallery.images.length) % activeGallery.images.length;

  figure.classList.remove("is-changing");
  void figure.offsetWidth;
  figure.classList.add("is-changing");

  galleryImage.src = activeGallery.images[activeIndex];
  galleryImage.alt = `${activeGallery.title}: foto ${activeIndex + 1} de ${activeGallery.images.length}`;
  galleryCaption.textContent = activeGallery.description;
  galleryCurrent.textContent = formatNumber(activeIndex + 1);

  thumbnails
    .querySelectorAll(".gallery-thumbnail")
    .forEach((thumbnail, thumbnailIndex) => {
      const isActive = thumbnailIndex === activeIndex;
      thumbnail.classList.toggle("is-active", isActive);
      thumbnail.setAttribute("aria-current", isActive ? "true" : "false");

      if (isActive) {
        thumbnail.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
      }
    });

  preloadNeighbor(1);
  preloadNeighbor(-1);
};

const buildThumbnails = () => {
  thumbnails.replaceChildren();

  activeGallery.images.forEach((imagePath, index) => {
    const button = document.createElement("button");
    const image = document.createElement("img");

    button.type = "button";
    button.className = "gallery-thumbnail";
    button.setAttribute(
      "aria-label",
      `Ver foto ${index + 1} de ${activeGallery.images.length}`,
    );
    image.src = imagePath;
    image.alt = "";
    image.loading = "lazy";
    button.append(image);
    button.addEventListener("click", () => updateGallery(index));
    thumbnails.append(button);
  });
};

const openGallery = (projectKey, trigger) => {
  activeGallery = galleries[projectKey];
  activeIndex = 0;
  lastTrigger = trigger;

  dialogTitle.textContent = activeGallery.title;
  galleryTotal.textContent = formatNumber(activeGallery.images.length);
  dialog.showModal();
  document.body.classList.add("gallery-open");
  buildThumbnails();
  updateGallery(0);
  closeButton.focus();
};

const closeGallery = () => {
  dialog.close();
};

previewButtons.forEach((button) => {
  button.addEventListener("click", () => {
    openGallery(button.dataset.project, button);
  });
});

previousButton.addEventListener("click", () => updateGallery(activeIndex - 1));
nextButton.addEventListener("click", () => updateGallery(activeIndex + 1));
closeButton.addEventListener("click", closeGallery);

dialog.addEventListener("click", (event) => {
  if (event.target === dialog) closeGallery();
});

dialog.addEventListener("close", () => {
  document.body.classList.remove("gallery-open");
  galleryImage.src = "";
  activeGallery = null;

  if (lastTrigger) {
    lastTrigger.focus();
  }
});

document.addEventListener("keydown", (event) => {
  if (!dialog.open) return;

  if (event.key === "ArrowLeft") {
    event.preventDefault();
    updateGallery(activeIndex - 1);
  }

  if (event.key === "ArrowRight") {
    event.preventDefault();
    updateGallery(activeIndex + 1);
  }
});

galleryImage.addEventListener(
  "touchstart",
  (event) => {
    touchStartX = event.changedTouches[0].clientX;
    touchStartY = event.changedTouches[0].clientY;
  },
  { passive: true },
);

galleryImage.addEventListener(
  "touchend",
  (event) => {
    const movementX = event.changedTouches[0].clientX - touchStartX;
    const movementY = event.changedTouches[0].clientY - touchStartY;

    if (Math.abs(movementX) < 45 || Math.abs(movementX) < Math.abs(movementY)) {
      return;
    }

    updateGallery(activeIndex + (movementX < 0 ? 1 : -1));
  },
  { passive: true },
);
