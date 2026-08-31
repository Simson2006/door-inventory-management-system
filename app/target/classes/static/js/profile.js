// ========================================================
// GLOBAL USER ID
// ========================================================

const USER_ID = 1;


// ========================================================
// PAGE INITIALIZATION
// ========================================================

document.addEventListener("DOMContentLoaded", loadProfile);
document.addEventListener("DOMContentLoaded", initProfileActions);
document.addEventListener("DOMContentLoaded", initApprovalsAndUsers);


// ========================================================
// COMMON
// ========================================================

function displayValue(value) {
    return value === null || value === undefined || value === ""
        ? "N/A"
        : value;
}


// ========================================================
// LOAD PROFILE
// ========================================================

async function loadProfile() {

    try {

        const profileApi = `/profile/${USER_ID}`;

        console.log("REQUESTING:", profileApi);

        const response = await fetch(profileApi);

        if (!response.ok) {
            throw new Error("Failed to fetch profile");
        }

        const profile = await response.json();

        console.log("Profile data:", profile);


        // Card 1

        document.querySelector(".name").textContent =
            profile.userName;

        document.querySelector(".role-name").textContent =
            profile.userRole;


        // All .value elements

        const values =
            document.querySelectorAll(".value");


        // Card 2

        values[0].textContent =
            profile.userName;

        values[1].textContent =
            profile.email;

        values[2].textContent =
            profile.mobileNumber;

        values[3].textContent =
            profile.dateJoined;


        // Card 3

        values[4].textContent =
            profile.lastLogin
                ? profile.lastLogin
                    .replace("T", " ")
                    .substring(0, 19)
                : "N/A";

        values[5].textContent =
            profile.passwordLastChanged
                ? profile.passwordLastChanged
                : "N/A";

        values[6].textContent =
            profile.accountStatus
                ? profile.accountStatus
                : "N/A";


    } catch (error) {

        console.error(
            "Error loading profile:",
            error
        );

    }
}


// ========================================================
// PROFILE ACTIONS
// ========================================================

const PROFILE_ACTIONS = {

    // ----------------------------------------------------
    // CHANGE USERNAME
    // ----------------------------------------------------

    btnChangeUsername: {

        title: "Change Username",

        description:
            "Update the username shown on your profile.",

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

            const current =
                document
                    .querySelector(".name")
                    ?.textContent
                    .trim();

            if (
                values.newUsername.trim() === current
            ) {

                return {
                    newUsername:
                        "This is already your current username."
                };
            }

            return null;
        },


        async onSubmit(values, { close, showToast }) {

            const newUsername =
                values.newUsername.trim();


            try {

                const response = await fetch(
                    `/profile/${USER_ID}/updateusername`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "text/plain"
                        },

                        body: newUsername
                    }
                );


                if (!response.ok) {

                    throw new Error(
                        "Failed to change username"
                    );
                }


                // Update username on page

                document.querySelector(".name")
                    .textContent = newUsername;


                const values_ =
                    document.querySelectorAll(".value");


                if (values_[0]) {

                    values_[0].textContent =
                        newUsername;
                }


                showToast(
                    `Username changed to "${newUsername}".`,
                    "success"
                );

                close();


            } catch (error) {

                console.error(
                    "Error changing username:",
                    error
                );

                showToast(
                    "Failed to change username.",
                    "danger"
                );
            }
        }
    },


    // ----------------------------------------------------
    // CHANGE PASSWORD
    // ----------------------------------------------------

    btnChangePassword: {

        title: "Change Password",

        description:
            "Enter your current password and choose a new one.",

        submitLabel: "Change Password",

        fields: [

            {
                id: "currentPassword",
                label: "Current Password",
                type: "text",
                required: true,
                placeholder: "Enter current password"
            },

            {
                id: "newPassword",
                label: "New Password",
                type: "text",
                required: true,
                placeholder: "Enter new password",
                row: "r1"
            },

            {
                id: "confirmPassword",
                label: "Confirm New Password",
                type: "text",
                required: true,
                placeholder: "Re-enter new password",
                row: "r1"
            }

        ],


        validate(values) {

            const errors = {};


            if (values.newPassword.length < 6) {

                errors.newPassword =
                    "Password must be at least 6 characters.";
            }


            if (
                values.newPassword !==
                values.confirmPassword
            ) {

                errors.confirmPassword =
                    "Passwords do not match.";
            }


            if (
                values.newPassword &&
                values.currentPassword ===
                values.newPassword
            ) {

                errors.newPassword =
                    "New password must be different from the current password.";
            }


            return Object.keys(errors).length
                ? errors
                : null;
        },


        onSubmit(values, { close, showToast }) {

            const values_ =
                document.querySelectorAll(".value");


            const today =
                new Date()
                    .toISOString()
                    .slice(0, 10);


            if (values_[5]) {

                values_[5].textContent =
                    today;
            }


            showToast(
                "Password changed successfully.",
                "success"
            );

            close();
        }
    },


    // ----------------------------------------------------
    // LOGOUT
    // ----------------------------------------------------

    btnLogout: {

        title: "Logout",

        description:
            "Are you sure you want to log out of your account?",

        submitLabel: "Logout",

        destructive: true,

        fields: [

            {
                id: "confirm",
                type: "confirm",
                required: true,
                confirmLabel: "Yes, log me out."
            }

        ],


        onSubmit(values, { close, showToast }) {

            showToast(
                "Logged out successfully.",
                "danger"
            );


            close();


            setTimeout(() => {

                window.location.href = "/";

            }, 600);
        }
    }

};


