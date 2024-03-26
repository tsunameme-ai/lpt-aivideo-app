import { sendGAEvent } from '@next/third-parties/google'
export class Utils {

    public static delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

export class Analytics {
    public static trackEvent(...args: Object[]) {
        sendGAEvent(args)
    }
}