import { auth, db } from '../firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  query,
  where,
  QueryConstraint
} from 'firebase/firestore';

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
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
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
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Helper functions for common operations
export const getDocuments = async <T>(collectionPath: string, ...queryConstraints: QueryConstraint[]): Promise<T[]> => {
  try {
    const q = query(collection(db, collectionPath), ...queryConstraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, collectionPath);
    return [];
  }
};

export const getDocument = async <T>(collectionPath: string, docId: string): Promise<T | null> => {
  try {
    const docRef = doc(db, collectionPath, docId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `${collectionPath}/${docId}`);
    return null;
  }
};

export const createDocument = async <T extends object>(collectionPath: string, data: T, docId?: string): Promise<string> => {
  try {
    if (docId) {
      await setDoc(doc(db, collectionPath, docId), data);
      return docId;
    } else {
      const docRef = await addDoc(collection(db, collectionPath), data);
      return docRef.id;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, collectionPath);
    return '';
  }
};

export const updateDocument = async <T extends object>(collectionPath: string, docId: string, data: Partial<T>): Promise<void> => {
  try {
    const docRef = doc(db, collectionPath, docId);
    await updateDoc(docRef, data as any);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${collectionPath}/${docId}`);
  }
};

export const subscribeToCollection = <T>(
  collectionPath: string, 
  callback: (data: T[]) => void,
  ...queryConstraints: QueryConstraint[]
) => {
  const q = query(collection(db, collectionPath), ...queryConstraints);
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as T));
    callback(data);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, collectionPath);
  });
};
