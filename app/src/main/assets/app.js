// Dati predefiniti estratti dal file Excel originale
const DEFAULT_DATA = [
  {
    id: 1,
    descrizione: "SALE",
    ubicazione: "ARMADIO D1",
    cartoni: 2,
    pezzi: 3,
    pezziPerCartone: 1,
    unitaMisura: "sacco da 25kg",
    note: "1 CT = 1 sacco da 25kg"
  },
  {
    id: 2,
    descrizione: "FARINA TIPO 00 - 25KG",
    ubicazione: "ARMADIO D2",
    cartoni: 1,
    pezzi: 0,
    pezziPerCartone: 1,
    unitaMisura: "sacco da 25kg",
    note: "1 CT = 1 sacco da 25kg"
  },
  {
    id: 3,
    descrizione: "MOZZARELLA FIORDILATTE 1KG",
    ubicazione: "ARMADIO D3",
    cartoni: 3,
    pezzi: 2,
    pezziPerCartone: 30,
    unitaMisura: "pezzi da 1kg",
    note: "1 CT = 30 pezzi da 1kg"
  },
  {
    id: 4,
    descrizione: "MOZZARELLA FIORDILATTE 1KG",
    ubicazione: "ARMADIO D4",
    cartoni: 2,
    pezzi: 5,
    pezziPerCartone: 10,
    unitaMisura: "pezzi da 1kg",
    note: "1 CT = 10 pezzi da 1kg"
  },
  {
    id: 5,
    descrizione: "PELATI SAN MARZANO DOP 400G",
    ubicazione: "CASETTA 1",
    cartoni: 5,
    pezzi: 6,
    pezziPerCartone: 12,
    unitaMisura: "lattine",
    note: "1 CT = 12 lattine"
  },
  {
    id: 6,
    descrizione: "ACQUA NATURALE 1L - 12PZ",
    ubicazione: "ANIMAZIONE",
    cartoni: 8,
    pezzi: 4,
    pezziPerCartone: 12,
    unitaMisura: "bottiglie",
    note: "1 CT = 12 bottiglie"
  },
  {
    id: 7,
    descrizione: "CHIANTI CLASSICO DOCG",
    ubicazione: "MAGAZZINO D3",
    cartoni: 2,
    pezzi: 0,
    pezziPerCartone: 6,
    unitaMisura: "bottiglie",
    note: "1 CT = 6 bottiglie"
  },
  {
    id: 8,
    descrizione: "CHIANTI CLASSICO DOCG",
    ubicazione: "MAGAZZINO D4",
    cartoni: 0,
    pezzi: 3,
    pezziPerCartone: 6,
    unitaMisura: "bottiglie",
    note: "1 CT = 6 bottiglie"
  },
  {
    id: 9,
    descrizione: "PATATE",
    ubicazione: "ARMADIO D2",
    cartoni: 2,
    pezzi: 2,
    pezziPerCartone: 6,
    unitaMisura: "sacchi",
    note: "1 CT = 6 bottiglie/sacchi"
  },
  {
    id: 10,
    descrizione: "PATATE",
    ubicazione: "ANIMAZIONE",
    cartoni: 4,
    pezzi: 1,
    pezziPerCartone: 6,
    unitaMisura: "sacchi",
    note: "1 CT = 6 bottiglie/sacchi"
  },
  {
    id: 11,
    descrizione: "FORCHETTE",
    ubicazione: "MAGAZZINO D3",
    cartoni: 0,
    pezzi: 0,
    pezziPerCartone: 1,
    unitaMisura: "confezione",
    note: "1 CT = confezione"
  }
];

const STORAGE_KEY = "magazzino_inventory_data_v1";

// Stato applicativo
let state = {
  items: [],
  selectedLocation: "TUTTE",
  searchQuery: "",
  activeTab: "tab-locations"
};

// Inizializzazione
function init() {
  loadData();
  setupEvents();
  render();
}

function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      state.items = JSON.parse(saved);
    } else {
      state.items = JSON.parse(JSON.stringify(DEFAULT_DATA));
      saveData(false);
    }
  } catch (e) {
    console.error("Errore caricamento dati:", e);
    state.items = JSON.parse(JSON.stringify(DEFAULT_DATA));
  }
}

function saveData(notify = true) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    if (notify) showToast("Salvataggio completato");
  } catch (e) {
    console.error("Errore salvataggio:", e);
  }
}

// Calcolo totale pezzi per una riga
function calcRowTotal(item) {
  const mult = Number(item.pezziPerCartone) || 1;
  const boxes = Number(item.cartoni) || 0;
  const units = Number(item.pezzi) || 0;
  return (boxes * mult) + units;
}

