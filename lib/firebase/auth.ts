import firebase_app from "./config";
import { createUserWithEmailAndPassword,signInWithEmailAndPassword,signInWithCredential, getAuth , signInWithPopup,GoogleAuthProvider } from "firebase/auth";

const auth = getAuth(firebase_app);


export async function signUp(email:string, password: string) {
    let result = null,
        error = null;
    try {
        result = await createUserWithEmailAndPassword(auth, email, password);
    } catch (e) {
        error = e;
    }

    return { result, error };
}

export default async function signIn(email:string, password:string) {
    let result = null,
        error = null;
    try {
        result = await signInWithEmailAndPassword(auth, email, password);
    } catch (e) {
        error = e;
    }

    return { result, error };
}

export const signInWithGoogle = async () => {
  try {
    // Attempt to sign in with popup and Google provider
    const result = await signInWithPopup(auth, new GoogleAuthProvider());

    // Retrieve the ID token
    const token = await result.user.getIdToken();
    console.log(token); // Log the ID token

    // Retrieve the access token from the Google Auth provider
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const accessToken = credential?.accessToken;

    // Retrieve the signed-in user info
    const user = result.user;

    // Optionally, access additional identity provider data
    // const additionalUserInfo = getAdditionalUserInfo(result);

    // Return a summary of the user login
    return {
      user,
      token,
      accessToken,
      // additionalUserInfo,
    };
  } catch (error) {
    // Handle errors here
    console.error('Error during Google sign-in:', error);
    return {
      error
    };
  }


  
};

export async function authenticateWithFirebase(googleIdToken : string ) {
    const credential = GoogleAuthProvider.credential(googleIdToken);
  
    try {
      const firebaseUserCredential = await signInWithCredential(auth, credential);
      console.log('Firebase Auth successful, user:', firebaseUserCredential.user);
      // Now you can get the Firebase ID token which you might send to your server
      const firebaseIdToken = await firebaseUserCredential.user.getIdToken();
      console.log('Firebase ID token:', firebaseIdToken);
      return firebaseIdToken;
    } catch (error) {
      console.error('Error authenticating with Firebase:', error);
      throw error;
    }
  }