// ========================================================
// INITIALIZE PROFILE ACTIONS
// ========================================================

function initProfileActions() {

    Object.keys(PROFILE_ACTIONS)
        .forEach((btnId) => {

            const btn =
                document.getElementById(btnId);

            if (!btn) return;


            btn.addEventListener(
                "click",
                () =>
                    Modal.open(
                        PROFILE_ACTIONS[btnId]
                    )
            );
        });
}


// ========================================================
// APPROVAL REQUESTS / APPROVED USERS
// ========================================================

// Backend page size

const PAGE_SIZE = 5;


// Data received from backend

let approvalRequests = [];

let approvedUsers = [];


// Current selected tab

let activeSection = "requests";


// Current UI page

const currentPage = {

    requests: 1,

    users: 1
};


// Total pages received from backend

const totalPages = {

    requests: 1,

    users: 1
};


// ========================================================
// LOAD APPROVAL REQUESTS
// ========================================================

async function loadApprovalRequests() {

    try {

        // Spring Boot page is 0-based
        // UI page is 1-based

        const backendPage =
            currentPage.requests - 1;


        const api =
            `/profile/${USER_ID}/approvalrequestuser` +
            `?page=${backendPage}&size=${PAGE_SIZE}`;


        console.log(
            "REQUESTING APPROVAL REQUESTS:",
            api
        );


        const response =
            await fetch(api);


        if (!response.ok) {

            throw new Error(
                "Failed to fetch approval requests"
            );
        }


        const data =
            await response.json();


        // Data from Spring Page

        approvalRequests =
            data.content;


        // Total pages from backend

        totalPages.requests =
            data.totalPages;


        console.log(
            "Approval Requests:",
            approvalRequests
        );


        console.log(
            "Total Request Pages:",
            totalPages.requests
        );


    } catch (error) {

        console.error(
            "Error loading approval requests:",
            error
        );


        approvalRequests = [];

        totalPages.requests = 1;
    }
}


// ========================================================
// LOAD APPROVED USERS
// ========================================================

async function loadApprovedUsers() {

    try {

        // Spring Boot page is 0-based

        const backendPage =
            currentPage.users - 1;


        const api =
            `/profile/${USER_ID}/approveduser` +
            `?page=${backendPage}&size=${PAGE_SIZE}`;


        console.log(
            "REQUESTING APPROVED USERS:",
            api
        );


        const response =
            await fetch(api);


        if (!response.ok) {

            throw new Error(
                "Failed to fetch approved users"
            );
        }


        const data =
            await response.json();


        // Data from Spring Page

        approvedUsers =
            data.content;


        // Total pages from backend

        totalPages.users =
            data.totalPages;


        console.log(
            "Approved Users:",
            approvedUsers
        );


        console.log(
            "Total User Pages:",
            totalPages.users
        );


    } catch (error) {

        console.error(
            "Error loading approved users:",
            error
        );


        approvedUsers = [];

        totalPages.users = 1;
    }
}


// ========================================================
// ESCAPE HTML
// ========================================================

function escapeHtmlAdmin(str) {

    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}


// ========================================================
// RENDER APPROVAL REQUEST TABLE
// ========================================================

function renderRequestsTable() {

    const body =
        document.getElementById(
            "requestsTableBody"
        );


    const emptyMsg =
        document.getElementById(
            "requestsEmpty"
        );


    if (!body) return;


    body.innerHTML =
        approvalRequests
            .map((r) => `

        <tr data-id="${r.id}">

            <td>
                ${r.id}
            </td>

            <td>
                ${escapeHtmlAdmin(r.userName)}
            </td>

            <td>
                ${escapeHtmlAdmin(r.email)}
            </td>

            <td>
                ${displayValue(r.dateJoined)}
            </td>

            <td class="action-btns">

                <button
                    class="btn-approve"
                    data-id="${r.id}"
                    title="Approve">
                    ✓
                </button>

                <button
                    class="btn-reject"
                    data-id="${r.id}"
                    title="Reject">
                    ✗
                </button>

            </td>

        </tr>

    `)
    .join("");


    if (emptyMsg) {

        emptyMsg.hidden =
            approvalRequests.length !== 0;
    }


    const countEl =
        document.getElementById(
            "requestsCount"
        );


    if (countEl) {

        countEl.textContent =
            approvalRequests.length;
    }
}


