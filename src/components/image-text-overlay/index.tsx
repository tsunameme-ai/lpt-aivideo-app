import React, { useState, useEffect } from "react"
import RemoteImage from "../remote-image";
import ErrorComponent from "../error";
import styles from "@/styles/home.module.css";
import { Button } from "@nextui-org/react";

interface ImageWithTextOverlayProps {
    imageUrl: string;
    text: string;
    onImageData?: (text: string, imageDataURL: string, textImageDataURL: string | undefined, width: number, height: number) => void
}

const ImageWithTextOverlay: React.FC<ImageWithTextOverlayProps> = ({ imageUrl, text, onImageData }) => {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null)
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
    const handleClickDownloadCoverImage = async () => {
        if (canvas && image) {
            drawImage(canvas, null)
            const dataURL = canvas.toDataURL("image/png")
            // const link = document.createElement("a");
            // link.href = dataURL
            // link.download = "cover.png";
            // link.click();
            const body = {
                'video_url': 'https://pub-3626123a908346a7a8be8d9295f44e26.r2.dev/generations/944fd9f2-74d6-4367-b6ff-8ffb6c3a1482.mp4',
                'image_data': dataURL
            }
            const response = await fetch('/api/image-over-text', {
                method: "POST",
                body: JSON.stringify(body)
            })
            console.log(JSON.stringify(body, null, 2))
            if (response.ok) {
                const data = await response.json()
                console.log(data)
            }
            else {
                console.log(response.status)
                console.log(response)
            }



            drawImage(canvas, image)
        }

    }
    const drawImage = (cvs: HTMLCanvasElement, img: HTMLImageElement | null) => {
        const ctx = cvs.getContext("2d");
        if (ctx) {
            ctx.clearRect(0, 0, cvs.width, cvs.height)
            ctx.font = "35px Arial"
            if (img) {
                ctx.drawImage(img, 0, 0)
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
            // drawImage(canvas, image)
            let txtURL = undefined
            if (text.length > 0) {
                drawImage(canvas, null)
                txtURL = canvas.toDataURL("image/png");

            }
            drawImage(canvas, image)
            const dataURL = canvas.toDataURL("image/png");
            onImageData?.(text, dataURL, txtURL, image.width, image.height)
        }
    }, [image, canvas, text]);

    return (
        <div>
            <RemoteImage src={imageUrl} onComplete={onImageLoad} />
            {image && (
                <canvas className={styles.centerCanvas} ref={(ref) => setCanvas(ref)} width={image.width} height={image.height} />
            )}
            <Button color="primary" onPress={handleClickDownloadCoverImage}>Debug:Download Cover Image</Button>
            <ErrorComponent errorMessage={errorMessage} />
        </div>
    );
};

export default ImageWithTextOverlay;