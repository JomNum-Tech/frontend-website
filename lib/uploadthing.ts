import { generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "@/types/uploadthing/core";

export const { useUploadThing, uploadFiles } = generateReactHelpers<OurFileRouter>();