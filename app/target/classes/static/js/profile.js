document.addEventListener("DOMContentLoaded", loadProfile);
document.addEventListener("DOMContentLoaded", initProfileActions);

function displayValue(value) {
    return value === null || value === undefined || value === ""
        ? "N/A"
        : value;
}

async function loadProfile() {

    try {

        // API URL
        const profileApi = "/api/profile/5";
        console.log("REQUESTING:","/api/profile/5");
        // Call backend
        const response = await fetch(profileApi);

        if (!response.ok) {
            throw new Error("Failed to fetch profile");
        }

        // Convert response to JavaScript object
        const profile = await response.json();

        console.log("Profile data:", profile);

        // Card 1
        document.querySelector(".name").textContent = profile.userName;
        document.querySelector(".role-name").textContent = profile.userRole;


        // All .value elements
        const values = document.querySelectorAll(".value");

        // Card 2
        values[0].textContent = profile.userName;
        values[1].textContent = profile.email;
        values[2].textContent = profile.mobileNumber;
        values[3].textContent = profile.dateJoined;

        // Card 3
       values[4].textContent = profile.lastLogin
            ? profile.lastLogin.replace("T", " ").substring(0, 19)
            : "N/A";

        values[5].textContent = profile.passwordLastChanged
            ? profile.passwordLastChanged
            : "N/A";

        values[6].textContent = profile.accountStatus
            ? profile.accountStatus
            : "N/A";


    } catch (error) {

        console.error("Error loading profile:", error);

    }
}

/**
 * Profile actions (Change Username / Change Password / Logout)
 * --------------------------------------------------------
 * Reuses the same Modal popup as the rest of the app (see
 * modal.js). Each button opens the popup pre-filled with the
 * right fields; the current username card is updated on
 * successful submit so the change is reflected immediately.
 * --------------------------------------------------------
 */

const PROFILE_ACTIONS = {

    btnChangeUsername: {
        title: "Change Username",
        description: "Update the username shown on your profile.",
        submitLabel: "Save Changes",
        fields: [
            {
                id: "newUsername",
                label: "New Username",
                type: "text",
                required: true,
                placeholder: "Enter new username"
            }
        ],
        validate(values) {
            const current = document.querySelector(".name")?.textContent.trim();
            if (values.newUsername.trim() === current) {
                return { newUsername: "This is already your current username." };
            }
            return null;
        },
        onSubmit(values, { close, showToast }) {
            const newUsername = values.newUsername.trim();

            // Reflect the change on the page
            document.querySelector(".name").textContent = newUsername;
            const values_ = document.querySelectorAll(".value");
            if (values_[0]) values_[0].textContent = newUsername;

            showToast(`Username changed to "${newUsername}".`, "success");
            close();
        }
    },

    btnChangePassword: {
        title: "Change Password",
        description: "Enter your current password and choose a new one.",
        submitLabel: "Change Password",
        fields: [
            { id: "currentPassword", label: "Current Password", type: "text", required: true, placeholder: "Enter current password" },
            { id: "newPassword", label: "New Password", type: "text", required: true, placeholder: "Enter new password", row: "r1" },
            { id: "confirmPassword", label: "Confirm New Password", type: "text", required: true, placeholder: "Re-enter new password", row: "r1" }
        ],
        validate(values) {
            const errors = {};
            if (values.newPassword.length < 6) {
                errors.newPassword = "Password must be at least 6 characters.";
            }
            if (values.newPassword !== values.confirmPassword) {
                errors.confirmPassword = "Passwords do not match.";
            }
            if (values.newPassword && values.currentPassword === values.newPassword) {
                errors.newPassword = "New password must be different from the current password.";
            }
            return Object.keys(errors).length ? errors : null;
        },
        onSubmit(values, { close, showToast }) {
            // Reflect the change on the page
            const values_ = document.querySelectorAll(".value");
            const today = new Date().toISOString().slice(0, 10);
            if (values_[5]) values_[5].textContent = today;

            showToast("Password changed successfully.", "success");
            close();
        }
    },

    btnLogout: {
        title: "Logout",
        description: "Are you sure you want to log out of your account?",
        submitLabel: "Logout",
        destructive: true,
        fields: [
            { id: "confirm", type: "confirm", required: true, confirmLabel: "Yes, log me out." }
        ],
        onSubmit(values, { close, showToast }) {
            showToast("Logged out successfully.", "danger");
            close();
            setTimeout(() => {
                window.location.href = "/";
            }, 600);
        }
    }

};