// ========================================================
// RENDER APPROVED USERS TABLE
// ========================================================

function renderUsersTable() {

    const body =
        document.getElementById(
            "usersTableBody"
        );


    const emptyMsg =
        document.getElementById(
            "usersEmpty"
        );


    if (!body) return;


    body.innerHTML =
        approvedUsers
            .map((u) => {

                const isActive =
                    u.accountStatus === "ACTIVE";


                const actionLabel =
                    isActive
                        ? "Suspend"
                        : "Activate";


                const actionClass =
                    isActive
                        ? "suspend"
                        : "activate";


                const lastLogin =
                    u.lastLogin
                        ? u.lastLogin
                            .replace("T", " ")
                            .substring(0, 19)
                        : "N/A";


                return `

                <tr data-id="${u.id}">

                    <td>
                        ${u.id}
                    </td>

                    <td>
                        ${escapeHtmlAdmin(u.userName)}
                    </td>

                    <td>
                        ${escapeHtmlAdmin(u.email)}
                    </td>

                    <td>
                        ${escapeHtmlAdmin(
                            u.mobileNumber
                        )}
                    </td>

                    <td>
                        ${escapeHtmlAdmin(
                            lastLogin
                        )}
                    </td>

                    <td>

                        <span
                            class="status-pill status-${u.accountStatus}">
                            ${u.accountStatus}
                        </span>

                    </td>

                    <td class="action-btns">

                        <button
                            class="btn-status ${actionClass}"
                            data-id="${u.id}">
                            ${actionLabel}
                        </button>

                    </td>

                </tr>

                `;

            })
            .join("");


    if (emptyMsg) {

        emptyMsg.hidden =
            approvedUsers.length !== 0;
    }


    const countEl =
        document.getElementById(
            "usersCount"
        );


    if (countEl) {

        countEl.textContent =
            approvedUsers.length;
    }
}


// ========================================================
// RENDER PAGINATION
// ========================================================

function renderPagination() {

    const pager =
        document.getElementById(
            "pagination"
        );


    if (!pager) return;


    const pages =
        totalPages[activeSection];


    const page =
        currentPage[activeSection];


    if (pages <= 1) {

        pager.innerHTML = "";

        return;
    }


    let html = `

        <button
            class="page-btn nav"
            data-page="${page - 1}"
            ${page === 1 ? "disabled" : ""}>
            &lsaquo;
        </button>

    `;


    for (
        let p = 1;
        p <= pages;
        p++
    ) {

        html += `

            <button
                class="page-btn ${
                    p === page
                        ? "active"
                        : ""
                }"
                data-page="${p}">
                ${p}
            </button>

        `;
    }


    html += `

        <button
            class="page-btn nav"
            data-page="${page + 1}"
            ${page === pages ? "disabled" : ""}>
            &rsaquo;
        </button>

    `;


    pager.innerHTML =
        html;
}


// ========================================================
// RENDER ACTIVE SECTION
// ========================================================

function renderActiveSection() {

    if (activeSection === "requests") {

        renderRequestsTable();

    } else {

        renderUsersTable();
    }


    renderPagination();
}


// ========================================================
// SWITCH SECTION
// ========================================================

async function switchSection(section) {

    if (section === activeSection) {
        return;
    }


    activeSection =
        section;


    const tabRequests =
        document.getElementById(
            "tabRequests"
        );


    const tabUsers =
        document.getElementById(
            "tabUsers"
        );


    const requestsSection =
        document.getElementById(
            "requestsSection"
        );


    const usersSection =
        document.getElementById(
            "usersSection"
        );


    tabRequests.classList.toggle(
        "active",
        section === "requests"
    );


    tabRequests.setAttribute(
        "aria-selected",
        section === "requests"
    );


    tabUsers.classList.toggle(
        "active",
        section === "users"
    );


    tabUsers.setAttribute(
        "aria-selected",
        section === "users"
    );


    requestsSection.hidden =
        section !== "requests";


    usersSection.hidden =
        section !== "users";


    // Load selected table

    if (section === "requests") {

        await loadApprovalRequests();

    } else {

        await loadApprovedUsers();
    }


    renderActiveSection();
}


// ========================================================
// APPROVE REQUEST
// ========================================================