// Rendering Principale
function render() {
  renderLocationChips();
  renderItemsList();
  renderSummaryList();
}

// Chips Ubicazione
function renderLocationChips() {
  const container = document.getElementById("locationChips");
  const locationsSet = new Set(state.items.map(i => (i.ubicazione || "NON DEFINITO").trim().toUpperCase()));
  const locations = ["TUTTE", ...Array.from(locationsSet).sort()];

  container.innerHTML = locations.map(loc => {
    const isActive = state.selectedLocation === loc ? "active" : "";
    return `<button class="chip ${isActive}" data-loc="${loc}">${escapeHtml(loc)}</button>`;
  }).join("");

  container.querySelectorAll(".chip").forEach(btn => {
    btn.addEventListener("click", () => {
      state.selectedLocation = btn.getAttribute("data-loc");
      render();
    });
  });
}

// Rendering Lista Dettaglio
function renderItemsList() {
  const container = document.getElementById("itemsList");
  const counterEl = document.getElementById("counterFiltered");
  const totalPiecesEl = document.getElementById("totalPiecesFiltered");

  const query = state.searchQuery.trim().toLowerCase();
  
  const filtered = state.items.filter(item => {
    const matchesLoc = state.selectedLocation === "TUTTE" || 
      (item.ubicazione || "").trim().toUpperCase() === state.selectedLocation;
    
    const matchesQuery = !query || 
      (item.descrizione || "").toLowerCase().includes(query) ||
      (item.ubicazione || "").toLowerCase().includes(query) ||
      (item.note || "").toLowerCase().includes(query);

    return matchesLoc && matchesQuery;
  });

  counterEl.textContent = `${filtered.length} posizioni visualizzate`;
  
  let grandTotal = 0;
  filtered.forEach(it => { grandTotal += calcRowTotal(it); });
  totalPiecesEl.textContent = `Totale pezzi: ${grandTotal}`;

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding: 40px 10px; color: var(--text-muted);">
        <p style="font-size: 1.1rem; font-weight:600;">Nessun articolo trovato</p>
        <p style="font-size: 0.85rem; margin-top:4px;">Prova a modificare i filtri o la ricerca.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(item => {
    const tot = calcRowTotal(item);
    return `
      <div class="item-card" data-id="${item.id}">
        <div class="item-card-header">
          <h3 class="item-title">${escapeHtml(item.descrizione)}</h3>
          <span class="location-tag">${escapeHtml(item.ubicazione || "GENERALE")}</span>
        </div>

        <div class="item-details-row">
          <span class="note-text">${escapeHtml(item.note || "")}</span>
          <div class="total-pill">
            ${tot} <span>PZ TOTALI</span>
          </div>
        </div>

        <div class="controls-grid">
          <!-- Stepper Cartoni -->
          <div class="stepper-block">
            <span class="stepper-label">Cartoni (CT)</span>
            <div class="stepper-row">
              <button class="btn-step" onclick="changeQty(${item.id}, 'cartoni', -1)">-</button>
              <span class="stepper-val">${item.cartoni}</span>
              <button class="btn-step" onclick="changeQty(${item.id}, 'cartoni', 1)">+</button>
            </div>
          </div>

          <!-- Stepper Pezzi Sfusi -->
          <div class="stepper-block">
            <span class="stepper-label">Pezzi Sfusi (PZ)</span>
            <div class="stepper-row">
              <button class="btn-step" onclick="changeQty(${item.id}, 'pezzi', -1)">-</button>
              <span class="stepper-val">${item.pezzi}</span>
              <button class="btn-step" onclick="changeQty(${item.id}, 'pezzi', 1)">+</button>
            </div>
          </div>
        </div>

        <div class="item-footer-actions">
          <button class="btn-text-action" onclick="openEditModal(${item.id})">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            Modifica / Dettagli
          </button>
        </div>
      </div>
    `;
  }).join("");
}

