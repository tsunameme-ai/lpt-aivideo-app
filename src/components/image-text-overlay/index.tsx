import React, { useState, useEffect } from "react"
import RemoteImage from "../remote-image";
import ErrorComponent from "../error";

interface ImageWithTextOverlayProps {
    imageUrl: string;
    text: string;
    onDataURL?: (url: string) => void
}

const ImageWithTextOverlay: React.FC<ImageWithTextOverlayProps> = ({ imageUrl, text, onDataURL }) => {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>('')

    const onImageLoad = (imageFileUrl: string) => {
        const img = new Image();
        img.onload = () => {
            setImage(img)
            setErrorMessage('')
        };
        img.onerror = (e: any) => {
            setErrorMessage(e.message || 'Unable to read image')
        }
        img.src = imageFileUrl;
    }

    useEffect(() => {
        if (image && canvas) {
            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.drawImage(image, 0, 0)

                const lines = text.split('\n')
                if (lines.length > 0) {
                    const lineHeight = parseInt(ctx.font, 10) * 1.2; // Adjust line spacing

                    ctx.fillStyle = "rgba(255, 255, 255, 0.5)"
                    const rectH = lineHeight * (lines.length + 2)
                    ctx.fillRect(0, canvas.height - rectH, canvas.width, rectH)


                    // Add your text drawing logic here
                    ctx.font = "20px Arial"
                    ctx.fillStyle = "black"
                    ctx.textAlign = "center"
                    ctx.textBaseline = "bottom"

                    let cy = canvas.height - lineHeight;
                    for (let i = lines.length - 1; i >= 0; i--) {
                        ctx.fillText(lines[i], canvas.width / 2, cy);
                        cy -= lineHeight
                    }
                }

                const dataURL = canvas.toDataURL("image/png");
                onDataURL?.(dataURL);
            }
        }
    }, [image, canvas, text]);

    return (
        <div>
            <RemoteImage src={imageUrl} onComplete={onImageLoad} />
            {image && (
                <canvas ref={(ref) => setCanvas(ref)} width={image?.width || 0} height={image?.height || 0} />
            )}
            <ErrorComponent errorMessage={errorMessage} />
        </div>
    );
};

export default ImageWithTextOverlay;