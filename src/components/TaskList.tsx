import { IonList, IonItem, IonIcon, IonCol, IonLabel, IonText, IonCheckbox, useIonToast } from "@ionic/react"
import { checkmarkCircleOutline, closeCircleOutline } from "ionicons/icons"
import moment from "moment"
import { useEffect, useState } from "react"
import { ITaskResponse } from "../interfaces/IResponse"
import Pocketbase from "../utils/Pocketbase"

interface ChildProps {
	checkOut: Function
}

export default function TaskList(props: ChildProps) {
	const [taskList, setTaskList] = useState<any[]>([]);
	const [statusList, setStatusTaskList] = useState<any[]>([]);
	const [toast] = useIonToast();
	const [ref, setRef] = useState<number>(0);

	useEffect(() => {
		(async function init() {
			try {
				const records = await Pocketbase.collection('tasks').getFullList();

				const status = await Pocketbase.collection('status').getFullList({ filter: `created>='${moment(new Date()).locale('id').format('Y-MM-DD 00:00:00')}'` });

				setTaskList(records);
				setStatusTaskList(status);

			} catch (error: any) {
				if (error.status !== 0) {
					await toast({
						message: "Terjadi kesalahan. " + error.message,
						position: "top",
						color: "danger",
						duration: 2000
					})
				}
			}
		})()

		return () => {
			setTaskList([])
			setStatusTaskList([])
		}
	}, [ref]);

	return (
		<IonList>
			{taskList.map((row: ITaskResponse) => {
				row.status = statusList.find((col) => col.tasks === row.id)
				return <IonItem key={row.id}>
					<IonIcon
						color={row.status ? "success" : "danger"}
						className="ion-margin-end"
						icon={row.status ? checkmarkCircleOutline : closeCircleOutline} />
					<IonCol className="ion-no-margin">
						<IonLabel>{row.todo}</IonLabel>
						<IonText>{moment(row.status?.created).locale('id').fromNow()}</IonText>
					</IonCol>
					<IonCheckbox defaultChecked={row.status?.done} onIonChange={(e) => props.checkOut(e, row)} checked={row.status?.done} />
				</IonItem>
			})}
		</IonList>
	)
}