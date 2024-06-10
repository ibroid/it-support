import { IonAvatar, IonButtons, IonChip, IonHeader, IonIcon, IonImg, IonLabel, IonTitle, IonToolbar } from "@ionic/react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { imgBaseUrl } from "../utils/Helper";

export default function DefaultHeader({ title, leftButton }:
	{ title: string, leftButton?: Function }) {
	const { state } = useContext(AuthContext);
	return (
		<IonHeader>
			<IonToolbar color={'tertiary'}>
				<IonTitle>{title}</IonTitle>
				<IonButtons slot="start">
					<IonChip>
						<IonAvatar >
							<IonImg src={imgBaseUrl({
								collectionId: state.user.collectionId,
								id: state.user.id
							}, state.user.avatar)} />
						</IonAvatar>
						<IonLabel color={"light"}>{state.user.name}</IonLabel>
					</IonChip>
				</IonButtons>
				<IonButtons slot="end">
					{leftButton ? leftButton() : <></>}
				</IonButtons>
			</IonToolbar>
		</IonHeader>
	)

} 