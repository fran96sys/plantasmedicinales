const STORAGE_KEY = "medicinalPlants";

const defaultPlants = [
  {
    name: "Manzanilla",
    use: "Ayuda a aliviar molestias digestivas y promueve la relajación.",
    description: "Planta aromática de flores pequeñas, muy utilizada en infusiones por sus propiedades calmantes."
  },
  {
    name: "Menta",
    use: "Se emplea para mejorar la digestión y refrescar las vías respiratorias.",
    description: "Hierba refrescante con hojas verdes intensas, apreciada por su aroma y efecto reconfortante."
  },
  {
    name: "Sábila",
    use: "Contribuye al cuidado de la piel y al alivio de irritaciones leves.",
    description: "También conocida como aloe vera, destaca por el gel contenido en sus hojas carnosas."
  },
  {
    name: "Jengibre",
    use: "Tradicionalmente usado para náuseas, resfriados y malestar general.",
    description: "Raíz de sabor intenso con amplio uso en remedios caseros y bebidas calientes."
  }
];

const plantsList = document.getElementById("plants-list");
const plantForm = document.getElementById("plant-form");
const searchInput = document.getElementById("search-input");
const feedback = document.getElementById("feedback");
const emptyState = document.getElementById("empty-state");
const plantsCounter = document.getElementById("plants-counter");

let plants = loadPlants();

renderPlants(plants);
updateCounter(plants.length, plants.length);

searchInput.addEventListener("input", handleSearch);
plantForm.addEventListener("submit", handleSubmit);

function loadPlants() {
  const storedPlants = localStorage.getItem(STORAGE_KEY);

  if (!storedPlants) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultPlants));
    return [...defaultPlants];
  }

  try {
    const parsedPlants = JSON.parse(storedPlants);
    return Array.isArray(parsedPlants) && parsedPlants.length ? parsedPlants : [...defaultPlants];
  } catch (error) {
    console.error("No fue posible leer las plantas guardadas:", error);
    return [...defaultPlants];
  }
}

function savePlants() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plants));
}

function handleSearch(event) {
  const query = event.target.value.trim().toLowerCase();
  const filteredPlants = plants.filter((plant) =>
    plant.name.toLowerCase().includes(query)
  );

  renderPlants(filteredPlants);
  updateCounter(filteredPlants.length, plants.length);
}

function handleSubmit(event) {
  event.preventDefault();

  clearErrors();
  clearFeedback();

  const formData = new FormData(plantForm);
  const newPlant = {
    name: formData.get("name").trim(),
    use: formData.get("use").trim(),
    description: formData.get("description").trim()
  };

  const validationErrors = validatePlant(newPlant);

  if (Object.keys(validationErrors).length > 0) {
    showErrors(validationErrors);
    return;
  }

  plants.unshift(newPlant);
  savePlants();
  plantForm.reset();
  searchInput.value = "";
  renderPlants(plants);
  updateCounter(plants.length, plants.length);
  showFeedback(`"${newPlant.name}" fue agregada correctamente.`);
}

function validatePlant(plant) {
  const errors = {};

  if (plant.name.length < 2) {
    errors.name = "Ingresa un nombre con al menos 2 caracteres.";
  }

  if (plant.use.length < 8) {
    errors.use = "Describe el uso medicinal con mayor detalle.";
  }

  if (plant.description.length < 12) {
    errors.description = "La descripción debe tener al menos 12 caracteres.";
  }

  return errors;
}

function showErrors(errors) {
  Object.entries(errors).forEach(([field, message]) => {
    const errorElement = document.getElementById(`${field}-error`);
    const inputElement = document.getElementById(field);

    if (errorElement) {
      errorElement.textContent = message;
    }

    if (inputElement) {
      inputElement.setAttribute("aria-invalid", "true");
    }
  });
}

function clearErrors() {
  document.querySelectorAll(".field__error").forEach((element) => {
    element.textContent = "";
  });

  document.querySelectorAll("[aria-invalid='true']").forEach((element) => {
    element.removeAttribute("aria-invalid");
  });
}

function showFeedback(message) {
  feedback.textContent = message;
}

function clearFeedback() {
  feedback.textContent = "";
}

function renderPlants(items) {
  plantsList.innerHTML = "";

  if (items.length === 0) {
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");

  const cards = items.map(createPlantCard);
  plantsList.append(...cards);
}

function createPlantCard(plant) {
  const article = document.createElement("article");
  article.className = "plant-card";

  const title = document.createElement("h3");
  title.className = "plant-card__title";
  title.textContent = plant.name;

  const description = document.createElement("p");
  description.className = "plant-card__description";
  description.textContent = plant.description;

  const use = document.createElement("p");
  use.className = "plant-card__use";
  use.innerHTML = `<strong>Uso medicinal:</strong> ${plant.use}`;

  article.append(title, description, use);

  return article;
}

function updateCounter(visibleCount, totalCount) {
  plantsCounter.textContent = visibleCount === totalCount
    ? `${totalCount} plantas`
    : `${visibleCount} de ${totalCount} plantas`;
}
