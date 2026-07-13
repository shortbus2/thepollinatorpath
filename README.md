# The Pollinator Path — static GitHub Pages site

## What is included
- Mobile-first entrance-QR home page
- Searchable and filterable front-yard plant directory
- One reusable plant profile page powered by `data.js`
- Interactive schematic garden map with clickable numbered pins
- Personal notes, humor, observed-wildlife sections, photo placeholders
- No database, build system, or paid hosting required

## Publish on GitHub Pages
1. Download and unzip the package.
2. Upload the contents—not the outer folder—to the root of your existing GitHub Pages repository.
3. Replace the existing files when GitHub asks.
4. Commit the changes.
5. GitHub Pages will publish the update.

Keep a copy of your current `index.html` before replacing it.

## Add or edit a plant
Open `data.js`. Each plant is one object inside `window.PLANTS`.

Important fields:
- `number`
- `common`
- `botanical`
- `location`
- `status`
- `pollinators`
- `bloom`
- `type`
- `sun`
- `water`
- `story`
- `observed`
- `notes`
- `mapZone`

The directory, profile page, search, and map all update from that one record.

## Add plant photos
Put a JPG at:
`images/plants/PLANTNUMBER.jpg`

Example:
`images/plants/8.jpg`

The current starter design uses botanical placeholders. The next upgrade is wiring the real image into each card and gallery, after your photos are selected and cropped consistently.

## Refine the map
Open `app.js` and find:
`const zones = { ... }`

Those percentages place the center of each garden zone. Plants are automatically arranged around their zone. For an exact map, the next step is to add `mapX` and `mapY` percentages to each plant in `data.js` using the numbered planting plan.

## Content accuracy notes
- Only plants listed in front-yard-related locations were included: Front yard, Shed garden, Garage wall, and Trash-can planter.
- Plants with blank locations or only Back yard were omitted.
- Botanical capitalization, hybrid symbols, and several common names were standardized.
- Bloom windows are practical garden ranges and can be adjusted to your actual observations.


## Welcome-and-invitation update
This version adds:
- A prominent “You’re Welcome Here” invitation immediately below the hero
- Explicit permission to walk the front paths, take photos, linger, and say hello
- A stepping-stone request explained through habitat rather than rules
- “Curiosity is encouraged”
- A new “Why This Garden Exists” section
- Updated navigation linking directly to that story
