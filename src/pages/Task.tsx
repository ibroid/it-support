import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonPage, IonSpinner, IonText, IonTitle, IonToolbar, useIonToast } from "@ionic/react";
import { arrowBack } from "ionicons/icons";

import { useState } from "react";
import TaskList from "../components/TaskList";
import { ITaskResponse } from "../interfaces/IResponse";
import Pocketbase from "../utils/Pocketbase";
import "./global.css"

export function Task(props: { close: Function }) {

	const [toast] = useIonToast();
	const [loading, setLoading] = useState<boolean>(false);

	const checkOut = async (e: any, row: ITaskResponse) => {
		setLoading(true);
		const rec = Pocketbase.collection('status');
		try {
			if (!row.status?.id) {
				await rec.create({
					done: e.target.checked,
					tasks: row.id
				})
			} else {
				await rec.delete(row.status.id)
			}
			await toast({
				message: "Berhasil. ",
				position: "top",
				color: "success",
				duration: 2000
			})
		} catch (error: any) {
			await toast({
				message: "Terjadi kesalahan. " + error.message,
				position: "top",
				color: "danger",
				duration: 2000
			})
		}
		setLoading(false);
	}

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar color={"tertiary"}>
					<IonTitle>Task</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent className="ion-padding">
				<IonText className="ion-text-center">Rutinan Tiap Hari</IonText>
				{loading ? <IonSpinner /> : <TaskList checkOut={checkOut} />}
			</IonContent>
		</IonPage>
	)
}