'use client'
import { sendGAEvent } from '@next/third-parties/google'

export class Analytics {
    public static trackEvent(...args: Object[]) {
        sendGAEvent(args)
    }
}