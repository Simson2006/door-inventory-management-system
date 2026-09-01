/**
 * InventoryData
 * --------------------------------------------------------
 * Mock "data layer" for the Update Inventory & Transaction
 * History pages.
 *
 * Every method here is written the way a real API-backed
 * function would be used from the UI (take plain arguments,
 * return a plain result). When a backend API is ready, each
 * method's body can be swapped for a fetch() call without
 * touching any of the calling code in update_inventory.js /
 * transactions.js — the TODO comments mark exactly where
 * that swap happens.
 *
 * Stock and catalog data (models/dimensions/grades) reset on
 * every page load, same as before. Transactions are additionally
 * kept in localStorage purely so that a Purchase/Sale recorded
 * on the Update Inventory page still shows up if you then open
 * the Transaction History page in this demo — swap this for a
 * real API call when the backend is wired up.
 * --------------------------------------------------------
 */

const InventoryData = (function () {

    // ===== Mock "database" =====================================

    let models = ["Teak", "Oak", "Rosewood", "Pine", "Maple"];
    let dimensions = ["7 x 3", "6.5 x 3", "8 x 4", "6 x 2.5"];
    let grades = ["A", "B", "C"];

    // Which dimensions each model currently supports.
    let modelDimensions = {
        "Teak": ["7 x 3", "6.5 x 3"],
        "Oak": ["6.5 x 3", "8 x 4"],
        "Rosewood": ["7 x 3", "8 x 4"],
        "Pine": ["8 x 4", "6 x 2.5"],
        "Maple": ["6 x 2.5"]
    };

    // Stock ledger: one row per model + dimension + grade.
    let stock = [
        { model: "Teak", dimension: "7 x 3", grade: "A", qty: 20 },
        { model: "Oak", dimension: "6.5 x 3", grade: "B", qty: 18 },
        { model: "Rosewood", dimension: "7 x 3", grade: "A", qty: 5 },
        { model: "Pine", dimension: "8 x 4", grade: "C", qty: 6 },
        { model: "Maple", dimension: "6 x 2.5", grade: "B", qty: 4 }
    ];

    // ===== Transaction ledger (purchases & sales) ================

    const TX_STORAGE_KEY = "doorInventory_transactions";

    const seedTransactions = [
        {
            id: "TX-1004",
            type: "purchase",
            personName: "Ramesh Timber Suppliers",
            mobile: "9840012345",
            quantity: 12,
            billId: "BILL-2041",
            date: "2026-08-09",
            notes: "Monthly restock order",
            model: "Teak",
            dimension: "7 x 3",
            grade: "A"
        },
        {
            id: "TX-1003",
            type: "purchase",
            personName: "Balaji Wood Traders",
            mobile: "9884456781",
            quantity: 8,
            billId: "BILL-2038",
            date: "2026-08-09",
            notes: "",
            model: "Oak",
            dimension: "6.5 x 3",
            grade: "B"
        },
        {
            id: "TX-1002",
            type: "sale",
            personName: "S. Kumar",
            mobile: "9789912233",
            quantity: 3,
            billId: "BILL-2035",
            date: "2026-08-08",
            notes: "Delivered to site, Anna Nagar",
            model: "Rosewood",
            dimension: "8 x 4",
            grade: "A"
        },
        {
            id: "TX-1001",
            type: "sale",
            personName: "Meena Interiors",
            mobile: "9500123456",
            quantity: 2,
            billId: "BILL-2029",
            date: "2026-08-06",
            notes: "",
            model: "Pine",
            dimension: "8 x 4",
            grade: "C"
        }
    ];

    function loadTransactions() {
        // TODO: replace with `return fetch('/api/transactions').then(r => r.json());`
        try {
            const raw = window.localStorage.getItem(TX_STORAGE_KEY);
            if (raw) return JSON.parse(raw);
        } catch (e) {
            /* localStorage unavailable — fall back to seed data */
        }
        return [...seedTransactions];
    }

    function persistTransactions() {
        try {
            window.localStorage.setItem(TX_STORAGE_KEY, JSON.stringify(transactions));
        } catch (e) {
            /* ignore write failures (e.g. private browsing) */
        }
    }

    let transactions = loadTransactions();
    let nextTxNumber = transactions.reduce((max, t) => {
        const n = parseInt(String(t.id).replace(/\D/g, ""), 10);
        return Number.isFinite(n) ? Math.max(max, n) : max;
    }, 1000) + 1;

    function recordTransaction(entry) {
        const tx = {
            id: `TX-${nextTxNumber++}`,
            createdAt: new Date().toISOString(),
            ...entry
        };
        transactions.unshift(tx);
        persistTransactions();
        return tx;
    }

    function getTransactions() {
        // TODO: replace with `return fetch('/api/transactions').then(r => r.json());`
        return [...transactions];
    }

    // ===== Read helpers =========================================

    function getModels() {
        // TODO: replace with `return fetch('/api/models').then(r => r.json());`
        return [...models];
    }

    function getDimensions() {
        // TODO: replace with `return fetch('/api/dimensions').then(r => r.json());`
        return [...dimensions];
    }

    function getGrades() {
        // TODO: replace with `return fetch('/api/grades').then(r => r.json());`
        return [...grades];
    }

    function findStock(model, dimension, grade) {
        return stock.find(
            (row) => row.model === model && row.dimension === dimension && row.grade === grade
        );
    }

    function getStockQty(model, dimension, grade) {
        const row = findStock(model, dimension, grade);
        return row ? row.qty : 0;
    }

    // ===== Stock mutations (Purchase = Add Stock, Sale = Remove Stock) ==

    function addStock(details) {
        // details: { model, dimension, grade, quantity, supplierName,
        //            supplierMobile, billId, date, notes }
        // TODO: replace body with:
        // return fetch('/api/stock/add', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(details)
        // }).then(r => r.json());
        const { model, dimension, grade, quantity } = details;
        const row = findStock(model, dimension, grade);
        if (row) {
            row.qty += quantity;
        } else {
            stock.push({ model, dimension, grade, qty: quantity });
        }

        return recordTransaction({
            type: "purchase",
            personName: details.supplierName,
            mobile: details.supplierMobile,
            email: details.supplierEmail || "",
            quantity,
            billId: details.billId,
            date: details.date,
            notes: details.notes || "",
            model,
            dimension,
            grade
        });
    }

    function removeStock(details) {
        // details: { model, dimension, grade, quantity, customerName,
        //            customerMobile, billId, date, notes }
        // TODO: replace body with a POST/PATCH call to '/api/stock/remove'
        // carrying the same payload shape.
        const { model, dimension, grade, quantity } = details;
        const row = findStock(model, dimension, grade);
        const available = row ? row.qty : 0;

        if (quantity > available) {
            return { ok: false, message: `Only ${available} in stock.` };
        }

        row.qty -= quantity;

        const tx = recordTransaction({
            type: "sale",
            personName: details.customerName,
            mobile: details.customerMobile,
            email: details.customerEmail || "",
            quantity,
            billId: details.billId,
            date: details.date,
            notes: details.notes || "",
            model,
            dimension,
            grade
        });

        return { ok: true, remaining: row.qty, transaction: tx };
    }

    // ===== Model mutations =======================================

    function addModel(name, dims) {
        // TODO: replace with POST '/api/models'
        if (!models.includes(name)) {
            models.push(name);
        }
        modelDimensions[name] = [...new Set([...(modelDimensions[name] || []), ...dims])];
        return { ok: true };
    }

    function removeModel(name) {
        // TODO: replace with DELETE '/api/models/{name}'
        models = models.filter((m) => m !== name);
        delete modelDimensions[name];
        stock = stock.filter((row) => row.model !== name);
        return { ok: true };
    }

    // ===== Dimension mutations ====================================

    function addDimension(name, modelNames) {
        // TODO: replace with POST '/api/dimensions'
        if (!dimensions.includes(name)) {
            dimensions.push(name);
        }
        modelNames.forEach((m) => {
            modelDimensions[m] = [...new Set([...(modelDimensions[m] || []), name])];
        });
        return { ok: true };
    }

    function removeDimension(name) {
        // TODO: replace with DELETE '/api/dimensions/{name}'
        dimensions = dimensions.filter((d) => d !== name);
        Object.keys(modelDimensions).forEach((m) => {
            modelDimensions[m] = modelDimensions[m].filter((d) => d !== name);
        });
        stock = stock.filter((row) => row.dimension !== name);
        return { ok: true };
    }

    // ===== Grade mutations =========================================

    function addGrade(name) {
        // TODO: replace with POST '/api/grades'
        if (!grades.includes(name)) {
            grades.push(name);
        }
        return { ok: true };
    }

    function removeGrade(name, model, dimension) {
        // TODO: replace with DELETE '/api/grades/{name}' scoped to
        // the model + dimension combination sent from the form.
        stock = stock.filter(
            (row) => !(row.model === model && row.dimension === dimension && row.grade === name)
        );
        const stillUsed = stock.some((row) => row.grade === name);
        if (!stillUsed) {
            grades = grades.filter((g) => g !== name);
        }
        return { ok: true };
    }

    return {
        getModels,
        getDimensions,
        getGrades,
        findStock,
        getStockQty,
        addStock,
        removeStock,
        addModel,
        removeModel,
        addDimension,
        removeDimension,
        addGrade,
        removeGrade,
        getTransactions
    };

}());