function initProfileActions() {
    Object.keys(PROFILE_ACTIONS).forEach((btnId) => {
        const btn = document.getElementById(btnId);
        if (!btn) return;
        btn.addEventListener("click", () => Modal.open(PROFILE_ACTIONS[btnId]));
    });
}

/**
 * Approval Requests / Approved Users
 * --------------------------------------------------------
 * Two tabs sharing one card: "Approval Requests" (pending
 * signups) and "Approved Users" (existing accounts). Only
 * one table is visible at a time, and both reuse the same
 * pagination bar (10 rows per page).
 *
 * Data is mock/dummy for now (same convention already used
 * for the Approval Requests table), except for ✓ Approve,
 * which calls a backend endpoint via fetch(). No approval
 * endpoint currently exists in the Spring controllers, so
 * this calls POST /api/approvals/{id}/approve, following the
 * existing /api/profile/{id} naming convention. Point this at
 * the real endpoint (or add one) once it's available.
 * --------------------------------------------------------
 */

document.addEventListener("DOMContentLoaded", initApprovalsAndUsers);

const ROWS_PER_PAGE = 10;

let approvalRequests = [
    { id: 1, username: "Simson", email: "simsonantorai2006@gmail.com", requestedOn: "02 Jul 2026 10:15 AM" },
    { id: 2, username: "Arun", email: "arun@gmail.com", requestedOn: "03 Jul 2026 09:30 AM" },
    { id: 3, username: "Karthik", email: "karthik@gmail.com", requestedOn: "04 Jul 2026 02:45 PM" },
    { id: 4, username: "Priya", email: "priya@gmail.com", requestedOn: "05 Jul 2026 11:20 AM" },
    { id: 5, username: "Vignesh", email: "vignesh@gmail.com", requestedOn: "06 Jul 2026 04:10 PM" },
    { id: 6, username: "Rahul", email: "rahul@gmail.com", requestedOn: "07 Jul 2026 10:05 AM" },
    { id: 7, username: "Naveen", email: "naveen@gmail.com", requestedOn: "08 Jul 2026 01:35 PM" },
    { id: 8, username: "Harish", email: "harish@gmail.com", requestedOn: "09 Jul 2026 03:50 PM" },
    { id: 9, username: "Suresh", email: "suresh@gmail.com", requestedOn: "10 Jul 2026 09:40 AM" },
    { id: 10, username: "Deepak", email: "deepak@gmail.com", requestedOn: "11 Jul 2026 12:25 PM" },
    { id: 11, username: "Anitha", email: "anitha@gmail.com", requestedOn: "12 Jul 2026 09:15 AM" },
    { id: 12, username: "Kavin", email: "kavin@gmail.com", requestedOn: "13 Jul 2026 03:05 PM" },
    { id: 13, username: "Divya", email: "divya@gmail.com", requestedOn: "14 Jul 2026 11:50 AM" }
];

