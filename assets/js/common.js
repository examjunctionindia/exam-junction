/* =========================================
   EXAM JUNCTION — SHARED WEBSITE SYSTEM
   ========================================= */

(function () {
    "use strict";

    const CONFIG = window.EXAM_JUNCTION_CONFIG || {};

    const EJ = {
        config: CONFIG,
        supabase: null,

        async init() {
            if (
                !CONFIG.SUPABASE_URL ||
                !CONFIG.SUPABASE_PUBLISHABLE_KEY
            ) {
                console.info(
                    "EXAM JUNCTION: Supabase configuration pending."
                );
                return false;
            }

            if (!window.supabase?.createClient) {
                console.error(
                    "EXAM JUNCTION: Supabase library is not loaded."
                );
                return false;
            }

            if (!this.supabase) {
                this.supabase = window.supabase.createClient(
                    CONFIG.SUPABASE_URL,
                    CONFIG.SUPABASE_PUBLISHABLE_KEY
                );
            }

            return true;
        },

        async getCurrentUser() {
            if (!(await this.init())) return null;

            const { data, error } =
                await this.supabase.auth.getUser();

            if (error) {
                console.error("Could not get current user.");
                return null;
            }

            return data.user;
        },

        async signOut() {
            if (!(await this.init())) {
                window.location.href = "login.html";
                return;
            }

            const { error } = await this.supabase.auth.signOut();

            if (error) {
                console.error("Sign out failed.");
                alert("Logout nahi ho saka. Dobara try karein.");
                return;
            }

            window.location.href = "login.html";
        },

        async getPublishedBatches() {
            if (!(await this.init())) return [];

            const { data, error } = await this.supabase
                .from("batches")
                .select("*")
                .limit(100);

            if (error) {
                console.error("Batches load nahi hue.");
                return [];
            }

            return data || [];
        },

        async getPublishedBooks() {
            if (!(await this.init())) return [];

            const { data, error } = await this.supabase
                .from("books")
                .select("*")
                .limit(100);

            if (error) {
                console.error("Books load nahi hui.");
                return [];
            }

            return data || [];
        },

        async getNotifications() {
            if (!(await this.init())) return [];

            const { data, error } = await this.supabase
                .from("notifications")
                .select("*")
                .limit(100);

            if (error) {
                console.error("Notifications load nahi hui.");
                return [];
            }

            return data || [];
        },

        escapeHTML(value) {
            return String(value ?? "").replace(
                /[&<>"']/g,
                character => ({
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    '"': "&quot;",
                    "'": "&#39;"
                })[character]
            );
        }
    };

    window.EXAM_JUNCTION = EJ;
})();