async function handleApprove(id, btn) {

    const row =
        btn.closest("tr");

    btn.disabled = true;

    const rejectBtn =
        row
            ? row.querySelector(
                ".btn-reject"
            )
            : null;

    if (rejectBtn) {
        rejectBtn.disabled = true;
    }

    try {

        const response =
            await fetch(
                `/profile/${USER_ID}/updateuserrequest/${id}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "text/plain"
                    },
                    body: "ACCEPT"
                }
            );

        if (!response.ok) {

            const message =
                await response.text();

            throw new Error(message);
        }

        // Reload data from backend
        await loadApprovalRequests();

        renderActiveSection();

    } catch (error) {

        console.error(
            "Error approving request:",
            error
        );

        btn.disabled = false;

        if (rejectBtn) {
            rejectBtn.disabled = false;
        }

        showToast(
            error.message,
            "danger"
        );
    }
}

// ========================================================
// REJECT REQUEST
// ========================================================

// ========================================================
// REJECT REQUEST
// ========================================================

async function handleReject(id) {

    try {

        const response = await fetch(
            `/profile/${USER_ID}/updateuserrequest/${id}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "text/plain"
                },
                body: "REJECT"
            }
        );

        if (!response.ok) {

            const message = await response.text();

            throw new Error(message);
        }

        // Reload data from backend
        await loadApprovalRequests();

        renderActiveSection();

    } catch (error) {

        console.error(
            "Error rejecting request:",
            error
        );

        showToast(
            error.message,
            "danger"
        );
    }
}
// ========================================================
// STATUS TOGGLE
// ========================================================

async function handleStatusToggle(targetId) {

    const user = approvedUsers.find(
        (u) => String(u.id) === String(targetId)
    );

    if (!user) return;

    const newStatus =
        user.accountStatus === "ACTIVE"
            ? "SUSPENDED"
            : "ACTIVE";

    try {

        const response = await fetch(
            `/profile/${USER_ID}/updateaccountstatus/${targetId}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "text/plain"
                },
                body: newStatus
            }
        );

        if (!response.ok) {
            throw new Error("Failed to update account status");
        }

        user.accountStatus = newStatus;

        renderUsersTable();

    } catch (error) {

         showToast(error.message, "danger");
    }
}

// ========================================================
// INITIALIZE APPROVALS / USERS
// ========================================================

async function initApprovalsAndUsers() {

    const tabRequests =
        document.getElementById(
            "tabRequests"
        );


    const tabUsers =
        document.getElementById(
            "tabUsers"
        );


    const requestsBody =
        document.getElementById(
            "requestsTableBody"
        );


    const usersBody =
        document.getElementById(
            "usersTableBody"
        );


    const pager =
        document.getElementById(
            "pagination"
        );


    if (
        !tabRequests ||
        !tabUsers ||
        !requestsBody ||
        !usersBody
    ) {

        return;
    }


    // ----------------------------------------------------
    // TAB EVENTS
    // ----------------------------------------------------

    tabRequests.addEventListener(
        "click",
        () =>
            switchSection(
                "requests"
            )
    );


    tabUsers.addEventListener(
        "click",
        () =>
            switchSection(
                "users"
            )
    );


    // ----------------------------------------------------
    // APPROVE / REJECT EVENTS
    // ----------------------------------------------------

    requestsBody.addEventListener(
        "click",
        (event) => {

            const approveBtn =
                event.target.closest(
                    ".btn-approve"
                );


            const rejectBtn =
                event.target.closest(
                    ".btn-reject"
                );


            if (approveBtn) {

                handleApprove(
                    approveBtn.dataset.id,
                    approveBtn
                );

            } else if (rejectBtn) {

                handleReject(
                    rejectBtn.dataset.id
                );
            }
        }
    );


    // ----------------------------------------------------
    // STATUS EVENTS
    // ----------------------------------------------------

    usersBody.addEventListener(
        "click",
        (event) => {

            const statusBtn =
                event.target.closest(
                    ".btn-status"
                );


            if (statusBtn) {

                handleStatusToggle(
                    statusBtn.dataset.id
                );
            }
        }
    );


    // ----------------------------------------------------
    // PAGINATION EVENTS
    // ----------------------------------------------------

    if (pager) {

        pager.addEventListener(
            "click",
            async (event) => {

                const btn =
                    event.target.closest(
                        ".page-btn"
                    );


                if (
                    !btn ||
                    btn.disabled
                ) {

                    return;
                }


                const page =
                    parseInt(
                        btn.dataset.page,
                        10
                    );


                if (
                    Number.isNaN(page)
                ) {

                    return;
                }


                currentPage[
                    activeSection
                ] = page;


                // Get selected page
                // from backend

                if (
                    activeSection ===
                    "requests"
                ) {

                    await loadApprovalRequests();

                } else {

                    await loadApprovedUsers();
                }


                renderActiveSection();
            }
        );
    }


    // ----------------------------------------------------
    // INITIAL API CALL
    // ----------------------------------------------------

    await loadApprovalRequests();


    renderActiveSection();
}