let approvedUsers = [
    { id: 1, username: "Manoj", email: "manoj@gmail.com", mobile: "9840012345", lastLogin: "12 Aug 2026 08:20 AM", status: "ACTIVE" },
    { id: 2, username: "Sowmya", email: "sowmya@gmail.com", mobile: "9840012346", lastLogin: "11 Aug 2026 06:45 PM", status: "ACTIVE" },
    { id: 3, username: "Baskar", email: "baskar@gmail.com", mobile: "9840012347", lastLogin: "10 Aug 2026 01:10 PM", status: "SUSPENDED" },
    { id: 4, username: "Meena", email: "meena@gmail.com", mobile: "9840012348", lastLogin: "09 Aug 2026 09:55 AM", status: "ACTIVE" },
    { id: 5, username: "Gokul", email: "gokul@gmail.com", mobile: "9840012349", lastLogin: "08 Aug 2026 05:30 PM", status: "ACTIVE" },
    { id: 6, username: "Preethi", email: "preethi@gmail.com", mobile: "9840012350", lastLogin: "07 Aug 2026 11:15 AM", status: "SUSPENDED" },
    { id: 7, username: "Ashwin", email: "ashwin@gmail.com", mobile: "9840012351", lastLogin: "06 Aug 2026 07:40 PM", status: "ACTIVE" },
    { id: 8, username: "Lakshmi", email: "lakshmi@gmail.com", mobile: "9840012352", lastLogin: "05 Aug 2026 02:25 PM", status: "ACTIVE" },
    { id: 9, username: "Vasanth", email: "vasanth@gmail.com", mobile: "9840012353", lastLogin: "04 Aug 2026 10:05 AM", status: "ACTIVE" },
    { id: 10, username: "Nithya", email: "nithya@gmail.com", mobile: "9840012354", lastLogin: "03 Aug 2026 04:50 PM", status: "SUSPENDED" },
    { id: 11, username: "Ramesh", email: "ramesh@gmail.com", mobile: "9840012355", lastLogin: "02 Aug 2026 08:35 AM", status: "ACTIVE" },
    { id: 12, username: "Deepa", email: "deepa@gmail.com", mobile: "9840012356", lastLogin: "01 Aug 2026 12:20 PM", status: "ACTIVE" },
    { id: 13, username: "Kishore", email: "kishore@gmail.com", mobile: "9840012357", lastLogin: "31 Jul 2026 06:00 PM", status: "ACTIVE" }
];

let activeSection = "requests";
const currentPage = { requests: 1, users: 1 };

function escapeHtmlAdmin(str) {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function pageSlice(list, page) {
    const start = (page - 1) * ROWS_PER_PAGE;
    return list.slice(start, start + ROWS_PER_PAGE);
}

function renderRequestsTable() {
    const body = document.getElementById("requestsTableBody");
    const emptyMsg = document.getElementById("requestsEmpty");
    if (!body) return;

    const items = pageSlice(approvalRequests, currentPage.requests);

    body.innerHTML = items.map((r) => `
        <tr data-id="${r.id}">
            <td>${r.id}</td>
            <td>${escapeHtmlAdmin(r.username)}</td>
            <td>${escapeHtmlAdmin(r.email)}</td>
            <td>${escapeHtmlAdmin(r.requestedOn)}</td>
            <td class="action-btns">
                <button class="btn-approve" data-id="${r.id}" title="Approve">✓</button>
                <button class="btn-reject" data-id="${r.id}" title="Reject">✗</button>
            </td>
        </tr>`).join("");

    if (emptyMsg) emptyMsg.hidden = approvalRequests.length !== 0;

    const countEl = document.getElementById("requestsCount");
    if (countEl) countEl.textContent = approvalRequests.length;
}

function renderUsersTable() {
    const body = document.getElementById("usersTableBody");
    const emptyMsg = document.getElementById("usersEmpty");
    if (!body) return;

    const items = pageSlice(approvedUsers, currentPage.users);

    body.innerHTML = items.map((u) => {
        const isActive = u.status === "ACTIVE";
        const actionLabel = isActive ? "Suspend" : "Activate";
        const actionClass = isActive ? "suspend" : "activate";

        return `
        <tr data-id="${u.id}">
            <td>${u.id}</td>
            <td>${escapeHtmlAdmin(u.username)}</td>
            <td>${escapeHtmlAdmin(u.email)}</td>
            <td>${escapeHtmlAdmin(u.mobile)}</td>
            <td>${escapeHtmlAdmin(u.lastLogin)}</td>
            <td><span class="status-pill status-${u.status}">${u.status}</span></td>
            <td class="action-btns">
                <button class="btn-status ${actionClass}" data-id="${u.id}">${actionLabel}</button>
            </td>
        </tr>`;
    }).join("");

    if (emptyMsg) emptyMsg.hidden = approvedUsers.length !== 0;

    const countEl = document.getElementById("usersCount");
    if (countEl) countEl.textContent = approvedUsers.length;
}

function renderPagination() {
    const pager = document.getElementById("pagination");
    if (!pager) return;

    const list = activeSection === "requests" ? approvalRequests : approvedUsers;
    const totalItems = list.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / ROWS_PER_PAGE));

    if (currentPage[activeSection] > totalPages) currentPage[activeSection] = totalPages;
    const page = currentPage[activeSection];

    if (totalItems <= ROWS_PER_PAGE) {
        pager.innerHTML = "";
        return;
    }

    let html = `<button class="page-btn nav" data-page="${page - 1}" ${page === 1 ? "disabled" : ""}>&lsaquo;</button>`;

    for (let p = 1; p <= totalPages; p++) {
        html += `<button class="page-btn ${p === page ? "active" : ""}" data-page="${p}">${p}</button>`;
    }

    html += `<button class="page-btn nav" data-page="${page + 1}" ${page === totalPages ? "disabled" : ""}>&rsaquo;</button>`;

    pager.innerHTML = html;
}

