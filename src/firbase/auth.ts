import { auth } from './firebase';
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import type { UserCredential } from 'firebase/auth';

export const doCreateUserWithEmailAndPassword = (
  email: string,
  password: string
): Promise<UserCredential> => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const doSignInWithEmailAndPassword = (
  email: string,
  password: string
): Promise<UserCredential> => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const doSignInWithGoogle = (): Promise<UserCredential> => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

export const doSignInWithGitHub = (): Promise<UserCredential> => {
  const provider = new GithubAuthProvider();
  return signInWithPopup(auth, provider);
};

export const doSignOut = (): Promise<void> => {
  return signOut(auth);
};

// export const doPasswordReset = (email:string) =>{
//     return auth.sendPasswordResetEmail(email);
// }

// export const doPasswordUpdate = (password:string) =>{
//     return auth.currentUser?.updatePassword(password);
// }

// export const doSendEmailVerification = () =>{
//     return auth.currentUser?.sendEmailVerification();
// }

// export const doSendPasswordResetEmail = (email:string) =>{
//     return auth.sendPasswordResetEmail(email);
// }

// export const doSendEmailVerification = () =>{
// }