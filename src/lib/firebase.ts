import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut as fbSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  onSnapshot,
  query,
  getDocs,
  deleteDoc,
  Timestamp,
  serverTimestamp,
  addDoc
} from 'firebase/firestore';
import { 
  UserProfile, 
  AppSettings, 
  LetterItem, 
  NumberItem, 
  ColorItem, 
  AnimalItem, 
  FruitItem, 
  ShapeItem, 
  BodyPartItem, 
  WordItem, 
  SentenceItem, 
  StoryItem, 
  SongItem, 
  GameDefinition 
} from '../types';

// Import config
import firebaseConfigData from '../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: firebaseConfigData.apiKey,
  authDomain: firebaseConfigData.authDomain,
  projectId: firebaseConfigData.projectId,
  storageBucket: firebaseConfigData.storageBucket,
  messagingSenderId: firebaseConfigData.messagingSenderId,
  appId: firebaseConfigData.appId
};

// Initialize Firebase safely
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

// Use named database if defined in config, otherwise default
const databaseId = firebaseConfigData.firestoreDatabaseId && firebaseConfigData.firestoreDatabaseId !== '(default)'
  ? firebaseConfigData.firestoreDatabaseId 
  : undefined;

export const db = databaseId ? getFirestore(app, databaseId) : getFirestore(app);

export const SUPER_ADMIN_EMAIL = 'larblaablaybla@gmail.com';

export function isSuperAdmin(email?: string | null): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  return errInfo;
}

// ==================== AUTHENTICATION (EMAIL & PASSWORD ONLY) ====================

// Sign Up with Email and Password
export async function signUpWithEmail(email: string, pass: string, childName: string = 'البطل'): Promise<UserProfile> {
  const normalizedEmail = email.trim().toLowerCase();
  const credential = await createUserWithEmailAndPassword(auth, normalizedEmail, pass);
  const user = credential.user;
  const isSuper = isSuperAdmin(normalizedEmail);

  const initialProfile: UserProfile = {
    uid: user.uid,
    email: normalizedEmail,
    displayName: childName,
    childName: childName,
    childAge: 4,
    childAvatar: isSuper ? '👑' : '🧒',
    role: isSuper ? 'super_admin' : 'user',
    isPremium: isSuper ? true : false,
    totalStars: isSuper ? 999 : 20,
    points: isSuper ? 5000 : 100,
    level: 1,
    learnedLetters: ['A', 'B'],
    learnedNumbers: ['1', '2'],
    completedGames: [],
    completedLessons: [],
    dailyStreak: 1,
    parentSettings: {
      pin: '1234',
      dailyLimitMinutes: 45,
      soundEnabled: true
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  await saveUserProfile(initialProfile);
  return initialProfile;
}

// Sign In with Email and Password
export async function signInWithEmail(email: string, pass: string): Promise<FirebaseUser> {
  const normalizedEmail = email.trim().toLowerCase();
  const credential = await signInWithEmailAndPassword(auth, normalizedEmail, pass);
  return credential.user;
}

// Send Password Reset Email
export async function sendResetPassword(email: string): Promise<void> {
  const normalizedEmail = email.trim().toLowerCase();
  await sendPasswordResetEmail(auth, normalizedEmail);
}

// Sign Out
export async function signOutUser(): Promise<void> {
  await fbSignOut(auth);
}

// ==================== USER PROFILES & STATS ====================

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const path = `users/${uid}`;
  try {
    const userDocRef = doc(db, 'users', uid);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
  }
  return null;
}

export async function saveUserProfile(profile: UserProfile): Promise<void> {
  const path = `users/${profile.uid}`;
  try {
    const isSuper = isSuperAdmin(profile.email);
    const userDocRef = doc(db, 'users', profile.uid);
    await setDoc(userDocRef, {
      ...profile,
      role: isSuper ? 'super_admin' : profile.role,
      isPremium: isSuper ? true : profile.isPremium,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

// Admin: Get all users from Firestore
export async function getAllUsersFromFirestore(): Promise<UserProfile[]> {
  const path = 'users';
  try {
    const snap = await getDocs(collection(db, 'users'));
    const list: UserProfile[] = [];
    snap.forEach((d) => {
      list.push(d.data() as UserProfile);
    });
    return list;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
    return [];
  }
}

// Admin: Update user status or role
export async function adminUpdateUser(uid: string, updates: Partial<UserProfile>): Promise<void> {
  const path = `users/${uid}`;
  try {
    const userDocRef = doc(db, 'users', uid);
    await updateDoc(userDocRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}

// ==================== CONTENT CRUD OPERATIONS (FIRESTORE) ====================

// Add Item
export async function addFirestoreContent(collectionName: string, item: any): Promise<string> {
  const path = collectionName;
  try {
    const colRef = collection(db, collectionName);
    const docRef = await addDoc(colRef, {
      ...item,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
    throw err;
  }
}

// Update Item
export async function updateFirestoreContent(collectionName: string, docId: string, updates: any): Promise<void> {
  const path = `${collectionName}/${docId}`;
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
    throw err;
  }
}

// Delete Item (Real Firestore Deletion)
export async function deleteFirestoreContent(collectionName: string, docId: string): Promise<void> {
  const path = `${collectionName}/${docId}`;
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
    throw err;
  }
}

// Save Game Result to user history
export async function saveGameResult(uid: string, resultData: {
  gameId: string;
  gameTitle: string;
  difficulty: string;
  score: number;
  correctAnswers: number;
  wrongAnswers: number;
  starsEarned: number;
  pointsEarned: number;
}): Promise<void> {
  const path = `users/${uid}/gameResults`;
  try {
    const colRef = collection(db, 'users', uid, 'gameResults');
    await addDoc(colRef, {
      ...resultData,
      playedAt: new Date().toISOString()
    });
  } catch (err) {
    console.warn('Could not save game result to Firestore subcollection:', err);
  }
}


