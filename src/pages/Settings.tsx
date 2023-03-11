import { IonButton, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToolbar, useIonRouter } from "@ionic/react";
import { logOutOutline, personCircleOutline } from "ionicons/icons";
import { useContext } from "react";
import DefaultHeader from "../components/DefaultHeader";
import { AuthContext } from "../context/AuthContext";

export default function Settings() {
    const nav = useIonRouter();
    const { deState } = useContext(AuthContext);
    return (
        <IonPage>
            <DefaultHeader title="Settings" />
            <IonContent fullscreen className="ion-padding-vertical">
                <IonList>
                    <IonItem button onClick={() => nav.push('/app/settings/users', 'forward', 'push')}>
                        <IonIcon size="large" icon={personCircleOutline}>

                        </IonIcon>
                        <IonLabel>Users</IonLabel>
                    </IonItem>
                </IonList>
                <IonButton
                    onClick={() => {
                        deState.logout();
                        nav.push('/', 'root', 'replace');
                    }}
                    expand="block" color={"danger"} className="ion-margin">
                    <IonIcon icon={logOutOutline} />
                    Logout
                </IonButton>
            </IonContent>
        </IonPage >
    )
}