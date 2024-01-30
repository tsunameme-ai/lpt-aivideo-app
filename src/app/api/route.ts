import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({ hello: 'world' })
}
// export default async function handler(
//     req: NextApiRequest,
//     res: NextApiResponse
// ) {
//     try {
//         console.log('???? fetch image')
//         const { url } = req.query
//         if (!url || typeof url !== 'string') {
//             return res.status(400).json({ error: 'Invalid image URL' });
//         }
//         const response = await fetch(url);
//         const imageData = await response.buffer();

//         // const blob = await response.blob();
//         // const file = new File([blob], 'image.jpg', { type: 'image/jpeg' })

//         // Return image data
//         res.setHeader('Content-Type', 'image/jpeg');
//         res.status(200).send(imageData);
//     } catch (error) {
//         console.error('Error fetching image:', error);
//         res.status(500).json({ error: 'Error fetching image' });
//     }
// }