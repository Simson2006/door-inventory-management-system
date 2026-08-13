/**
 * Transaction History page
 * --------------------------------------------------------
 * Reads every purchase/sale from InventoryData.getTransactions()
 * and renders them into a searchable, filterable table. All
 * data access goes through InventoryData, so swapping the mock
 * ledger for a real API later only means editing inventory-data.js.
 * --------------------------------------------------------
 */

document.addEventListener("DOMContentLoaded", () => {

    const searchInput = document.getElementById("txSearch");
    const typeSelect = document.getElementById("txType");
    const modelSelect = document.getElementById("txModel");
    const fromInput = document.getElementById("txFrom");
    const toInput = document.getElementById("txTo");
    const clearBtn = document.getElementById("txClear");

    const tableBody = document.getElementById("txTableBody");
    const emptyMsg = document.getElementById("txEmpty");
    const countLabel = document.getElementById("txCount");

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }

    function formatDate(iso) {
        if (!iso) return "—";
        const d = new Date(`${iso}T00:00:00`);
        if (Number.isNaN(d.getTime())) return iso;
        return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    }

    // ===== Populate the model filter from live catalog data ==========

    function populateModelFilter() {
        InventoryData.getModels().forEach((model) => {
            const opt = document.createElement("option");
            opt.value = model;
            opt.textContent = model;
            modelSelect.appendChild(opt);
        });
    }

    // ===== Render ======================================================

    function matchesFilters(tx) {
        const query = searchInput.value.trim().toLowerCase();
        const type = typeSelect.value;
        const model = modelSelect.value;
        const from = fromInput.value;
        const to = toInput.value;

        if (type !== "all" && tx.type !== type) return false;
        if (model !== "all" && tx.model !== model) return false;
        if (from && tx.date < from) return false;
        if (to && tx.date > to) return false;

        if (query) {
            const haystack = `${tx.personName} ${tx.mobile} ${tx.notes || ""}`.toLowerCase();
            if (!haystack.includes(query)) return false;
        }

        return true;
    }

    function renderRow(tx) {
        const typeLabel = tx.type === "purchase" ? "Purchase" : "Sale";
        const pillClass = tx.type === "purchase" ? "purchase" : "sale";

        return `<tr>
                    <td><span class="tx-type-pill ${pillClass}">${typeLabel}</span></td>
                    <td>${escapeHtml(tx.personName)}</td>
                    <td>${escapeHtml(tx.mobile)}</td>
                    <td>${escapeHtml(tx.model)}</td>
                    <td>${escapeHtml(tx.dimension)}</td>
                    <td>${escapeHtml(tx.grade)}</td>
                    <td>${escapeHtml(tx.quantity)}</td>
                    <td>${tx.billId ? escapeHtml(tx.billId) : "—"}</td>
                    <td>${formatDate(tx.date)}</td>
                    <td class="tx-notes">${tx.notes ? escapeHtml(tx.notes) : "—"}</td>
                </tr>`;
    }

    function render() {
        const all = InventoryData.getTransactions()
            .slice()
            .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

        const filtered = all.filter(matchesFilters);

        tableBody.innerHTML = filtered.map(renderRow).join("");
        emptyMsg.hidden = filtered.length !== 0;
        countLabel.textContent = `${filtered.length} of ${all.length} shown`;
    }

    // ===== Wiring =======================================================

    [searchInput, typeSelect, modelSelect, fromInput, toInput].forEach((el) => {
        el.addEventListener("input", render);
        el.addEventListener("change", render);
    });

    clearBtn.addEventListener("click", () => {
        searchInput.value = "";
        typeSelect.value = "all";
        modelSelect.value = "all";
        fromInput.value = "";
        toInput.value = "";
        render();
    });

    populateModelFilter();
    render();
});
