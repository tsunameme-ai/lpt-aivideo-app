const OK_RESPONSE = {
    "status": "processing",
    "tip": "Get 20x faster image generation using enterprise plan. Click here : https:\/\/stablediffusionapi.com\/enterprise",
    "tip_1": "Your image is processing in background, you can get this image using fetch API: here is link for fetch api : https:\/\/stablediffusionapi.com\/docs\/community-models-api-v4\/dreamboothfetchqueimg",
    "eta": 6,
    "messege": "Try to fetch request after seconds estimated",
    "fetch_result": "https:\/\/stablediffusionapi.com\/api\/v3\/fetch\/65704373",
    "id": 65704373,
    "output": "",
    "future_links": [
        "https:\/\/pub-3626123a908346a7a8be8d9295f44e26.r2.dev\/generations\/0a14364c-278e-4754-8cb3-3ec807efe4a2.mp4"
    ],
    "meta": {
        "H": 320,
        "W": 576,
        "file_prefix": "0a14364c-278e-4754-8cb3-3ec807efe4a2",
        "guidance_scale": 9,
        "image_guidance_scale": 1,
        "instant_response": "yes",
        "n_samples": 1,
        "negative_prompt": "Low Quality",
        "num_frames": 24,
        "outdir": "out",
        "prompt": "man walking on the road, ultra HD video",
        "safetychecker": "no",
        "scheduler": "UniPCMultistepScheduler",
        "seconds": 3,
        "seed": 443354930,
        "steps": 20,
        "temp": "no"
    }
}

const ERROR_RESPONSE = {
    "status": "error",
    "message": "Invalid API Request",
    "tip": "1. Make sure you are passing Content-Type: application\/json in header. 2. Make sure you are doing POST request with valid JSON. 3. Make sure your JSON does not have error, use jsonlint to validate json array"
}

const FETCH_OK_RESPONSE = {
    "status": "success",
    "id": 65704373,
    "tip": "",
    "output": [
        "https:\/\/pub-3626123a908346a7a8be8d9295f44e26.r2.dev\/generations\/0a14364c-278e-4754-8cb3-3ec807efe4a2.mp4"
    ]
}