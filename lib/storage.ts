// Storage abstraction. Local filesystem by default; swap the implementation
// for S3/R2/GCS when deploying (set STORAGE_PROVIDER=s3 and the AWS_* env vars).
import fs from "node:fs";
import path from "node:path";
import { UPLOAD_DIR } from "@/lib/db";

export type StoredFile = { key: string; url: string };

export async function putFile(key: string, bytes: Buffer): Promise<StoredFile> {
  if (process.env.STORAGE_PROVIDER === "s3") {
    // TODO: implement with @aws-sdk/client-s3 when deploying.
    // const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");
    // const s3 = new S3Client({ region: process.env.AWS_REGION });
    // await s3.send(new PutObjectCommand({ Bucket: process.env.S3_BUCKET, Key: key, Body: bytes }));
    // return { key, url: `${process.env.S3_PUBLIC_URL}/${key}` };
    throw new Error("S3 storage not implemented yet (P9.2)");
  }
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  fs.writeFileSync(path.join(UPLOAD_DIR, key), bytes);
  return { key, url: `/api/files/${key}` };
}

export async function getFile(key: string): Promise<Buffer | null> {
  if (process.env.STORAGE_PROVIDER === "s3") {
    throw new Error("S3 storage not implemented yet (P9.2)");
  }
  const p = path.join(UPLOAD_DIR, key);
  if (!fs.existsSync(p)) return null;
  return fs.readFileSync(p);
}
