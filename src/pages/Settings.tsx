import { IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToolbar, useIonRouter } from "@ionic/react";
import { personCircleOutline } from "ionicons/icons";

export default function Settings() {
    const nav = useIonRouter();
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color={"tertiary"}>
                    <IonTitle>
                        Settings
                    </IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen className="ion-padding-vertical">
                <IonList>
                    <IonItem button onClick={() => nav.push('/app/settings/users', 'forward', 'push')}>
                        <IonIcon size="large" icon={personCircleOutline}>

                        </IonIcon>
                        <IonLabel>Users</IonLabel>
                    </IonItem>
                </IonList>
            </IonContent>
        </IonPage>
    )
}