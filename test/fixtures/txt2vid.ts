const OK_RESPONSE = {
    "status": "processing",
    "tip": "Your image is processing in background, you can get this image using fetch API",
    "eta": 10,
    "message": "Try to fetch request after seconds estimated",
    "fetch_result": "https:\/\/modelslab.com\/api\/v6\/video\/fetch\/65919758",
    "id": 65919758,
    "output": [],
    "meta": {
        "base64": "no",
        "clip_skip": null,
        "file_prefix": "37c09e3e-c1a4-4786-b211-934a84aadb27",
        "fps": 7,
        "guidance_scale": 9,
        "height": 320,
        "improved_sampling_seed": 42,
        "instant_response": "no",
        "model_id": "zeroscope",
        "negative_prompt": "low quality, watermark, watermark, copyright, blurry, nsfw",
        "num_frames": 18,
        "num_inference_steps": 20,
        "output_type": "gif",
        "prompt": "a snowboarder doing flips on a slope",
        "seed": 869792957,
        "temp": "no",
        "upscale_guidance_scale": 15,
        "upscale_height": null,
        "upscale_num_inference_steps": 20,
        "upscale_strength": 0.6,
        "upscale_width": null,
        "use_improved_sampling": "no",
        "width": 576
    },
    "future_links": [
        "https:\/\/pub-3626123a908346a7a8be8d9295f44e26.r2.dev\/generations\/37c09e3e-c1a4-4786-b211-934a84aadb27.gif"
    ]
}

const ERROR_RESPONSE = {
    "status": "error",
    "message": "Invalid API Request",
    "tip": "1. Make sure you are passing Content-Type: application\/json in header. 2. Make sure you are doing POST request with valid JSON. 3. Make sure your JSON does not have error, use jsonlint to validate json array"
}

const FETCH_OK_RESPONSE = {
    "status": "success",
    "id": 65919758,
    "output": [
        "https:\/\/pub-3626123a908346a7a8be8d9295f44e26.r2.dev\/generations\/37c09e3e-c1a4-4786-b211-934a84aadb27.gif"
    ],
    "proxy_links": [
        "https:\/\/cdn2.stablediffusionapi.com\/generations\/37c09e3e-c1a4-4786-b211-934a84aadb27.gif"
    ]
}
const FETCH_FAILED_RESPONSE = {
    "status": "failed",
    "id": "",
    "message": "Request not found",
    "output": "",
    "tip": "Get 20x faster image generation using enterprise plan. Click here : https:\/\/modelslab.com\/enterprise"
}