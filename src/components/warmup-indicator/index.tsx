'use client'
import { txt2img } from "@/actions/stable-diffusion";
import { useEffect, useState } from "react";
import ErrorComponent, { ErrorComponentStyle } from "../error";


const WarmUpInvervalMS = 4 * 60 * 1000 //4min
const WarmUpIndicator: React.FC = () => {
    let isVisible: boolean = false
    let lastWarmupTime = 0
    const [isWarmingUp, setIsWarmingUp] = useState<boolean>(false);
    const [isWarm, setIsWarm] = useState<boolean>(false);

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
        const dur = new Date().getTime() - lastWarmupTime
        if (dur > WarmUpInvervalMS) {
            setIsWarm(false)
        }
        if (!isVisible) {
            return
        }
        setIsWarmingUp(true)
        try {
            const outputs = await txt2img({
                pPrompt: 'a cat',
                nPrompt: '',
                modelId: 'ByteDance/SDXL-Lightning',
                width: 64,
                height: 64,
                numOutput: 1
            })
            if (outputs && outputs.length > 0) {
                setIsWarm(true)
            }
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
        <>{!isWarm &&
            <ErrorComponent style={ErrorComponentStyle.Warning} errorMessage="Models are warming up. Please wait a bit." />
        }</>
    );
};

export default WarmUpIndicator