import React, { useState } from "react";
import {
  IonPage,
  IonContent,
  IonImg,
  IonIcon,
  IonButton,
  IonGrid,
  IonCol,
  IonRow,
  IonItem,
  IonInput,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import { chevronBackOutline } from "ionicons/icons";
import { useStoreState } from "pullstate";
import { userStore } from "../../../store/userStore";

const Signup = () => {
  // Add your component's state and other initializations here
    const history = useHistory();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const isAuthorized = useStoreState(userStore, (state) => state.isAuth);
  return (
    <IonPage>
      <IonContent className="char-bg content-div">
        <div className="flex justify-end p-2">

          <IonButton fill="clear" onClick={() => history.push("/signin")}>
            <p className="text-white font-bold">Sign In</p>
          </IonButton>
        </div>
        <IonGrid>
          <IonRow>
            <IonCol>
              <h1>Sign up</h1>
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
              <IonItem>
                <IonInput
                  label="Password"
                  labelPlacement="floating"
                  type="password"
                  placeholder="Repeat password"
                ></IonInput>
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonButton
              expand="block"
                onClick={() => {
                  history.push("/signin");
                }}
              >
                Sign up
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Signup;
