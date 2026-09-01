/**
 * Modal
 * --------------------------------------------------------
 * Generic, reusable popup engine. Every inventory action
 * (Add Stock, Delete Model, Add Grade, ...) opens the SAME
 * popup markup in the page — this file just re-renders the
 * fields inside it from a small config object:
 *
 *   Modal.open({
 *     title: "Add Stock",
 *     description: "optional helper text",
 *     submitLabel: "Add Stock",
 *     destructive: false,
 *     fields: [ { id, label, type, required, ... }, ... ],
 *     validate(values) { return null | { fieldId: "message" }; },
 *     onSubmit(values, { close, showToast }) { ... }
 *   });
 *
 * Supported field types: text, number, tel, email, date, textarea,
 * select, multiselect, confirm.
 * --------------------------------------------------------
 */

const Modal = (function () {

    const overlay = document.getElementById("overlay");
    const popup = document.getElementById("popup");
    const titleEl = document.getElementById("popupTitle");
    const descEl = document.getElementById("popupDescription");
    const fieldsEl = document.getElementById("popupFields");
    const form = document.getElementById("popupForm");
    const submitBtn = document.getElementById("popupSubmit");

    let currentConfig = null;

    // ===== Utilities =============================================

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }

    // ===== Field rendering ========================================

    function renderField(field) {
        const requiredMark = field.required ? ' <span class="required-mark">*</span>' : "";
        let control = "";

        switch (field.type) {

            case "text":
                control = `<input type="text" id="field-${field.id}"
                                placeholder="${escapeHtml(field.placeholder || "")}">`;
                break;

            case "number":
                control = `<input type="number" id="field-${field.id}"
                                min="${field.min ?? 0}" step="${field.step ?? 1}"
                                placeholder="${escapeHtml(field.placeholder || "")}"
                                value="${field.default ?? ""}">`;
                break;

            case "tel":
                control = `<input type="tel" id="field-${field.id}"
                                placeholder="${escapeHtml(field.placeholder || "")}"
                                maxlength="${field.maxlength ?? 15}">`;
                break;

            case "email":
                control = `<input type="email" id="field-${field.id}"
                                placeholder="${escapeHtml(field.placeholder || "")}">`;
                break;

            case "date":
                control = `<input type="date" id="field-${field.id}"
                                value="${escapeHtml(field.default || "")}"
                                ${field.max ? `max="${escapeHtml(field.max)}"` : ""}>`;
                break;

            case "textarea":
                control = `<textarea id="field-${field.id}" rows="${field.rows ?? 3}"
                                placeholder="${escapeHtml(field.placeholder || "")}"></textarea>`;
                break;

            case "select": {
                const options = (field.optionsFn ? field.optionsFn() : [])
                    .map((o) => `<option value="${escapeHtml(o)}">${escapeHtml(o)}</option>`)
                    .join("");
                control = `<select id="field-${field.id}">
                                <option value="">${escapeHtml(field.placeholder || "Select")}</option>
                                ${options}
                            </select>`;
                break;
            }

            case "multiselect": {
                const options = field.optionsFn ? field.optionsFn() : [];
                const items = options
                    .map(
                        (o) => `<label class="ms-option">
                                    <input type="checkbox" value="${escapeHtml(o)}">
                                    <span>${escapeHtml(o)}</span>
                                </label>`
                    )
                    .join("");
                control = `<div class="multiselect" data-field-id="${field.id}">
                                <button type="button" class="ms-trigger">
                                    <span class="ms-trigger-text">${escapeHtml(field.placeholder || "Select")}</span>
                                    <span class="ms-caret">&#9662;</span>
                                </button>
                                <div class="ms-panel" hidden>${items}</div>
                                <input type="hidden" id="field-${field.id}">
                                <div class="ms-chips"></div>
                            </div>`;
                break;
            }

            case "confirm":
                control = `<label class="confirm-check">
                                <input type="checkbox" id="field-${field.id}">
                                <span>${escapeHtml(field.confirmLabel || "I understand this action cannot be undone.")}</span>
                            </label>`;
                break;
        }

        const labelHtml = field.label
            ? `<label for="field-${field.id}">${escapeHtml(field.label)}${requiredMark}</label>`
            : "";

        return `<div class="form-group ${field.type === "confirm" ? "form-group-confirm" : ""}" data-field="${field.id}">
                    ${labelHtml}
                    ${control}
                    <span class="field-error" id="error-${field.id}"></span>
                </div>`;
    }

    // ===== Field layout (optional 2-up rows) =======================
    //
    // Fields can opt into sitting side-by-side by sharing the same
    // `row` value, e.g. two fields with `row: "name-mobile"` render
    // together in one row. Fields without a `row` stack normally.

    function renderFieldsHtml(fields) {
        const html = [];
        let i = 0;
        while (i < fields.length) {
            const f = fields[i];
            if (f.row) {
                const group = [f];
                let j = i + 1;
                while (j < fields.length && fields[j].row === f.row) {
                    group.push(fields[j]);
                    j++;
                }
                html.push(`<div class="form-row">${group.map(renderField).join("")}</div>`);
                i = j;
            } else {
                html.push(renderField(f));
                i++;
            }
        }
        return html.join("");
    }

    // ===== Multiselect wiring ======================================

    function initMultiselects() {
        fieldsEl.querySelectorAll(".multiselect").forEach((ms) => {
            const trigger = ms.querySelector(".ms-trigger");
            const triggerText = ms.querySelector(".ms-trigger-text");
            const panel = ms.querySelector(".ms-panel");
            const hiddenInput = ms.querySelector('input[type="hidden"]');
            const chips = ms.querySelector(".ms-chips");
            const placeholder = triggerText.textContent;

            function sync() {
                const checked = Array.from(ms.querySelectorAll('input[type="checkbox"]:checked'))
                    .map((cb) => cb.value);

                hiddenInput.value = checked.join(",");
                triggerText.textContent = checked.length
                    ? `${checked.length} selected`
                    : placeholder;

                chips.innerHTML = checked
                    .map(
                        (v) => `<span class="chip">${escapeHtml(v)}
                                    <button type="button" class="chip-remove" data-value="${escapeHtml(v)}" aria-label="Remove ${escapeHtml(v)}">&times;</button>
                                </span>`
                    )
                    .join("");
            }

            trigger.addEventListener("click", (e) => {
                e.stopPropagation();
                fieldsEl.querySelectorAll(".ms-panel").forEach((p) => {
                    if (p !== panel) p.hidden = true;
                });
                panel.hidden = !panel.hidden;
            });

            panel.addEventListener("change", sync);

            chips.addEventListener("click", (e) => {
                const btn = e.target.closest(".chip-remove");
                if (!btn) return;
                const cb = panel.querySelector(`input[value="${CSS.escape(btn.dataset.value)}"]`);
                if (cb) cb.checked = false;
                sync();
            });

            sync();
        });
    }

    document.addEventListener("click", (e) => {
        if (!e.target.closest(".multiselect")) {
            fieldsEl.querySelectorAll(".ms-panel").forEach((p) => (p.hidden = true));
        }
    });

    // ===== Values + validation ======================================

    function collectValues() {
        const values = {};
        currentConfig.fields.forEach((field) => {
            const el = document.getElementById(`field-${field.id}`);
            if (field.type === "multiselect") {
                values[field.id] = el.value ? el.value.split(",") : [];
            } else if (field.type === "confirm") {
                values[field.id] = el.checked;
            } else {
                values[field.id] = el.value;
            }
        });
        return values;
    }

    function clearErrors() {
        fieldsEl.querySelectorAll(".form-group").forEach((g) => g.classList.remove("has-error"));
        fieldsEl.querySelectorAll(".field-error").forEach((e) => (e.textContent = ""));
    }

    function showFieldError(fieldId, message) {
        const group = fieldsEl.querySelector(`[data-field="${fieldId}"]`);
        const errorEl = document.getElementById(`error-${fieldId}`);
        if (group) group.classList.add("has-error");
        if (errorEl) errorEl.textContent = message;
    }

    function validate(values) {
        let errors = {};

        currentConfig.fields.forEach((field) => {
            if (!field.required) return;

            const v = values[field.id];
            const empty =
                field.type === "multiselect" ? !v || v.length === 0
                : field.type === "confirm" ? !v
                : v === undefined || v === null || String(v).trim() === "";

            if (empty) {
                errors[field.id] = field.type === "confirm"
                    ? "Please confirm to continue."
                    : `${field.label || "This field"} is required.`;
                return;
            }

            if (field.type === "number" && Number(v) < (field.min ?? 0)) {
                errors[field.id] = `Enter a value of at least ${field.min ?? 0}.`;
            }

            if (field.type === "tel" && !/^\d{7,15}$/.test(String(v).trim())) {
                errors[field.id] = "Enter a valid mobile number (digits only).";
            }
        });

        if (Object.keys(errors).length === 0 && typeof currentConfig.validate === "function") {
            const customErrors = currentConfig.validate(values);
            if (customErrors) errors = { ...errors, ...customErrors };
        }

        return errors;
    }

    // ===== Toast ====================================================

    function showToast(message, type) {
        const toast = document.createElement("div");
        toast.className = `toast toast-${type || "success"}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        requestAnimationFrame(() => toast.classList.add("show"));

        setTimeout(() => {
            toast.classList.remove("show");
            setTimeout(() => toast.remove(), 300);
        }, 3200);
    }

    // ===== Open / close ==============================================

    function open(config) {
        currentConfig = config;

        titleEl.textContent = config.title || "Inventory";

        if (config.description) {
            descEl.textContent = config.description;
            descEl.hidden = false;
        } else {
            descEl.hidden = true;
        }

        fieldsEl.innerHTML = renderFieldsHtml(config.fields);
        submitBtn.textContent = config.submitLabel || "Save";
        submitBtn.classList.toggle("save-danger", !!config.destructive);

        clearErrors();
        initMultiselects();

        overlay.style.display = "block";
        popup.style.display = "block";
        popup.setAttribute("aria-hidden", "false");

        const firstField = fieldsEl.querySelector("input, select");
        if (firstField) firstField.focus();

        form.onsubmit = function (e) {
            e.preventDefault();
            clearErrors();

            const values = collectValues();
            const errors = validate(values);

            if (Object.keys(errors).length) {
                Object.entries(errors).forEach(([id, msg]) => showFieldError(id, msg));
                return;
            }

            config.onSubmit(values, { close, showToast });
        };
    }

    function close() {
        overlay.style.display = "none";
        popup.style.display = "none";
        popup.setAttribute("aria-hidden", "true");
        currentConfig = null;
    }

    overlay.addEventListener("click", close);
    document.querySelectorAll("[data-modal-close]").forEach((btn) => btn.addEventListener("click", close));

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && popup.style.display === "block") close();
    });

    return { open, close };

}());
