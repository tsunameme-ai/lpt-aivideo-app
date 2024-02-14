import React, { useState, useEffect } from "react"
import RemoteImage from "../remote-image";
import ErrorComponent from "../error";
import styles from "@/styles/home.module.css";

interface ImageWithTextOverlayProps {
    imageUrl: string;
    text: string;
    onImageData?: (text: string, url: string, width: number, height: number) => void
}

const ImageWithTextOverlay: React.FC<ImageWithTextOverlayProps> = ({ imageUrl, text, onImageData }) => {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>('')

    const onImageLoad = (imageDataURL: string) => {
        const img = new Image();
        img.onload = () => {
            setImage(img)
            setErrorMessage('')
        };
        img.onerror = (e: any) => {
            setErrorMessage(e.message || 'Unable to read image')
        }
        img.src = imageDataURL;
    }

    useEffect(() => {
        if (image && canvas) {
            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.font = "35px Arial"
                ctx.drawImage(image, 0, 0)

                const lines = text.split('\n')
                if (text.length > 0 && lines.length > 0) {
                    const lineHeight = parseInt(ctx.font, 10) * 1.2; // Adjust line spacing

                    ctx.fillStyle = "rgba(255, 255, 255, 0.5)"
                    const rectH = lineHeight * (lines.length + 2)
                    ctx.fillRect(0, canvas.height - rectH, canvas.width, rectH)


                    // Add your text drawing logic here

                    ctx.fillStyle = "black"
                    ctx.textAlign = "center"
                    ctx.textBaseline = "bottom"

                    let cy = canvas.height - lineHeight;
                    for (let i = lines.length - 1; i >= 0; i--) {
                        ctx.fillText(lines[i], canvas.width / 2, cy);
                        cy -= lineHeight
                    }
                }
                if (onImageData) {
                    const dataURL = canvas.toDataURL("image/png");
                    onImageData?.(text, dataURL, image.width, image.height)
                }
            }
        }
    }, [image, canvas, text]);

    return (
        <div>
            <RemoteImage src={imageUrl} onComplete={onImageLoad} />
            {image && (
                <canvas className={styles.centerCanvas} ref={(ref) => setCanvas(ref)} width={image?.width || 0} height={image?.height || 0} />
            )}
            <ErrorComponent errorMessage={errorMessage} />
        </div>
    );
};

export default ImageWithTextOverlay;