function renderActiveSection() {
    if (activeSection === "requests") {
        renderRequestsTable();
    } else {
        renderUsersTable();
    }
    renderPagination();
}

function switchSection(section) {
    if (section === activeSection) return;
    activeSection = section;

    const tabRequests = document.getElementById("tabRequests");
    const tabUsers = document.getElementById("tabUsers");
    const requestsSection = document.getElementById("requestsSection");
    const usersSection = document.getElementById("usersSection");

    tabRequests.classList.toggle("active", section === "requests");
    tabRequests.setAttribute("aria-selected", section === "requests");
    tabUsers.classList.toggle("active", section === "users");
    tabUsers.setAttribute("aria-selected", section === "users");

    requestsSection.hidden = section !== "requests";
    usersSection.hidden = section !== "users";

    renderActiveSection();
}

async function handleApprove(id, btn) {
    const row = btn.closest("tr");
    btn.disabled = true;
    const rejectBtn = row ? row.querySelector(".btn-reject") : null;
    if (rejectBtn) rejectBtn.disabled = true;

    try {
        // Existing backend API for approving a pending user request.
        const response = await fetch(`/api/approvals/${id}/approve`, {
            method: "POST"
        });

        if (!response.ok) {
            throw new Error(`Approval failed with status ${response.status}`);
        }

        approvalRequests = approvalRequests.filter((r) => String(r.id) !== String(id));

        const maxPage = Math.max(1, Math.ceil(approvalRequests.length / ROWS_PER_PAGE));
        if (currentPage.requests > maxPage) currentPage.requests = maxPage;

        renderActiveSection();

    } catch (error) {
        console.error("Error approving request:", error);
        btn.disabled = false;
        if (rejectBtn) rejectBtn.disabled = false;
        alert("Could not approve this request. Please try again.");
    }
}

function handleReject(id) {
    approvalRequests = approvalRequests.filter((r) => String(r.id) !== String(id));

    const maxPage = Math.max(1, Math.ceil(approvalRequests.length / ROWS_PER_PAGE));
    if (currentPage.requests > maxPage) currentPage.requests = maxPage;

    renderActiveSection();
}

function handleStatusToggle(id) {
    const user = approvedUsers.find((u) => String(u.id) === String(id));
    if (!user) return;
    user.status = user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    renderUsersTable();
}

function initApprovalsAndUsers() {
    const tabRequests = document.getElementById("tabRequests");
    const tabUsers = document.getElementById("tabUsers");
    const requestsBody = document.getElementById("requestsTableBody");
    const usersBody = document.getElementById("usersTableBody");
    const pager = document.getElementById("pagination");

    if (!tabRequests || !tabUsers || !requestsBody || !usersBody) return;

    tabRequests.addEventListener("click", () => switchSection("requests"));
    tabUsers.addEventListener("click", () => switchSection("users"));

    requestsBody.addEventListener("click", (event) => {
        const approveBtn = event.target.closest(".btn-approve");
        const rejectBtn = event.target.closest(".btn-reject");

        if (approveBtn) {
            handleApprove(approveBtn.dataset.id, approveBtn);
        } else if (rejectBtn) {
            handleReject(rejectBtn.dataset.id);
        }
    });

    usersBody.addEventListener("click", (event) => {
        const statusBtn = event.target.closest(".btn-status");
        if (statusBtn) handleStatusToggle(statusBtn.dataset.id);
    });

    if (pager) {
        pager.addEventListener("click", (event) => {
            const btn = event.target.closest(".page-btn");
            if (!btn || btn.disabled) return;

            const page = parseInt(btn.dataset.page, 10);
            if (Number.isNaN(page)) return;

            currentPage[activeSection] = page;
            renderActiveSection();
        });
    }

    renderActiveSection();
}