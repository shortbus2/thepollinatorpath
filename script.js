const plants = [
  {
    common: "Blanket Flower",
    latin: "Gaillardia aristata",
    description: "A long-blooming prairie favorite and one of the busiest insect gathering places in the garden.",
    tags: ["native", "bee", "butterfly"],
    badges: ["Colorado native", "Bees", "Butterflies"],
    colors: ["#d99b34", "#b94b35"]
  },
  {
    common: "Blue Flax",
    latin: "Linum lewisii",
    description: "Delicate blue flowers that open in the morning and move beautifully in the breeze.",
    tags: ["native", "bee"],
    badges: ["Colorado native", "Early summer", "Bees"],
    colors: ["#8098c4", "#d8dfef"]
  },
  {
    common: "Vermillion Bluffs",
    latin: "Epilobium canum",
    description: "A vivid late-season nectar source with tubular flowers loved by hummingbirds.",
    tags: ["plant-select", "hummingbird"],
    badges: ["Plant Select", "Hummingbirds", "Late season"],
    colors: ["#c55a3f", "#ed9a62"]
  },
  {
    common: "Hummingbird Trumpet",
    latin: "Epilobium canum",
    description: "Heat-loving scarlet trumpets that keep the garden buzzing when summer is at its hottest.",
    tags: ["native", "hummingbird"],
    badges: ["Regional native", "Hummingbirds", "Drought tolerant"],
    colors: ["#a93e31", "#e67e59"]
  },
  {
    common: "Wild Bergamot",
    latin: "Monarda fistulosa",
    description: "Lavender flower heads provide nectar for bees, butterflies, and hummingbirds.",
    tags: ["native", "bee", "hummingbird", "butterfly"],
    badges: ["Colorado native", "Bees", "Hummingbirds"],
    colors: ["#8d779f", "#c8b6d3"]
  },
  {
    common: "Showy Milkweed",
    latin: "Asclepias speciosa",
    description: "A host plant for monarch caterpillars and an important nectar source for many insects.",
    tags: ["native", "bee", "butterfly"],
    badges: ["Colorado native", "Monarch host", "Bees"],
    colors: ["#b78ea9", "#e1c8d8"]
  },
  {
    common: "Prairie Smoke",
    latin: "Geum triflorum",
    description: "Early nodding flowers followed by wispy seed heads that look like pink smoke.",
    tags: ["native", "bee"],
    badges: ["Regional native", "Spring bloom", "Texture"],
    colors: ["#a15f5e", "#dcc4af"]
  },
  {
    common: "Red Birds in a Tree",
    latin: "Scrophularia macrantha",
    description: "A distinctive red-flowered perennial with strong hummingbird appeal.",
    tags: ["plant-select", "hummingbird"],
    badges: ["Plant Select", "Hummingbirds", "Unique form"],
    colors: ["#b13d35", "#d77c5e"]
  },
  {
    common: "Rocky Mountain Penstemon",
    latin: "Penstemon strictus",
    description: "Electric blue-purple flower spikes that feed native bees in early summer.",
    tags: ["native", "bee"],
    badges: ["Colorado native", "Bees", "Early summer"],
    colors: ["#64599d", "#a59ed0"]
  }
];

const plantGrid = document.querySelector("#plant-grid");
const searchInput = document.querySelector("#plant-search");
const filterButtons = [...document.querySelectorAll(".filter-button")];
let activeFilter = "all";

function renderPlants() {
  const query = searchInput.value.trim().toLowerCase();

  const filtered = plants.filter(plant => {
    const searchable = [
      plant.common,
      plant.latin,
      plant.description,
      plant.tags.join(" "),
      plant.badges.join(" ")
    ].join(" ").toLowerCase();

    const matchesSearch = searchable.includes(query);
    const matchesFilter = activeFilter === "all" || plant.tags.includes(activeFilter);
    return matchesSearch && matchesFilter;
  });

  plantGrid.innerHTML = "";

  if (!filtered.length) {
    plantGrid.innerHTML = '<div class="empty-state">No plants match that search yet.</div>';
    return;
  }

  filtered.forEach(plant => {
    const card = document.createElement("article");
    card.className = "plant-card";
    card.innerHTML = `
      <div class="plant-swatch" style="--swatch-a:${plant.colors[0]};--swatch-b:${plant.colors[1]}"></div>
      <h3>${plant.common}</h3>
      <p class="latin">${plant.latin}</p>
      <p>${plant.description}</p>
      <div class="badges">
        ${plant.badges.map(badge => `<span class="badge">${badge}</span>`).join("")}
      </div>
    `;
    plantGrid.appendChild(card);
  });
}

searchInput.addEventListener("input", renderPlants);

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach(btn => btn.classList.toggle("active", btn === button));
    renderPlants();
  });
});

const menuButton = document.querySelector(".menu-button");
const nav = document.querySelector(".site-nav");

menuButton.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

nav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  });
});

document.querySelector("#year").textContent = new Date().getFullYear();
renderPlants();
