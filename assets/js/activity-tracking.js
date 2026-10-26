/* =========================================
   EXAM JUNCTION — ACTIVITY TRACKING
   Separate module; does not modify common.js.
   ========================================= */

(function () {
    "use strict";

    // Temporarily paused on request. This disables only activity tracking;
    // login, batches, lectures, notes, and notifications remain unchanged.
    const TRACKING_ENABLED = false;
    if (!TRACKING_ENABLED) return;

    const TRACKER_KEY = "__EJ_ACTIVITY_TRACKER__";

    // Prevent duplicate initialization on the same page.
    if (window[TRACKER_KEY]) return;

    const Tracker = {
        initialized: false,
        userId: null,
        supabase: null,
        pagePath: window.location.pathname,
        lastHeartbeat: 0,
        heartbeatTimer: null,
        lastPageView: "",

        async init() {
            if (this.initialized) return true;

            const EJ = window.EXAM_JUNCTION;

            if (!EJ || typeof EJ.init !== "function") {
                console.info(
                    "EXAM JUNCTION: Shared system not loaded; tracking paused."
                );
                return false;
            }

            if (!(await EJ.init())) return false;

            const user = await EJ.getCurrentUser();

            // Free content remains accessible without login.
            // Anonymous activity is not linked to a student score.
            if (!user) return false;

            this.userId = user.id;
            this.supabase = EJ.supabase;
            this.initialized = true;

            await this.recordPageView();
            this.startHeartbeat();

            document.addEventListener(
                "visibilitychange",
                () => this.handleVisibilityChange()
            );

            window.addEventListener("pagehide", () => this.stopHeartbeat());

            return true;
        },

        async recordEvent(type, durationSeconds, lectureId) {
            if (!this.initialized || !this.supabase) return false;

            const allowedTypes = [
                "page_view",
                "active_time",
                "lecture_watch"
            ];

            if (!allowedTypes.includes(type)) return false;

            const duration = Math.floor(Number(durationSeconds) || 0);

            if (duration < 0 || duration > 60) return false;

            if (
                (type === "active_time" || type === "lecture_watch") &&
                duration === 0
            ) {
                return false;
            }

            const { data, error } = await this.supabase.rpc(
                "log_student_activity",
                {
                    p_event_type: type,
                    p_page_path: this.pagePath,
                    p_lecture_id: lectureId || null,
                    p_duration_seconds: duration
                }
            );

            if (error) {
                console.warn(
                    "EXAM JUNCTION: Activity not recorded.",
                    error.message
                );
                return false;
            }

            return data === true;
        },

        async recordPageView() {
            // Avoid duplicate page-view events from this instance.
            const visitKey = this.pagePath + "|" + Date.now();

            if (this.lastPageView === visitKey) return;

            this.lastPageView = visitKey;
            await this.recordEvent("page_view", 0);
        },

        async recordActiveTime(seconds) {
            if (document.visibilityState !== "visible") return;
            if (!document.hasFocus()) return;

            await this.recordEvent("active_time", seconds);
        },

        startHeartbeat() {
            if (this.heartbeatTimer) return;

            this.lastHeartbeat = Date.now();

            this.heartbeatTimer = window.setInterval(async () => {
                if (document.visibilityState !== "visible") {
                    this.lastHeartbeat = Date.now();
                    return;
                }

                if (!document.hasFocus()) {
                    this.lastHeartbeat = Date.now();
                    return;
                }

                const now = Date.now();
                const elapsed = Math.floor(
                    (now - this.lastHeartbeat) / 1000
                );

                this.lastHeartbeat = now;

                // Record only plausible short intervals.
                if (elapsed > 0 && elapsed <= 60) {
                    await this.recordActiveTime(elapsed);
                }
            // A single heartbeat per minute halves write volume at scale.
            // The database function accepts up to 60 seconds per event.
            }, 60000);
        },

        stopHeartbeat() {
            if (this.heartbeatTimer) {
                clearInterval(this.heartbeatTimer);
                this.heartbeatTimer = null;
            }
        },

        handleVisibilityChange() {
            this.lastHeartbeat = Date.now();
        },

        // Call this from an embedded YouTube player integration
        // only when actual playback progress has been measured.
        async recordLectureWatch(seconds, lectureId) {
            if (!Number.isInteger(seconds) || seconds < 1 || seconds > 60) {
                return false;
            }

            return this.recordEvent(
                "lecture_watch",
                seconds,
                lectureId
            );
        }
    };

    window[TRACKER_KEY] = Tracker;
    window.EXAM_JUNCTION_ACTIVITY = Tracker;

    // Initialize only after the shared system is available.
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
            Tracker.init().catch(error => {
                console.warn("EXAM JUNCTION tracking paused:", error);
            });
        });
    } else {
        Tracker.init().catch(error => {
            console.warn("EXAM JUNCTION tracking paused:", error);
        });
    }
})();
