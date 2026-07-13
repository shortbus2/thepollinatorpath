(function () {
  function daysSince(dateString) {
    if (!dateString) return Infinity;
    const value = new Date(dateString + "T12:00:00");
    return Math.floor((Date.now() - value.getTime()) / 86400000);
  }

  window.buildGardenPrompts = function buildGardenPrompts({ plants = [], observations = [], objects = [] } = {}) {
    const latestBySubject = new Map();
    observations.forEach((entry) => {
      const ids = [entry.primary?.id, ...(entry.plants || []), ...(entry.visitors || []), ...(entry.objects || [])].filter(Boolean);
      ids.forEach((id) => {
        const previous = latestBySubject.get(id);
        if (!previous || String(entry.date) > String(previous)) latestBySubject.set(id, entry.date);
      });
    });

    const prompts = [];
    plants.forEach((plant) => {
      const id = String(plant.id ?? plant.number ?? "");
      if (!id) return;
      const last = latestBySubject.get(id);
      if (!last || daysSince(last) >= 30) prompts.push({ type: "plant-update", subjectId: id, text: `${plant.commonName || plant.name || `Plant #${id}`} has not been documented recently.` });
      if (!plant.heroImage) prompts.push({ type: "portrait", subjectId: id, text: `${plant.commonName || plant.name || `Plant #${id}`} still needs a master portrait.` });
    });
    objects.forEach((object) => {
      const last = latestBySubject.get(object.id);
      if (!last || daysSince(last) >= 60) prompts.push({ type: "object-update", subjectId: object.id, text: `${object.name} has not been updated for a while.` });
    });
    return prompts;
  };
})();