// Rendering Riepilogo Totali per Articolo (Tab 2)
function renderSummaryList() {
  const container = document.getElementById("summaryList");
  
  // Raggruppa per descrizione
  const summaryMap = {};
  state.items.forEach(item => {
    const key = (item.descrizione || "SENZA NOME").trim().toUpperCase();
    if (!summaryMap[key]) {
      summaryMap[key] = {
        name: key,
        locations: [],
        total: 0
      };
    }
    const tot = calcRowTotal(item);
    summaryMap[key].total += tot;
    summaryMap[key].locations.push(`${item.ubicazione || 'N/D'} (${tot} pz)`);
  });

  const sortedSummary = Object.values(summaryMap).sort((a, b) => a.name.localeCompare(b.name));

  container.innerHTML = sortedSummary.map(row => {
    return `
      <div class="summary-card">
        <div>
          <div class="summary-item-name">${escapeHtml(row.name)}</div>
          <div class="summary-locations-count">${escapeHtml(row.locations.join(", "))}</div>
        </div>
        <div class="summary-total-badge">
          <div class="summary-total-val">${row.total}</div>
          <div class="summary-total-label">Pezzi Totali</div>
        </div>
      </div>
    `;
  }).join("");
}

// Modifica Quantità (+ / -)
window.changeQty = function(id, field, delta) {
  const item = state.items.find(i => i.id === id);
  if (!item) return;

  const currentVal = Number(item[field]) || 0;
  const newVal = Math.max(0, currentVal + delta);
  item[field] = newVal;

  saveData(false);
  render();
};

