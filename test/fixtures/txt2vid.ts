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

const TXT2IMG_SUCCESS = {
    "status": "success",
    "generationTime": 1.96,
    "id": 66752945,
    "output": [
        "https:\/\/pub-3626123a908346a7a8be8d9295f44e26.r2.dev\/generations\/0-1ec64a77-ef0f-4ccf-932b-0c70e917e526.png"
    ],
    "proxy_links": [
        "https:\/\/cdn2.stablediffusionapi.com\/generations\/0-1ec64a77-ef0f-4ccf-932b-0c70e917e526.png"
    ],
    "nsfw_content_detected": false,
    "webhook_status": "",
    "meta": {
        "prompt": "mdjrny-v4 style ultra realistic close up portrait ((beautiful pale cyberpunk female with heavy black eyeliner)), blue eyes, shaved side haircut, hyper detail, cinematic lighting, magic neon, dark red city, Canon EOS R3, nikon, f\/1.4, ISO 200, 1\/160s, 8K, RAW, unedited, symmetrical balance, in-frame, 8K hyperrealistic, full body, detailed clothing, highly detailed, cinematic lighting, stunningly beautiful, intricate, sharp focus, f\/1. 8, 85mm, (centered image composition), (professionally color graded), ((bright soft diffused light)), volumetric fog, trending on instagram, trending on tumblr, HDR 4K, 8K",
        "model_id": "midjourney",
        "negative_prompt": "painting, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, deformed, ugly, blurry, bad anatomy, bad proportions, extra limbs, cloned face, skinny, glitchy, double torso, extra arms, extra hands, mangled fingers, missing lips, ugly face, distorted face, extra legs, anime (child:1.5), ((((underage)))), ((((child)))), (((kid))), (((preteen))), (teen:1.5) ugly, tiling, poorly drawn hands, poorly drawn feet, poorly drawn face, out of frame, extra limbs, disfigured, deformed, body out of frame, bad anatomy, watermark, signature, cut off, low contrast, underexposed, overexposed, bad art, beginner, amateur, distorted face, blurry, draft, grainy",
        "scheduler": "UniPCMultistepScheduler",
        "safety_checker": "no",
        "W": 512,
        "H": 512,
        "guidance_scale": 7.5,
        "seed": 3166507472,
        "steps": 20,
        "n_samples": 1,
        "full_url": "no",
        "instant_response": "no",
        "tomesd": "yes",
        "ip_adapter_id": null,
        "ip_adapter_scale": 0.6,
        "ip_adapter_image": null,
        "free_u": "no",
        "upscale": "no",
        "multi_lingual": "no",
        "panorama": "no",
        "self_attention": "no",
        "use_karras_sigmas": "no",
        "algorithm_type": "no",
        "safety_checker_type": "sensitive_content_text",
        "embeddings": null,
        "vae": null,
        "lora": null,
        "lora_strength": 1,
        "clip_skip": 1,
        "temp": "no",
        "base64": "no",
        "file_prefix": "1ec64a77-ef0f-4ccf-932b-0c70e917e526.png"
    },
    "tip": "Get 20x faster image generation using enterprise plan. Click here : https:\/\/modelslab.com\/enterprise"
}