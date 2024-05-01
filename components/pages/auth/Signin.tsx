import React, { useState } from "react";
import {
  IonPage,
  IonContent,
  IonButton,
  IonGrid,
  IonCol,
  IonRow,
  IonItem,
  IonInput,
  useIonRouter,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import { useStoreState } from "pullstate";
import { userStore } from "../../../store/userStore";

const SingIn = () => {
  // Add your component's state and other initializations here
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isAuthorized = useStoreState(userStore, (state) => state.isAuth);
  const router = useIonRouter()
  const handleSignIn = () => {
    // Add your sign in logic here
    // You can use the state variables to access the user's email and password
    // You can use the setError function to display an error message to the user
    // You can use the setLoading function to show a loading indicator while the user is being signed in
    // You can use the history object to navigate to another page after the user has been signed in
    userStore.update((s) => {
      s.isAuth = true;
    });
    router.push('/gifs', 'forward', 'replace')
    console.log("User signed in");
  };
  return (
    <IonPage>
      <IonContent className="char-bg content-div">
        <div className="flex justify-end p-2">
          <IonButton fill="clear" onClick={() => history.push("/signup")}>
            <p className="text-white font-bold">Sign up</p>
          </IonButton>
        </div>
        <IonGrid>
          <IonRow>
            <IonCol>
              <h1>Sign In</h1>
              {/* Add more JSX elements as needed */}
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonButton
                onClick={() => {
                  history.push("/character-select");
                }}
              >
                G with google
              </IonButton>
            </IonCol>
            <IonCol>
              <IonButton
                onClick={() => {
                  history.push("/signin");
                }}
              >
                F
              </IonButton>
            </IonCol>
            <IonCol>
              <IonButton
                onClick={() => {
                  history.push("/signin");
                }}
              >
                T
              </IonButton>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>Or with Email</IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonItem>
                <IonInput
                  label="Email"
                  labelPlacement="floating"
                  placeholder="Enter email"
                ></IonInput>
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonItem>
                <IonInput
                  label="Password"
                  labelPlacement="floating"
                  type="password"
                  placeholder="Choose password"
                ></IonInput>
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonButton expand="block" onClick={handleSignIn}>
                Sign In
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default SingIn;
