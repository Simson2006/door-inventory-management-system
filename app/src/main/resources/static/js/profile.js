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
        const profileApi = "/api/profile/1";

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