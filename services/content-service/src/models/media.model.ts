// Media Asset model

import { BaseModel } from './base.model';

export interface MediaAsset extends BaseModel {
  filename: string;
  original_filename: string | null;
  file_path: string;
  url: string;
  mime_type: string;
  file_size: number;
  width: number | null;
  height: number | null;
  duration: number | null;
  alt_text: string | null;
  caption: string | null;
  folder: string;
  uploaded_by: number | null;
  is_public: boolean;
  metadata: Record<string, any>;
}

export interface CreateMediaAssetDTO {
  filename: string;
  original_filename?: string;
  file_path: string;
  url: string;
  mime_type: string;
  file_size: number;
  width?: number;
  height?: number;
  duration?: number;
  alt_text?: string;
  caption?: string;
  folder?: string;
  uploaded_by?: number;
  is_public?: boolean;
  metadata?: Record<string, any>;
}

export interface UpdateMediaAssetDTO {
  alt_text?: string;
  caption?: string;
  folder?: string;
  is_public?: boolean;
  metadata?: Record<string, any>;
}

export interface MediaAssetFilter {
  folder?: string;
  mime_type?: string;
  uploaded_by?: number;
  is_public?: boolean;
}