// Eventi e Setup
function setupEvents() {
  // Nav tabs
  document.querySelectorAll(".nav-tabs .tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".nav-tabs .tab-btn").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));

      btn.classList.add("active");
      const tabId = btn.getAttribute("data-tab");
      document.getElementById(tabId).classList.add("active");
      state.activeTab = tabId;
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  // Ricerca
  const searchInput = document.getElementById("searchInput");
  const btnClearSearch = document.getElementById("btnClearSearch");

  searchInput.addEventListener("input", (e) => {
    state.searchQuery = e.target.value;
    if (state.searchQuery.length > 0) {
      btnClearSearch.classList.remove("hidden");
    } else {
      btnClearSearch.classList.add("hidden");
    }
    renderItemsList();
  });

  btnClearSearch.addEventListener("click", () => {
    searchInput.value = "";
    state.searchQuery = "";
    btnClearSearch.classList.add("hidden");
    renderItemsList();
  });

  // Modal Nuovo Articolo
  document.getElementById("btnNewItem").addEventListener("click", () => {
    openCreateModal();
  });

  // Modal Chiudi
  document.getElementById("btnModalClose").addEventListener("click", closeModal);
  document.getElementById("btnModalCancel").addEventListener("click", closeModal);

  // Form Salva
  document.getElementById("itemForm").addEventListener("submit", handleFormSubmit);

  // Elimina
  document.getElementById("btnModalDelete").addEventListener("click", () => {
    const id = Number(document.getElementById("formItemId").value);
    if (confirm("Vuoi davvero eliminare questo articolo da questa ubicazione?")) {
      state.items = state.items.filter(i => i.id !== id);
      saveData();
      closeModal();
      render();
    }
  });

  // Esporta CSV
  document.getElementById("btnExportCsv").addEventListener("click", exportToCsv);

  // Importa CSV
  document.getElementById("fileImportInput").addEventListener("change", handleImportCsv);

  // Ripristino Dati Iniziali
  document.getElementById("btnResetData").addEventListener("click", () => {
    if (confirm("Attenzione: questo cancellerà le modifiche locali e ripristinerà i dati iniziali del foglio Excel. Continuare?")) {
      state.items = JSON.parse(JSON.stringify(DEFAULT_DATA));
      saveData();
      render();
      showToast("Dati originali ripristinati!");
    }
  });
}

// Modal gestione
function openCreateModal() {
  document.getElementById("modalTitle").textContent = "Nuovo Articolo / Ubicazione";
  document.getElementById("formItemId").value = "";
  document.getElementById("formDesc").value = "";
  document.getElementById("formLocation").value = state.selectedLocation === "TUTTE" ? "" : state.selectedLocation;
  document.getElementById("formBoxes").value = 0;
  document.getElementById("formUnits").value = 0;
  document.getElementById("formMultiplier").value = 1;
  document.getElementById("formUom").value = "pezzi";
  document.getElementById("formNotes").value = "1 CT = 1 pezzo";
  document.getElementById("btnModalDelete").classList.add("hidden");

  document.getElementById("itemModal").classList.remove("hidden");
}

window.openEditModal = function(id) {
  const item = state.items.find(i => i.id === id);
  if (!item) return;

  document.getElementById("modalTitle").textContent = "Modifica Articolo";
  document.getElementById("formItemId").value = item.id;
  document.getElementById("formDesc").value = item.descrizione || "";
  document.getElementById("formLocation").value = item.ubicazione || "";
  document.getElementById("formBoxes").value = item.cartoni || 0;
  document.getElementById("formUnits").value = item.pezzi || 0;
  document.getElementById("formMultiplier").value = item.pezziPerCartone || 1;
  document.getElementById("formUom").value = item.unitaMisura || "";
  document.getElementById("formNotes").value = item.note || "";
  document.getElementById("btnModalDelete").classList.remove("hidden");

  document.getElementById("itemModal").classList.remove("hidden");
};

function closeModal() {
  document.getElementById("itemModal").classList.add("hidden");
}

function handleFormSubmit(e) {
  e.preventDefault();
  const idVal = document.getElementById("formItemId").value;
  const desc = document.getElementById("formDesc").value.trim().toUpperCase();
  const loc = document.getElementById("formLocation").value.trim().toUpperCase();
  const boxes = parseInt(document.getElementById("formBoxes").value, 10) || 0;
  const units = parseInt(document.getElementById("formUnits").value, 10) || 0;
  const mult = parseInt(document.getElementById("formMultiplier").value, 10) || 1;
  const uom = document.getElementById("formUom").value.trim();
  const notes = document.getElementById("formNotes").value.trim();

  if (idVal) {
    // Modifica
    const item = state.items.find(i => i.id === Number(idVal));
    if (item) {
      item.descrizione = desc;
      item.ubicazione = loc;
      item.cartoni = boxes;
      item.pezzi = units;
      item.pezziPerCartone = mult;
      item.unitaMisura = uom;
      item.note = notes;
    }
  } else {
    // Nuovo
    const newId = state.items.length > 0 ? Math.max(...state.items.map(i => i.id)) + 1 : 1;
    state.items.push({
      id: newId,
      descrizione: desc,
      ubicazione: loc,
      cartoni: boxes,
      pezzi: units,
      pezziPerCartone: mult,
      unitaMisura: uom,
      note: notes
    });
  }

  saveData();
  closeModal();
  render();
}

// Esportazione CSV formattata per Excel
function exportToCsv() {
  let csv = "\uFEFFDescrizione,Ubicazione,CT (Cartoni),PZ (Pezzi Sfusi),Totale Pezzi,Note,Pezzi Per Cartone\n";
  
  state.items.forEach(item => {
    const tot = calcRowTotal(item);
    const row = [
      `"${(item.descrizione || "").replace(/"/g, '""')}"`,
      `"${(item.ubicazione || "").replace(/"/g, '""')}"`,
      item.cartoni,
      item.pezzi,
      tot,
      `"${(item.note || "").replace(/"/g, '""')}"`,
      item.pezziPerCartone || 1
    ];
    csv += row.join(",") + "\n";
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `inventario_magazzino_${new Date().toISOString().slice(0,10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast("File CSV scaricato con successo!");
}

// Importazione CSV
function handleImportCsv(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    try {
      const text = evt.target.result;
      const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
      if (lines.length < 2) {
        alert("Il file selezionato non contiene abbastanza dati.");
        return;
      }

      const importedItems = [];
      let currentId = 1;

      // Salta intestazione (prima riga)
      for (let i = 1; i < lines.length; i++) {
        const parts = parseCsvLine(lines[i]);
        if (parts.length >= 2 && parts[0].trim() !== "") {
          const desc = parts[0].trim();
          const loc = parts[1] ? parts[1].trim() : "GENERALE";
          const ct = parseInt(parts[2], 10) || 0;
          const pz = parseInt(parts[3], 10) || 0;
          const note = parts[5] ? parts[5].trim() : "";
          const mult = parts[6] ? parseInt(parts[6], 10) : 1;

          importedItems.push({
            id: currentId++,
            descrizione: desc,
            ubicazione: loc,
            cartoni: ct,
            pezzi: pz,
            pezziPerCartone: mult || 1,
            unitaMisura: "",
            note: note
          });
        }
      }

      if (importedItems.length > 0) {
        state.items = importedItems;
        saveData();
        render();
        showToast(`Importati ${importedItems.length} articoli con successo!`);
      } else {
        alert("Nessun articolo valido trovato nel file.");
      }
    } catch (err) {
      console.error(err);
      alert("Errore durante la lettura del file CSV.");
    }
  };
  reader.readAsText(file, "UTF-8");
  e.target.value = "";
}

function parseCsvLine(text) {
  const result = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      if (inQuotes && text[i+1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      result.push(cur.trim());
      cur = '';
    } else {
      cur += c;
    }
  }
  result.push(cur.trim());
  return result;
}

// Utility Toast
function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.remove("hidden");
  setTimeout(() => {
    toast.classList.add("hidden");
  }, 2200);
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Avvio
window.addEventListener("DOMContentLoaded", init);
