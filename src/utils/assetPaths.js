const BASE = import.meta.env.BASE_URL;

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export const PRODUCT_GALLERY_VIEWS = ['front', 'side', 'back', 'detail', 'fabric'];

/**
 * Local-convention path for a product photo. Not the DB `images` field —
 * this is the fallback filename a real asset would use once dropped into
 * public/image/products/, matched against by <img onError> in the UI.
 */
export function getProductImagePath(product, view = 'front') {
  if (!product?.name) return null;
  return `${BASE}image/products/${slugify(product.name)}-${view}.jpg`;
}

export function getProductGalleryPaths(product) {
  return PRODUCT_GALLERY_VIEWS.map((view) => getProductImagePath(product, view));
}

export function getFabricImagePath(key) {
  return `${BASE}image/fabric/${slugify(key)}.jpg`;
}

export const MASTER_IMAGE_VIEWS = ['fabric selection', 'lapel adjustment', 'the fitting'];

export function getMasterImagePath(view) {
  return `${BASE}image/master/${slugify(view)}.jpg`;
}

export function getStylingImagePath(label) {
  return `${BASE}image/styling/${slugify(label)}.jpg`;
}

export const HERO_IMAGE_PATH = `${BASE}image/hero-suit.jpg`;
export const HERO_VIDEO_PATH = `${BASE}video/house-atelier.mp4`;
export const AUDIO_TRACK_PATH = `${BASE}audio/house-theme.mp3`;
