import { IonFab, IonFabButton, IonImg, IonModal } from "@ionic/react";
import { useCallback, useState } from "react";
import { useLocation } from "react-router";
import { Task } from "../pages/Task";

export default function MiddleFab() {
	const loc = useLocation();
	const [isOpen, setIsOpen] = useState(false);

	const closeModal = useCallback(() => {
		setIsOpen(false)
	}, [])

	if (loc.pathname !== '/') {
		return (
			<>
				<IonFab vertical="bottom" horizontal="center" slot="fixed">
					<IonFabButton onClick={() => setIsOpen(true)}>
						<IonImg src="/assets/icon/swap.png" alt="Transfer"></IonImg>
					</IonFabButton>
				</IonFab>
				<IonModal isOpen={isOpen}>
					<Task close={closeModal} />
				</IonModal>
			</>
		)
	}
	return <></>;
}