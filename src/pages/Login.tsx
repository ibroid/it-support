import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, useIonRouter } from "@ionic/react";
import * as React from "react";

export default function Login() {

    const nav = useIonRouter()

    const doLogin = () => {
        nav.push('/app', 'root', 'replace');
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Login</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonButton className="ion-padding" expand="full" onClick={doLogin}>Login</IonButton>
            </IonContent>
        </IonPage>
    )
}