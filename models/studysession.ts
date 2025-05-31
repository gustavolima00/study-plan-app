export type SessionState = 'active' | 'completed';
export type EventType = 'start' | 'pause' | 'resume' | 'stop';

export interface SessionEvent {
  event_time: string;
  event_type: EventType;
}

export interface StudySession {
  id: string;
  user_id: string;
  title: string;
  notes: string;
  date: string;
  session_state: SessionState;
}

export interface UpsertActiveStudySessionRequest {
  title: string;
  notes?: string;
  started_at: string
}

export interface AddStudySessionEventsRequest {
  events: SessionEvent[];
}

export interface FinishStudySessionRequest {
  finished_at?: string;
}