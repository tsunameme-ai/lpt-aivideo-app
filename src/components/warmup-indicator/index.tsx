'use client'
import { txt2img } from "@/actions/stable-diffusion";
import { useEffect, useState } from "react";


const WarmUpInvervalMS = 4 * 60 * 1000 //4min
const WarmUpIndicator: React.FC = () => {
    let isVisible: boolean = false
    let lastWarmupTime = 0
    const [isWarmingUp, setIsWarmingUp] = useState<boolean>(false);

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
        console.log(`warmup isVisible:${isVisible} isWarmingUp: ${isWarmingUp}`)
        if (!isVisible) {
            return
        }
        setIsWarmingUp(true)
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
        finally {
            setIsWarmingUp(false)
        }
    }

    const scheduleWarmup = () => {
        const interval = setInterval(() => {
            warmUp()
        }, WarmUpInvervalMS)
        return interval
    }


    const handleVisibilityChange = () => {
        console.log(`handleVisibilityChange? ${document.visibilityState}`)
        isVisible = document.visibilityState === 'visible'
        // setIsVisible(document.visibilityState === 'visible');
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