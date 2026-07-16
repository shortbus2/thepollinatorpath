
(function () {
  "use strict";

  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

  const menuButton = $(".menu-btn");
  const navLinks = $(".nav-links");

  if (menuButton && navLinks) {
    const closeMenu=()=>{navLinks.classList.remove("open");menuButton.setAttribute("aria-expanded","false");menuButton.setAttribute("aria-label","Open menu");};
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
      menuButton.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    });
    navLinks.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown",event=>{if(event.key==="Escape")closeMenu();});
    addEventListener("resize",()=>{if(innerWidth>650)closeMenu();});
  }

  function iconFor(plant) {
    if (plant.type === "Tree") return "🌳";
    if (plant.type === "Grass") return "🌾";
    if (plant.type === "Shrub") return "🌿";
    if (plant.type === "Vine") return "🌱";
    if (plant.type === "Groundcover") return "🍃";
    return "🌼";
  }


  function activateImageFallbacks(parent = document) {
    $$(".image-shell", parent).forEach((shell) => {
      const image = $(".plant-image", shell);
      if (!image || image.dataset.fallbackReady === "true") return;

      image.dataset.fallbackReady = "true";
      const showFallback = () => shell.classList.add("image-missing");
      const showImage = () => shell.classList.remove("image-missing");

      image.addEventListener("error", showFallback, { once: true });
      image.addEventListener("load", showImage, { once: true });

      if (image.complete) {
        image.naturalWidth > 0 ? showImage() : showFallback();
      }
    });
  }


  function autoGallery(folder, label, icon, count = 12) {
    const parts = folder.split("/");
    const group = parts[1] === "plants" ? "plants" : "wildlife";
    const key = parts[2];
    const manifestItems = window.IMAGE_MANIFEST?.[group]?.[key]?.gallery || [];

    if (manifestItems.length) {
      return manifestItems.map((item, index) => {
        const src = typeof item === "string" ? item : item.src;
        const caption = typeof item === "string" ? "" : (item.caption || "");
        return `
          <figure class="media-tile">
            <img src="${src}" alt="${label} gallery photo ${index + 1}" loading="lazy">
            ${caption ? `<figcaption>${caption}</figcaption>` : ""}
          </figure>
        `;
      }).join("");
    }

    return Array.from({ length: count }, (_, index) => {
      const number = String(index + 1).padStart(2, "0");
      return `
        <figure class="media-tile auto-media" hidden>
          <img src="${folder}/photo-${number}.jpg" alt="${label} gallery photo ${index + 1}" loading="lazy">
        </figure>
      `;
    }).join("");
  }

  function activateAutoGalleries(parent = document) {
    $$(".auto-media", parent).forEach((tile) => {
      const image = $("img", tile);
      image.addEventListener("load", () => { tile.hidden = false; }, { once: true });
      image.addEventListener("error", () => tile.remove(), { once: true });
      if (image.complete) {
        if (image.naturalWidth > 0) tile.hidden = false;
        else tile.remove();
      }
    });
  }


  function observationsForPlant(number) {
    return (window.OBSERVATIONS || []).filter(o => o.public !== false && (o.plants || []).map(Number).includes(Number(number)));
  }
  function observationsForVisitor(slug) {
    return (window.OBSERVATIONS || []).filter(o => o.public !== false && (o.visitors || []).includes(slug));
  }
  function observationJournal(items) {
    if (!items.length) return '<p class="empty">No dated journal entries yet. The garden is still writing this page.</p>';
    return items.slice().sort((a,b)=>(b.date||'').localeCompare(a.date||'')).map(o => `
      <article class="journal-entry">
        <div class="journal-date">${new Date((o.date||'')+'T12:00:00').toLocaleDateString(undefined,{year:'numeric',month:'long',day:'numeric'})}</div>
        <h3>${o.title || 'Garden observation'}</h3>
        ${(o.photos||[]).length ? `<div class="journal-photos">${o.photos.map((src,i)=>`<img src="${src}" alt="${o.title||'Observation'} photo ${i+1}" loading="lazy">`).join('')}</div>` : ''}
        ${o.notes ? `<p>${o.notes}</p>` : ''}
        <div class="chips">${(o.behaviors||[]).map(x=>`<span class="chip">${x}</span>`).join('')}${o.confidence && o.confidence!=='confirmed'?`<span class="chip">${o.confidence} ID</span>`:''}</div>
      </article>`).join('');
  }

  function statusLinks(status) {
    const lower = status.toLowerCase();
    const links = [];

    if (lower.includes("native") && !lower.includes("non-native")) {
      links.push(
        '<a class="chip chip-link" href="native.html" aria-label="Learn what Native means">Native ↗</a>'
      );
    }

    if (lower.includes("native cultivar")) {
      links.push(
        '<a class="chip chip-link" href="native-cultivar.html" aria-label="Learn what Native Cultivar means">Native cultivar ↗</a>'
      );
    } else if (lower.includes("cultivar") && !lower.includes("non-native")) {
      links.push(
        '<a class="chip chip-link" href="native-cultivar.html" aria-label="Learn what Cultivar means">Cultivar ↗</a>'
      );
    }

    if (lower.includes("plant select")) {
      links.push(
        '<a class="chip chip-link" href="plant-select.html" aria-label="Learn what Plant Select means">Plant Select ↗</a>'
      );
    }

    if (lower.includes("non-native")) {
      links.push('<span class="chip">Non-native</span>');
    }

    return links.length ? links.join("") : `<span class="chip">${status}</span>`;
  }

  function plantCard(plant) {
    return `
      <article class="plant-card">
        <a class="plant-card-main" href="plant.html?id=${plant.number}">
          <div class="plant-photo image-shell">
            <img class="plant-image" src="${plant.image}" alt="${plant.common}" loading="lazy">
            <div class="image-fallback" aria-hidden="true">
              <span class="fallback-icon">${iconFor(plant)}</span>
              <span class="fallback-label">Photo coming soon</span>
            </div>
            <span class="plant-number">#${plant.number}</span>
          </div>
          <div class="plant-content">
            <h3>${plant.common}</h3>
            <div class="botanical">${plant.botanical}</div>
            <div class="meta">${plant.bloom}</div>
          </div>
        </a>
        <div class="plant-card-actions">
          <div class="chips">
            ${statusLinks(plant.status)}
            <span class="chip">${plant.type}</span>
          </div>
          <a class="card-link" href="plant.html?id=${plant.number}">View plant →</a>
        </div>
      </article>
    `;
  }

  const grid = $("#plant-grid");

  if (grid) {
    const search = $("#search");
    const type = $("#type");
    const status = $("#status");
    const bloom = $("#bloom");
    const count = $("#result-count");

    [...new Set(PLANTS.map((plant) => plant.type))]
      .sort()
      .forEach((value) => {
        type.insertAdjacentHTML("beforeend", `<option value="${value}">${value}</option>`);
      });

    [...new Set(PLANTS.map((plant) => plant.status))]
      .sort()
      .forEach((value) => {
        status.insertAdjacentHTML("beforeend", `<option value="${value}">${value}</option>`);
      });

    ["Spring", "Summer", "Fall", "Long season"].forEach((value) => {
      bloom.insertAdjacentHTML("beforeend", `<option value="${value}">${value}</option>`);
    });

    function matchesSeason(plant, selected) {
      if (!selected) return true;
      const value = plant.bloom.toLowerCase();

      if (selected === "Spring") return /april|may/.test(value);
      if (selected === "Summer") return /june|july|august/.test(value);
      if (selected === "Fall") return /september|october/.test(value);

      return /may.*september|may.*october|june.*september|july.*october/.test(value);
    }

    function renderPlants() {
      const query = search.value.trim().toLowerCase();

      const visible = PLANTS.filter((plant) => {
        const searchable = [
          plant.number,
          plant.common,
          plant.botanical,
          plant.location,
          plant.status,
          plant.type,
          plant.pollinators.join(" ")
        ]
          .join(" ")
          .toLowerCase();

        return (
          (!query || searchable.includes(query)) &&
          (!type.value || plant.type === type.value) &&
          (!status.value || plant.status === status.value) &&
          matchesSeason(plant, bloom.value)
        );
      });

      grid.innerHTML = visible.length
        ? visible.map(plantCard).join("")
        : '<p class="empty">No plants found. The bees have not stolen them; try another filter.</p>';

      count.textContent = `Showing ${visible.length} of ${PLANTS.length} plants.`;
      activateImageFallbacks(grid);
    }

    search.addEventListener("input", renderPlants);
    type.addEventListener("change", renderPlants);
    status.addEventListener("change", renderPlants);
    bloom.addEventListener("change", renderPlants);
    renderPlants();
  }

  const plantPage = $("#plant-page");

  if (plantPage) {
    const id = Number(new URLSearchParams(window.location.search).get("id"));
    const plant = PLANTS.find((item) => Number(item.number) === id) || PLANTS[0];

    document.title = `${plant.common} · The Pollinator Path`;

    const visitors = (plant.observed.length
      ? plant.observed
      : ["Visitor records coming soon"]
    )
      .map((visitor) => {
        let icon = "🐝";
        if (/humming|bird/i.test(visitor)) icon = "🐦";
        if (/butter|monarch/i.test(visitor)) icon = "🦋";

        return `
          <div class="visitor">
            <div class="visitor-icon" aria-hidden="true">${icon}</div>
            <small>${visitor}</small>
          </div>
        `;
      })
      .join("");

    plantPage.innerHTML = `
      <div class="plant-layout">
        <div class="plant-hero-image image-shell">
          <img class="plant-image" src="${plant.image}" alt="${plant.common}">
          <div class="image-fallback" aria-hidden="true">
            <span class="fallback-icon">${iconFor(plant)}</span>
            <span class="fallback-label">Photo coming soon</span>
          </div>
          <span class="plant-number">Plant #${plant.number}</span>
        </div>

        <div class="plant-header">
          <div class="standing">
            📍 You’re standing in front of this plant—or you found it from the map while wisely avoiding a spiderweb.
          </div>

          <h1>${plant.common}</h1>
          <div class="botanical" style="font-size:1.25rem">${plant.botanical}</div>

          <div class="chips">
            ${statusLinks(plant.status)}
            <span class="chip">${plant.type}</span>
            ${plant.pollinators.map((value) => `<span class="chip">${value}</span>`).join("")}
          </div>

          <div class="quick-grid">
            <div class="quick">☀️ <strong>Light</strong><small>${plant.sun}</small></div>
            <div class="quick">💧 <strong>Water</strong><small>${plant.water}</small></div>
            <div class="quick">🌸 <strong>Blooms</strong><small>${plant.bloom}</small></div>
            <div class="quick">📍 <strong>Find it</strong><small>${plant.mapZone}</small></div>
          </div>
        </div>

        <div class="content-grid">
          <div>
            <section class="panel">
              <h2>Why I love it</h2>
              <p>${plant.story}</p>
            </section>

            <section class="panel">
              <h2>Observed in my garden</h2>
              <div class="visitor-list">${visitors}</div>
              <p><small>Actual garden observations appear here when available—not a generic “may attract” list.</small></p>
            </section>

            <section class="panel">
              <h2>Photo gallery</h2>
              <div class="media-gallery auto-gallery">
                ${autoGallery(`images/plants/${plant.number}`, plant.common, iconFor(plant))}
              </div>
              <div class="gallery-empty-note">Add photos named <code>photo-01.jpg</code>, <code>photo-02.jpg</code>, and so on inside <code>images/plants/${plant.number}/</code>. They appear here automatically.</div>
            </section>

            <section class="panel">
              <h2>Living plant journal</h2>
              <div class="journal-list">${observationJournal(observationsForPlant(plant.number))}</div>
            </section>
            <section class="panel">
              <h2>My garden notes</h2>
              <ul>${plant.notes.map((note) => `<li>${note}</li>`).join("")}</ul>
            </section>
          </div>

          <aside>
            <section class="panel">
              <h2>Where is this plant?</h2>
              <p><strong>${plant.mapZone}</strong><br>${plant.location}</p>
              <a class="btn btn-green" href="map.html?plant=${plant.number}">View on map</a>
            </section>

            <section class="panel">
              <h2>Rabbit-hole starter</h2>
              <p>
                ${
                  plant.pollinators.includes("Native bees") || plant.pollinators.includes("Bees")
                    ? "Many native bees are solitary. Some nest in hollow stems; others excavate tiny tunnels in bare ground. Yes, the dirt is habitat. No, it does not need to be “fixed.”"
                    : "Follow the visitor links as observations are added to see how this plant fits into the larger food web."
                }
              </p>
            </section>
          </aside>
        </div>
      </div>
    `;
    activateImageFallbacks(plantPage);
    activateAutoGalleries(plantPage);
  }


  const visitorGrid = $("#visitor-grid");
  if (visitorGrid && window.VISITORS) {
    visitorGrid.innerHTML = VISITORS.map((visitor) => `
      <article class="visitor-card">
        <a href="wildlife.html?id=${visitor.slug}" class="visitor-card-link">
          <div class="visitor-photo image-shell">
            <img class="plant-image" src="${visitor.hero}" alt="${visitor.name}" loading="lazy">
            <div class="image-fallback" aria-hidden="true">
              <span class="fallback-icon">${visitor.icon}</span>
              <span class="fallback-label">Portrait coming soon</span>
            </div>
          </div>
          <div class="visitor-card-copy">
            <div class="eyebrow">${visitor.status}</div>
            <h2>${visitor.name}</h2>
            <div class="botanical">${visitor.species}</div>
            <p>${visitor.summary}</p>
            <strong>Meet this visitor →</strong>
          </div>
        </a>
      </article>
    `).join("");
    activateImageFallbacks(visitorGrid);
  }

  const wildlifePage = $("#wildlife-page");
  if (wildlifePage && window.VISITORS) {
    const slug = new URLSearchParams(window.location.search).get("id");
    const visitor = VISITORS.find((item) => item.slug === slug) || VISITORS[0];
    document.title = `${visitor.name} · The Pollinator Path`;
    const plantLinks = visitor.relatedPlants.length
      ? visitor.relatedPlants.map((number) => {
          const plant = PLANTS.find((item) => Number(item.number) === Number(number));
          return plant ? `<a class="chip chip-link" href="plant.html?id=${plant.number}">${plant.common} ↗</a>` : "";
        }).join("")
      : '<span class="chip">Plant links coming as observations grow</span>';

    wildlifePage.innerHTML = `
      <div class="wildlife-layout">
        <div class="wildlife-hero image-shell">
          <img class="plant-image" src="${visitor.hero}" alt="${visitor.name}">
          <div class="image-fallback" aria-hidden="true">
            <span class="fallback-icon">${visitor.icon}</span>
            <span class="fallback-label">Portrait coming soon</span>
          </div>
        </div>
        <header class="wildlife-heading">
          <div class="eyebrow">${visitor.status}</div>
          <h1>${visitor.name}</h1>
          <div class="botanical">${visitor.species}</div>
          <p class="wildlife-summary">${visitor.summary}</p>
        </header>
        <div class="content-grid wildlife-content">
          <div>
            <section class="panel"><h2>Its garden story</h2><p>${visitor.story}</p></section>
            <section class="panel">
              <h2>Photo gallery</h2>
              <div class="media-gallery auto-gallery">
                ${autoGallery(`images/wildlife/${visitor.slug}`, visitor.name, visitor.icon)}
              </div>
            </section>
            <section class="panel">
              <h2>Living visitor journal</h2>
              <div class="journal-list">${observationJournal(observationsForVisitor(visitor.slug))}</div>
            </section>
          </div>
          <aside>
            <section class="panel"><h2>First documented</h2><p>${visitor.firstSeen}</p></section>
            <section class="panel"><h2>Seen around</h2><ul>${visitor.locations.map((item) => `<li>${item}</li>`).join("")}</ul></section>
            <section class="panel"><h2>Observed behavior</h2><ul>${visitor.observations.map((item) => `<li>${item}</li>`).join("")}</ul></section>
            <section class="panel"><h2>Connected plants</h2><div class="chips">${plantLinks}</div></section>
          </aside>
        </div>
      </div>
    `;
    activateImageFallbacks(wildlifePage);
    activateAutoGalleries(wildlifePage);
  }

  const map = $("#garden-map");

  if (map) {
    const zoneCenters = {
      "West Garden": [20, 24],
      "Boulder Garden": [20, 68],
      "Oak Garden": [61, 26],
      "Front Path": [64, 72],
      "Front Garden": [48, 48],
      "Front Garden · West Side": [16, 52],
      "Front Garden / Garage Wall Garden": [78, 48],
      "Garage Wall Garden": [79, 55],
      "The Screen Garden": [82, 16]
    };

    const grouped = {};

    PLANTS.forEach((plant) => {
      const zone = plant.mapZone || "Front Garden";
      if (!grouped[zone]) grouped[zone] = [];
      grouped[zone].push(plant);
    });

    Object.entries(grouped).forEach(([zone, list]) => {
      const center = zoneCenters[zone] || [50, 50];

      list.forEach((plant, index) => {
        const angle = index * 2.399;
        const radius = 3 + Math.sqrt(index) * 2.2;
        const x = Math.max(3, Math.min(97, center[0] + Math.cos(angle) * radius));
        const y = Math.max(4, Math.min(96, center[1] + Math.sin(angle) * radius));

        map.insertAdjacentHTML(
          "beforeend",
          `<button
             class="pin"
             style="left:${x}%;top:${y}%"
             data-id="${plant.number}"
             aria-label="Plant ${plant.number}, ${plant.common}">
             ${plant.number}
           </button>`
        );
      });
    });

    const popup = $("#map-pop");

    $$(".pin", map).forEach((button) => {
      button.addEventListener("click", () => {
        const plant = PLANTS.find(
          (item) => Number(item.number) === Number(button.dataset.id)
        );

        popup.innerHTML = `
          <button class="map-close" aria-label="Close">×</button>
          <strong>#${plant.number} · ${plant.common}</strong>
          <div class="botanical">${plant.botanical}</div>
          <p>${plant.mapZone} · ${plant.bloom}</p>
          <a class="btn btn-green" href="plant.html?id=${plant.number}">Open plant profile</a>
        `;

        popup.classList.add("open");
        $(".map-close", popup).addEventListener("click", () =>
          popup.classList.remove("open")
        );
      });
    });

    const focusPlant = Number(
      new URLSearchParams(window.location.search).get("plant")
    );

    if (focusPlant) {
      const target = $(`.pin[data-id="${focusPlant}"]`, map);
      if (target) {
        window.setTimeout(() => target.click(), 100);
        target.scrollIntoView({ block: "center" });
      }
    }
  }
})();
