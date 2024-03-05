'use client'
import { txt2img } from "@/actions/stable-diffusion";
import { useEffect, useState } from "react";


const WarmUpInvervalMS = 4 * 60 * 1000 //4min
const WarmUpIndicator: React.FC = () => {
    let isVisible: boolean = false
    let lastWarmupTime = 0

    // const [warmUpInterval, setWarmUpInterval] = useState()
    useEffect(() => {
        // warmUp()
        const interval = scheduleWarmup()
        window.addEventListener('visibilitychange', handleVisibilityChange);
        handleVisibilityChange()
        return () => {
            clearInterval(interval)
            window.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [])
    const warmUp = async () => {
        if (!isVisible) {
            return
        }
        try {
            await txt2img({
                pPrompt: 'a cat',
                nPrompt: '',
                modelId: 'ByteDance/SDXL-Lightning',
                width: 64,
                height: 64,
                numOutput: 1
            })
        }
        catch (error: any) {

        }
    }

    const scheduleWarmup = () => {
        const interval = setInterval(() => {
            warmUp()
        }, WarmUpInvervalMS)
        return interval
    }


    const handleVisibilityChange = () => {
        isVisible = document.visibilityState === 'visible'
        if (document.visibilityState === 'visible') {
            if (new Date().getTime() - lastWarmupTime > WarmUpInvervalMS) {
                warmUp()
            }
        }
    };
    return (
        <></>
    );
};

export default WarmUpIndicator