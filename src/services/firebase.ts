/**
 * SHILP-AI Firebase Service Integration
 * 
 * Integrates Cloud Firestore, Firebase Storage, and Firebase Auth.
 * 
 * Workflow:
 * Original Image -> AI Enhancement -> Firebase Storage (products/original, products/enhanced) 
 * -> Firestore (products collection) -> Catalog displays Enhanced Image
 * 
 * Works seamlessly with live Firebase when credentials are provided in .env,
 * and includes an offline local storage fallback so the application runs smoothly
 * during development, tests, and offline demonstrations without crashing.
 */

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  getDoc, 
  query, 
  orderBy,
  Firestore 
} from 'firebase/firestore';
import { 
  getStorage, 
  ref, 
  uploadString, 
  getDownloadURL, 
  FirebaseStorage 
} from 'firebase/storage';
import { getAuth, Auth } from 'firebase/auth';
import { ProductListing } from '../types';
import { INITIAL_PRODUCTS } from '../data/craftPresets';

// Environment-based Firebase configuration
const firebaseConfig = {
  apiKey: (import.meta as any).env?.VITE_FIREBASE_API_KEY || '',
  authDomain: (import.meta as any).env?.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: (import.meta as any).env?.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: (import.meta as any).env?.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: (import.meta as any).env?.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: (import.meta as any).env?.VITE_FIREBASE_APP_ID || '',
};

export const isFirebaseConfigured = (): boolean => {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
};

// Initialize Firebase App safely
let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;
let auth: Auth | null = null;

try {
  if (isFirebaseConfigured()) {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    db = getFirestore(app);
    storage = getStorage(app);
    auth = getAuth(app);
  }
} catch (err) {
  console.warn('Firebase initialization notice: Running with local persistent fallback.', err);
}

export { app, db, storage, auth };

/**
 * Upload an image (Data URL or base64) to Firebase Storage.
 * Falls back to offline persistent caching when Firebase credentials are not provided.
 */
export async function uploadImageToStorage(
  imageDataUrl: string, 
  path: string
): Promise<string> {
  if (storage && isFirebaseConfigured()) {
    try {
      const storageRef = ref(storage, path);
      await uploadString(storageRef, imageDataUrl, 'data_url');
      const downloadUrl = await getDownloadURL(storageRef);
      return downloadUrl;
    } catch (err) {
      console.warn(`Firebase Storage upload to ${path} failed, using local persistent fallback:`, err);
    }
  }

  // Fallback: Local persistent storage key for offline or demo usage
  try {
    const storageCacheKey = `shilp_storage_${path.replace(/[^a-zA-Z0-9_]/g, '_')}`;
    localStorage.setItem(storageCacheKey, imageDataUrl.slice(0, 50000)); // cached preview snippet
  } catch (e) {
    // Ignore quota warnings
  }

  return imageDataUrl;
}

/**
 * Save product listing to Firestore 'products' collection.
 * Ensures both originalImageUrl and enhancedImageUrl are stored.
 */
export async function saveProductToFirestore(product: ProductListing): Promise<string> {
  const productDocData = {
    ...product,
    originalImageUrl: product.originalImageUrl || product.originalImage,
    enhancedImageUrl: product.enhancedImageUrl || product.enhancedImage,
    updatedAt: new Date().toISOString(),
  };

  if (db && isFirebaseConfigured()) {
    try {
      const productRef = doc(db, 'products', product.id);
      await setDoc(productRef, productDocData, { merge: true });
      return product.id;
    } catch (err) {
      console.warn('Firestore write failed, saving to local persistent storage:', err);
    }
  }

  // Local persistent storage fallback
  try {
    const existingStr = localStorage.getItem('shilp_ai_products');
    const existing: ProductListing[] = existingStr ? JSON.parse(existingStr) : INITIAL_PRODUCTS;
    const filtered = existing.filter(p => p.id !== product.id);
    const updated = [productDocData, ...filtered];
    localStorage.setItem('shilp_ai_products', JSON.stringify(updated));
  } catch (e) {
    console.warn('Local storage write warning:', e);
  }

  return product.id;
}

/**
 * Fetch all products from Firestore 'products' collection.
 * Falls back to local storage and craft presets if offline.
 */
export async function fetchProductsFromFirestore(): Promise<ProductListing[]> {
  if (db && isFirebaseConfigured()) {
    try {
      const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const firestoreProducts: ProductListing[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as ProductListing;
          firestoreProducts.push({
            ...data,
            id: docSnap.id,
            // Ensure enhanced image is prioritized for catalog display
            enhancedImage: data.enhancedImageUrl || data.enhancedImage,
            originalImage: data.originalImageUrl || data.originalImage,
          });
        });
        return firestoreProducts;
      }
    } catch (err) {
      console.warn('Firestore read failed, falling back to local products cache:', err);
    }
  }

  // Local storage fallback
  try {
    const saved = localStorage.getItem('shilp_ai_products');
    if (saved) {
      const parsed: ProductListing[] = JSON.parse(saved);
      return parsed.map(p => ({
        ...p,
        enhancedImage: p.enhancedImageUrl || p.enhancedImage,
        originalImage: p.originalImageUrl || p.originalImage,
      }));
    }
  } catch (e) {
    // Return presets
  }

  return INITIAL_PRODUCTS;
}
