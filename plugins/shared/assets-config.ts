import { AssetsFontConfig } from './assets-font-config';
import { AssetsImagesConfig } from './assets-images-config';
import { AssetsStringsConfig } from './assets-strings-config';

export interface AssetsConfig {
  fonts?: AssetsFontConfig[];
  images?: AssetsImagesConfig;
  strings?: AssetsStringsConfig;
}
