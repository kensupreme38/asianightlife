import { placeholderImagesData } from './placeholder-images-data';

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

export const placeholderImages: ImagePlaceholder[] = placeholderImagesData;

export const getImage = (id: string): ImagePlaceholder | undefined => {
    return placeholderImages.find(img => img.id === id);
}
