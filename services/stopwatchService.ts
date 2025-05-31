import { EventType, SessionEvent } from "@/models/studysession";
import { apiClient } from "@/services/apiClient";
import * as SecureStore from 'expo-secure-store';

interface StopwatchInfo {
    elapsedTime: number;    // Total active time in milliseconds
    pausedTime: number;    // Total paused time in milliseconds
    totalTime: number;     // Total time since start in milliseconds
    isRunning: boolean;    // Whether timer is currently running
    lastEvent?: SessionEvent; // Last recorded event
}

const LOCAL_EVENTS_KEY = 'stopwatch_pending_events';

class StopwatchService {
    private pendingEvents: SessionEvent[] = [];

    constructor() {
        this.loadPersistedData();
    }

    private async loadPersistedData() {
        try {
            const events = await SecureStore.getItemAsync(LOCAL_EVENTS_KEY)
            this.pendingEvents = events ? JSON.parse(events) : [];
        } catch (error) {
            console.error("Failed to load persisted data:", error);
        }
    }

    private async persistEventsLocally() {
        try {
            await SecureStore.setItemAsync(LOCAL_EVENTS_KEY, JSON.stringify(this.pendingEvents));
        } catch (error) {
            console.error("Failed to persist events:", error);
        }
    }

    public async syncPendingEvents(): Promise<void> {
        if (!this.pendingEvents.length) return;

        try {
            await apiClient.addStudySessionEvents({
                events: this.pendingEvents
            });

            // Clear successfully synced events
            this.pendingEvents = [];
            await this.persistEventsLocally();
        } catch (error) {
            console.error("Failed to sync events:", error);
            throw error;
        }
    }

    public async recordEvent(eventType: EventType, time: number | Date): Promise<void> {
        const event: SessionEvent = {
            event_type: eventType,
            event_time: new Date(time).toISOString()
        };

        this.pendingEvents.push(event);
        await this.persistEventsLocally();

        try {
            await this.syncPendingEvents();
        } catch (error) {
            console.log("Event stored locally, will sync later");
        }
    }

    public async getStopwatchInfo(): Promise<StopwatchInfo> {
        const events = await apiClient.getActiveStudySessionEvents().catch(() => null)

        if (!events?.length) {
            return {
                elapsedTime: 0,
                pausedTime: 0,
                totalTime: 0,
                isRunning: false,
            };
        }

        let elapsedTime = 0;
        let pausedTime = 0;
        let isRunning = false;
        let lastStartTime: Date | null = null;
        let lastPauseTime: Date | null = null;

        // Process each event to calculate times
        for (let i = 0; i < events.length; i++) {
            const event = events[i];
            const eventTime = new Date(event.event_time);

            switch (event.event_type) {
                case 'start':
                    elapsedTime = 0;
                    pausedTime = 0;
                    lastStartTime = eventTime;
                    isRunning = true;
                    break;

                case 'resume':
                    if (lastPauseTime) {
                        pausedTime += eventTime.getTime() - lastPauseTime.getTime();
                        lastPauseTime = null;
                    }
                    lastStartTime = eventTime;
                    isRunning = true;
                    break;

                case 'pause':
                    if (lastStartTime) {
                        elapsedTime += eventTime.getTime() - lastStartTime.getTime();
                        lastStartTime = null;
                    }
                    lastPauseTime = eventTime;
                    isRunning = false;
                    break;

                case 'stop':
                    if (lastStartTime) {
                        elapsedTime += eventTime.getTime() - lastStartTime.getTime();
                    }
                    isRunning = false;
                    break;
            }
        }

        // If currently running, add time since last start
        if (isRunning && lastStartTime) {
            elapsedTime += Date.now() - lastStartTime.getTime();
        }

        // If currently paused, add time since last pause
        if (!isRunning && lastPauseTime) {
            pausedTime += Date.now() - lastPauseTime.getTime();
        }

        return {
            elapsedTime,
            pausedTime,
            totalTime: elapsedTime + pausedTime,
            isRunning,
        };
    }

    public async startNewSession(at: Date | number, title: string, notes?: string): Promise<void> {
        try {
            await apiClient.startStudySession({
                title,
                notes,
                started_at: new Date(at).toISOString(),
            });
        } catch (error) {
            console.error("Failed to start session:", error);
            throw error;
        }
    }

    public async finishCurrentSession(time: number | Date): Promise<void> {
        try {
            await apiClient.finishStudySession({
                finished_at: new Date(time).toISOString()
            });
        } catch (error) {
            console.error("Failed to finish session:", error);
            throw error;
        }
    }
}

export const stopwatchService = new StopwatchService();