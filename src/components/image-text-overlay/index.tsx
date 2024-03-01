import React, { useState, useEffect } from "react"
import RemoteImage from "../remote-image";
import ErrorComponent from "../error";
import styles from "@/styles/home.module.css";
import { DEFAULT_VIDEO_HEIGHT, DEFAULT_VIDEO_WIDTH, LocalImageData } from "@/libs/types";


interface ImageWithTextOverlayProps {
    imageUrl: string;
    text: string;
    onImageData?: (text: string, localImageData: LocalImageData) => void
}

const ImageWithTextOverlay: React.FC<ImageWithTextOverlayProps> = ({ imageUrl, text, onImageData }) => {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [canvasWidth, setCanvasWidth] = useState<number>(DEFAULT_VIDEO_WIDTH)
    const [canvasHeight, setCanvasHeight] = useState<number>(DEFAULT_VIDEO_HEIGHT)

    const resizeRectangle = (width: number, height: number, maxW: number, maxH: number): { width: number, height: number, resized: boolean } => {
        const aspectRatio = width / height;
        if (width > maxW) {
            const newWidth = maxW;
            const newHeight = Math.floor(newWidth / aspectRatio);
            return { width: newWidth, height: newHeight, resized: true };
        }
        if (height > maxH) {
            const newHeight = maxH;
            const newWidth = Math.floor(newHeight * aspectRatio);
            return { width: newWidth, height: newHeight, resized: true };
        }
        return { width, height, resized: false }
    }

    const onImageLoad = (imageDataURL: string) => {
        const img = new Image();
        img.onload = () => {
            const { width, height } = resizeRectangle(img.width, img.height, DEFAULT_VIDEO_WIDTH, DEFAULT_VIDEO_HEIGHT)
            setCanvasWidth(width)
            setCanvasHeight(height)
            setImage(img)
            setErrorMessage('')
        };
        img.onerror = (e: any) => {
            setErrorMessage(e.message || 'Unable to read image')
        }
        img.src = imageDataURL;
    }
    const drawImage = (cvs: HTMLCanvasElement, img: HTMLImageElement | null) => {
        const ctx = cvs.getContext("2d");
        if (ctx) {
            ctx.clearRect(0, 0, cvs.width, cvs.height)
            ctx.font = "35px Arial"
            if (img) {
                ctx.drawImage(img, 0, 0, cvs.width, cvs.height)
            }

            const lines = text.split('\n')
            if (text.length > 0 && lines.length > 0) {
                const lineHeight = parseInt(ctx.font, 10) * 1.2; // Adjust line spacing

                ctx.fillStyle = "rgba(255, 255, 255, 0.5)"
                const rectH = lineHeight * (lines.length + 2)
                ctx.fillRect(0, cvs.height - rectH, cvs.width, rectH)


                // Add your text drawing logic here

                ctx.fillStyle = "black"
                ctx.textAlign = "center"
                ctx.textBaseline = "bottom"

                let cy = cvs.height - lineHeight;
                for (let i = lines.length - 1; i >= 0; i--) {
                    ctx.fillText(lines[i], cvs.width / 2, cy);
                    cy -= lineHeight
                }
            }
        }

    }

    useEffect(() => {
        if (image && canvas) {
            let txtURL = undefined
            if (text.length > 0) {
                drawImage(canvas, null)
                txtURL = canvas.toDataURL("image/png")
            }
            drawImage(canvas, image)
            const dataURL = canvas.toDataURL("image/png")
            onImageData?.(text, {
                remoteURL: imageUrl,
                overlayImageDataURL: txtURL,
                dataURL: dataURL,
                width: canvasWidth,
                height: canvasHeight
            })
        }
    }, [image, canvas, text]);

    return (
        <div>
            <RemoteImage src={imageUrl} onComplete={onImageLoad} />

            {image && <>
                <canvas className={styles.centerCanvas} ref={(ref) => setCanvas(ref)} width={canvasWidth} height={canvasHeight} />
            </>}

            <ErrorComponent errorMessage={errorMessage} />
        </div >
    );
};

export default ImageWithTextOverlay;