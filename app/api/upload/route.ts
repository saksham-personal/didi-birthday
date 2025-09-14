import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  // Convert the file to a buffer
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
      if (error) {
        console.error('Cloudinary upload error:', error);
        reject(NextResponse.json({ error: "File upload failed" }, { status: 500 }));
      } else if (result) {
        resolve(NextResponse.json({ url: result.secure_url }));
      }
    }).end(bytes);
  });
}