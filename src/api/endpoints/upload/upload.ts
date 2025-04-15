/**
 * Generated by orval v7.8.0 🍺
 * Do not edit manually.
 * Shoppe example
 * The shop API description
 * OpenAPI spec version: 1.0
 */
import type {
  UploadControllerUploadImage200,
  UploadControllerUploadImageBody,
} from '../../models';

import { api } from '../../../../lib/api';

type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];

export const getUpload = () => {
  const uploadControllerUploadImage = (
    uploadControllerUploadImageBody: UploadControllerUploadImageBody,
    options?: SecondParameter<typeof api>,
  ) => {
    const formData = new FormData();
    formData.append('file', uploadControllerUploadImageBody.file);

    return api<UploadControllerUploadImage200>(
      {
        url: `http://localhost:3001/api/v1/upload/upload-file`,
        method: 'POST',
        headers: { 'Content-Type': 'multipart/form-data' },
        data: formData,
      },
      options,
    );
  };
  return { uploadControllerUploadImage };
};
export type UploadControllerUploadImageResult = NonNullable<
  Awaited<
    ReturnType<ReturnType<typeof getUpload>['uploadControllerUploadImage']>
  >
>;
