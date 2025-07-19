// src/app/api/coins/upload/route.ts
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = path.extname(file.name);
  const filename = `${uuidv4()}${ext}`;
  const uploadPath = path.join(process.cwd(), 'public/uploads', filename);

  await writeFile(uploadPath, buffer);

  return NextResponse.json({ url: `/uploads/${filename}` });
}