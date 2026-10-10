/* =========================================
   EXAM JUNCTION — AUTHENTICATION HELPERS
   ========================================= */

(function () {
    "use strict";

    const Auth = {
        async client() {
            if (!window.EXAM_JUNCTION) {
                throw new Error("Website system load nahi hua.");
            }

            const ready = await window.EXAM_JUNCTION.init();

            if (!ready) {
                throw new Error("Supabase configuration abhi pending hai.");
            }

            return window.EXAM_JUNCTION.supabase;
        },

        async getUser() {
            const supabase = await this.client();
            const { data, error } = await supabase.auth.getUser();

            if (error) {
                throw error;
            }

            return data.user;
        },

        async requireLogin() {
            const user = await this.getUser();

            if (!user) {
                window.location.replace("login.html");
                return null;
            }

            return user;
        },

        async register(email, password) {
            const supabase = await this.client();

            return await supabase.auth.signUp({
                email: email.trim(),
                password: password
            });
        },

        async login(email, password) {
            const supabase = await this.client();

            return await supabase.auth.signInWithPassword({
                email: email.trim(),
                password: password
            });
        },

        async logout() {
            const supabase = await this.client();
            const { error } = await supabase.auth.signOut();

            if (error) {
                throw error;
            }

            window.location.replace("login.html");
        },

        async resetPassword(email) {
            const supabase = await this.client();

            return await supabase.auth.resetPasswordForEmail(
                email.trim(),
                {
                    redirectTo: window.location.origin + "/login.html"
                }
            );
        },

        async getSession() {
            const supabase = await this.client();
            const { data, error } = await supabase.auth.getSession();

            if (error) {
                throw error;
            }

            return data.session;
        }
    };

    window.EXAM_JUNCTION_AUTH = Auth;
})();
