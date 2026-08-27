import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  updateProfile as firebaseUpdateProfile,
} from 'firebase/auth';
import { auth } from '../config/firebase';
import api from './api';

export const signIn = async (email, password) => {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  const token = await credential.user.getIdToken();
  localStorage.setItem('authToken', token);
  return credential.user;
};

export const signUp = async (email, password, displayName) => {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName) {
    await firebaseUpdateProfile(credential.user, { displayName });
  }
  const token = await credential.user.getIdToken();
  localStorage.setItem('authToken', token);
  try {
    await api.put('/auth/profile', { displayName });
  } catch {
    // Non-critical: profile sync failure doesn't block registration
  }
  return credential.user;
};

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const credential = await signInWithPopup(auth, provider);
  const token = await credential.user.getIdToken();
  localStorage.setItem('authToken', token);
  try {
    await api.put('/auth/profile', { displayName: credential.user.displayName });
  } catch {
    // Non-critical
  }
  return credential.user;
};

export const signOut = async () => {
  await firebaseSignOut(auth);
  localStorage.removeItem('authToken');
};

export const verifyUser = async () => {
  const response = await api.get('/auth/verify');
  return response.data;
};

export const getUserProfile = async () => {
  const response = await api.get('/auth/profile');
  return response.data;
};

export const updateUserProfile = async (profileData) => {
  const response = await api.put('/auth/profile', profileData);
  return response.data;
};
