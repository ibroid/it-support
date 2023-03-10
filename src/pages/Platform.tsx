import { IonAvatar, IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonImg, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList, IonLoading, IonModal, IonPage, IonRow, IonSpinner, IonText, IonThumbnail, IonTitle, IonToolbar, useIonActionSheet, useIonRouter, useIonToast, useIonViewDidEnter } from '@ionic/react';

import { pencilOutline, trashOutline, logInOutline, add, trashBinOutline, close } from 'ionicons/icons';
import Pocketbase from '../utils/Pocketbase';
import { useCallback, useEffect, useState } from 'react';
import { IPlatformResponse } from '../interfaces/IResponse';
import AddPlatform from '../components/FormPlatform';

const Platform: React.FC = () => {

	const [plaformList, setPlatformList] = useState<any[]>([])
	const [toast] = useIonToast();
	const [actionSheet] = useIonActionSheet();
	const [refetch, setRefetch] = useState<number>(0);
	const [isModal, setIsModal] = useState<boolean>(false);
	const [selectedItem, setSelectedItem] = useState<IPlatformResponse>();
	const [loading, setLoading] = useState<boolean>(false);
	const nav = useIonRouter();

	const init = useCallback(async function () {
		try {
			const records = await Pocketbase.collection('platform').getFullList()
			setPlatformList(records);
		} catch (error: any) {
			if (error.status !== 0) toast({
				message: "Terjadi kesalahan. " + error.message,
				position: "top",
				color: "danger",
				duration: 2000
			})
		}
		setLoading(false);
	}, [])

	useEffect(() => {
		setLoading(true);

		init();

		return () => {
			setPlatformList([]);
			setSelectedItem({ address: '', collectionId: '', collectionName: '', created: '', icon: '', id: '', name: '', updated: '' })
		}
	}, [refetch, init, toast]);

	const afterAddItem = () => {
		setIsModal(false);
		setRefetch(prev => prev + 1);
	}

	const deleteItem = (id: string): Promise<void> => {
		return actionSheet({
			header: 'Apa anda yakin ?',
			buttons: [
				{
					text: 'Hapus',
					icon: trashBinOutline,
					handler() {
						Pocketbase.collection('platform').delete(id)
							.then((val) => {
								toast({
									message: 'Berhasil dihapus',
									position: 'top',
									color: 'success',
									duration: 2000
								})
							})
							.catch((err) => {
								toast({
									message: 'Terjadi kesalahan.' + err.message,
									position: 'top',
									color: 'danger',
									duration: 2000
								})
							})
							.finally(() => {
								setRefetch(prev => prev + 1);
							})
					},
				},
				{
					text: 'Batal',
					role: 'cancel'
				}
			]
		});
	}

	const editItem = (data: IPlatformResponse) => {
		setIsModal(true);
		setSelectedItem(data);
	}

	return (
		<IonPage>
			<IonHeader >
				<IonToolbar color={'tertiary'}>
					<IonTitle>Home</IonTitle>
					<IonButtons slot='end'>
						<IonButton shape={"round"} onClick={() => setIsModal(true)}>
							<IonIcon size='large' icon={add}></IonIcon>
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen>
				<div className='ion-padding'>
					<IonText>Platform List</IonText>
				</div>
				{loading ? <IonSpinner style={{
					display: 'block',
					margin: 'auto'
				}} /> : (
					<IonList>
						{plaformList.map((row: IPlatformResponse, i) => {
							return <IonItemSliding key={++i}>
								<IonItemOptions side={"start"}>
									<IonItemOption onClick={() => nav.push(`/app/platform/${row.id}/credential`, 'forward', 'pop')} color={"success"}>
										<IonIcon slot={"icon-only"} icon={logInOutline}></IonIcon>
									</IonItemOption>
								</IonItemOptions>

								<IonItem>
									<IonAvatar>
										<IonImg src={`${process.env.REACT_APP_POCKETBASE_URL}/api/files/${row.collectionId}/${row.id}/${row.icon}`} />
									</IonAvatar>
									<IonLabel className='ion-padding-horizontal'>{row.name}</IonLabel>
									<p>{row.address}</p>
								</IonItem>

								<IonItemOptions side='end'>
									<IonItemOption onClick={() => editItem(row)}>
										<IonIcon slot={"icon-only"} icon={pencilOutline}></IonIcon>
									</IonItemOption>
									<IonItemOption onClick={() => deleteItem(row.id)} className='ion-justify-content-between' color={"danger"}>
										<IonIcon slot={"icon-only"} icon={trashOutline}></IonIcon>
									</IonItemOption>
								</IonItemOptions>
							</IonItemSliding>
						})}
					</IonList>
				)}
				<IonModal isOpen={isModal}>
					<IonHeader>
						<IonToolbar color={"tertiary"}>
							<IonTitle>Tambah Platform</IonTitle>
							<IonButtons slot="end">
								<IonButton onClick={() => {
									setIsModal(false);
									setSelectedItem({ address: '', collectionId: '', collectionName: '', created: '', icon: '', id: '', name: '', updated: '' });
								}}>
									<IonIcon slot='icon-only' icon={close} />
								</IonButton>
							</IonButtons>
						</IonToolbar>
					</IonHeader>
					<AddPlatform afterAdd={afterAddItem} item={selectedItem} />
				</IonModal>
			</IonContent>
		</IonPage>
	);
};

export default Platform;
