/**
 * Update Inventory page
 * --------------------------------------------------------
 * Defines what each of the 8 action cards should show in
 * the popup (via Modal.open) and what happens on submit.
 * All reading/writing of inventory data goes through
 * InventoryData, so swapping the mock data for the real
 * Spring Boot API later only means editing inventory-data.js.
 * --------------------------------------------------------
 */

function todayISO() {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// Dimensions are stored as "WIDTH x HEIGHT" strings (e.g. "7 x 3").
// These helpers split/join that format so the popup can ask for
// width and height as two separate fields.
function splitDimension(dim) {
    const [width, height] = String(dim).split("x").map((p) => p.trim());
    return { width, height };
}

function joinDimension(width, height) {
    return `${String(width).trim()} x ${String(height).trim()}`;
}

function getDimensionWidths() {
    return [...new Set(InventoryData.getDimensions().map((d) => splitDimension(d).width))];
}

function getDimensionHeights() {
    return [...new Set(InventoryData.getDimensions().map((d) => splitDimension(d).height))];
}

const ACTIONS = {

    addstock: {
        title: "Purchase Stock",
        description: "Record a purchase and add quantity to an existing model, dimension and grade combination.",
        submitLabel: "Purchase Stock",
        fields: [
            { id: "model", label: "Model", type: "select", required: true, placeholder: "Select Model", row: "r1", optionsFn: () => InventoryData.getModels() },
            { id: "dimension", label: "Dimension", type: "select", required: true, placeholder: "Select Dimension", row: "r1", optionsFn: () => InventoryData.getDimensions() },
            { id: "grade", label: "Grade", type: "select", required: true, placeholder: "Select Grade", row: "r2", optionsFn: () => InventoryData.getGrades() },
            { id: "quantity", label: "Quantity", type: "number", required: true, min: 1, default: 0, row: "r2" },

            { id: "supplierName", label: "Supplier Name", type: "text", required: true, placeholder: "Enter supplier name" },
            { id: "supplierMobile", label: "Supplier Mobile Number", type: "tel", required: true, placeholder: "10-digit mobile number" },

            { id: "billId", label: "Bill ID", type: "text", required: true, placeholder: "Enter bill ID", row: "r3" },
            { id: "date", label: "Date", type: "date", required: true, default: todayISO(), max: todayISO(), row: "r3" },

            { id: "notes", label: "Notes", type: "textarea", required: false, placeholder: "Optional notes about this purchase" }
        ],
        onSubmit(values, { close, showToast }) {
            InventoryData.addStock({
                model: values.model,
                dimension: values.dimension,
                grade: values.grade,
                quantity: Number(values.quantity),
                supplierName: values.supplierName.trim(),
                supplierMobile: values.supplierMobile.trim(),
                billId: values.billId.trim(),
                date: values.date,
                notes: values.notes.trim()
            });
            showToast(`Added ${values.quantity} × ${values.model} (${values.dimension}, Grade ${values.grade}) to stock.`, "success");
            close();
        }
    },

    removestock: {
        title: "Sell Stock",
        description: "Record a sale and remove quantity from an existing model, dimension and grade combination.",
        submitLabel: "Sell Stock",
        destructive: true,
        fields: [
            { id: "model", label: "Model", type: "select", required: true, placeholder: "Select Model", row: "r1", optionsFn: () => InventoryData.getModels() },
            { id: "dimension", label: "Dimension", type: "select", required: true, placeholder: "Select Dimension", row: "r1", optionsFn: () => InventoryData.getDimensions() },
            { id: "grade", label: "Grade", type: "select", required: true, placeholder: "Select Grade", row: "r2", optionsFn: () => InventoryData.getGrades() },
            { id: "quantity", label: "Quantity", type: "number", required: true, min: 1, default: 0, row: "r2" },

            { id: "customerName", label: "Customer Name", type: "text", required: true, placeholder: "Enter customer name" },
            { id: "customerMobile", label: "Customer Mobile Number", type: "tel", required: true, placeholder: "10-digit mobile number" },

            { id: "billId", label: "Bill ID", type: "text", required: true, placeholder: "Enter bill ID", row: "r3" },
            { id: "date", label: "Date", type: "date", required: true, default: todayISO(), max: todayISO(), row: "r3" },

            { id: "notes", label: "Notes", type: "textarea", required: false, placeholder: "Optional notes about this sale" }
        ],
        validate(values) {
            const available = InventoryData.getStockQty(values.model, values.dimension, values.grade);
            if (Number(values.quantity) > available) {
                return { quantity: `Only ${available} in stock — cannot remove ${values.quantity}.` };
            }
            return null;
        },
        onSubmit(values, { close, showToast }) {
            InventoryData.removeStock({
                model: values.model,
                dimension: values.dimension,
                grade: values.grade,
                quantity: Number(values.quantity),
                customerName: values.customerName.trim(),
                customerMobile: values.customerMobile.trim(),
                billId: values.billId.trim(),
                date: values.date,
                notes: values.notes.trim()
            });
            showToast(`Removed ${values.quantity} × ${values.model} (${values.dimension}, Grade ${values.grade}) from stock.`, "danger");
            close();
        }
    },

    newmodel: {
        title: "Add Model",
        description: "Create a new door model and link it to one or more dimensions.",
        submitLabel: "Add Model",
        fields: [
            { id: "modelName", label: "Model Name", type: "text", required: true, placeholder: "Enter Model Name" },
            { id: "dimensions", label: "Dimensions", type: "multiselect", required: true, placeholder: "Select dimensions", optionsFn: () => InventoryData.getDimensions() }
        ],
        validate(values) {
            if (InventoryData.getModels().includes(values.modelName.trim())) {
                return { modelName: "A model with this name already exists." };
            }
            return null;
        },
        onSubmit(values, { close, showToast }) {
            const name = values.modelName.trim();
            InventoryData.addModel(name, values.dimensions);
            showToast(`Model "${name}" added.`, "success");
            close();
        }
    },

    deletemodel: {
        title: "Delete Model",
        description: "This permanently removes the model and all of its stock records.",
        submitLabel: "Delete Model",
        destructive: true,
        fields: [
            { id: "model", label: "Model", type: "select", required: true, placeholder: "Select Model", optionsFn: () => InventoryData.getModels() },
            { id: "confirm", type: "confirm", required: true, confirmLabel: "I understand this will permanently delete this model and its stock." }
        ],
        onSubmit(values, { close, showToast }) {
            InventoryData.removeModel(values.model);
            showToast(`Model "${values.model}" deleted.`, "danger");
            close();
        }
    },

    newdim: {
        title: "Add Dimension",
        description: "Create a new dimension and link it to one or more models.",
        submitLabel: "Add Dimension",
        fields: [
            { id: "width", label: "Width", type: "number", required: true, min: 0, step: "0.1", placeholder: "e.g. 7", row: "r1" },
            { id: "height", label: "Height", type: "number", required: true, min: 0, step: "0.1", placeholder: "e.g. 3", row: "r1" },
            { id: "models", label: "Models", type: "multiselect", required: true, placeholder: "Select models", optionsFn: () => InventoryData.getModels() }
        ],
        validate(values) {
            const name = joinDimension(values.width, values.height);
            if (InventoryData.getDimensions().includes(name)) {
                return { height: "This dimension already exists." };
            }
            return null;
        },
        onSubmit(values, { close, showToast }) {
            const name = joinDimension(values.width, values.height);
            InventoryData.addDimension(name, values.models);
            showToast(`Dimension "${name}" added.`, "success");
            close();
        }
    },

    deletedim: {
        title: "Delete Dimension",
        description: "This permanently removes the dimension and all related stock records.",
        submitLabel: "Delete Dimension",
        destructive: true,
        fields: [
            { id: "width", label: "Width", type: "select", required: true, placeholder: "Select Width", row: "r1", optionsFn: () => getDimensionWidths() },
            { id: "height", label: "Height", type: "select", required: true, placeholder: "Select Height", row: "r1", optionsFn: () => getDimensionHeights() },
            { id: "confirm", type: "confirm", required: true, confirmLabel: "I understand this will permanently delete this dimension and its stock." }
        ],
        validate(values) {
            const name = joinDimension(values.width, values.height);
            if (!InventoryData.getDimensions().includes(name)) {
                return { height: "No dimension matches this width and height." };
            }
            return null;
        },
        onSubmit(values, { close, showToast }) {
            const name = joinDimension(values.width, values.height);
            InventoryData.removeDimension(name);
            showToast(`Dimension "${name}" deleted.`, "danger");
            close();
        }
    },

    newgrade: {
        title: "Add Grade",
        description: "Create a new grade for a specific model and dimension.",
        submitLabel: "Add Grade",
        fields: [
            { id: "gradeName", label: "Grade", type: "text", required: true, placeholder: "Enter Grade (e.g. A)" },
            { id: "dimension", label: "Dimension", type: "select", required: true, placeholder: "Select Dimension", optionsFn: () => InventoryData.getDimensions() },
            { id: "model", label: "Model", type: "select", required: true, placeholder: "Select Model", optionsFn: () => InventoryData.getModels() }
        ],
        onSubmit(values, { close, showToast }) {
            const name = values.gradeName.trim();
            InventoryData.addGrade(name);
            showToast(`Grade "${name}" added for ${values.model} (${values.dimension}).`, "success");
            close();
        }
    },

    deletegrade: {
        title: "Delete Grade",
        description: "Select the exact model, dimension and grade combination to delete.",
        submitLabel: "Delete Grade",
        destructive: true,
        fields: [
            { id: "model", label: "Model", type: "select", required: true, placeholder: "Select Model", optionsFn: () => InventoryData.getModels() },
            { id: "dimension", label: "Dimension", type: "select", required: true, placeholder: "Select Dimension", optionsFn: () => InventoryData.getDimensions() },
            { id: "grade", label: "Grade", type: "select", required: true, placeholder: "Select Grade", optionsFn: () => InventoryData.getGrades() },
            { id: "confirm", type: "confirm", required: true, confirmLabel: "I understand this will permanently delete this grade combination." }
        ],
        onSubmit(values, { close, showToast }) {
            InventoryData.removeGrade(values.grade, values.model, values.dimension);
            showToast(`Grade "${values.grade}" removed for ${values.model} (${values.dimension}).`, "danger");
            close();
        }
    }

};

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".cards").forEach((card) => {
        const actionKey = card.id;
        const config = ACTIONS[actionKey];
        if (!config) return;

        card.setAttribute("tabindex", "0");
        card.setAttribute("role", "button");
        card.setAttribute("aria-label", config.title);

        const openModal = () => Modal.open(config);

        card.addEventListener("click", openModal);
        card.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openModal();
            }
        });
    });
});
