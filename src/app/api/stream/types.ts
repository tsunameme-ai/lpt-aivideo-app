
export enum StreamStatus {
    START = 'start',
    PING = 'ping',
    COMPLETE = 'complete'
}

export type StreamResponse = { status: StreamStatus, data?: any }