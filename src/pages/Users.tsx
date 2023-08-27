import { IonAvatar, IonBackButton, IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonItemSliding, IonLabel, IonList, IonPage, IonRow, IonText, IonTitle, IonToolbar, useIonToast } from "@ionic/react";
import { cameraOutline, saveOutline } from "ionicons/icons";
import { useCallback, useEffect, useState } from "react";
import Pocketbase from "../utils/Pocketbase";
import { IUserResponse } from "../interfaces/IResponse";
import { imgBaseUrl } from "../utils/Helper";
import { Camera, CameraResultType } from "@capacitor/camera";
import { useForm } from "react-hook-form";

interface IFormInput extends IUserResponse {
	password: string
}

export default function Users() {

	const [toast] = useIonToast();
	const [users, setUsers] = useState<any[]>([]);
	const [imagePath, setImagePath] = useState<string>('');
	const { register, handleSubmit, resetField } = useForm<IFormInput>();

	const takePhotos = useCallback(async () => {
		const image = await Camera.getPhoto({
			quality: 90,
			allowEditing: true,
			resultType: CameraResultType.Uri
		});
		setImagePath(image.webPath || image.path || '');
	}
		, [])

	const userFetch = useCallback(async () => {
		try {
			const records = await Pocketbase.collection('users').getFullList();
			setUsers(records);
		} catch (error: any) {
			if (error.status !== 0) {
				toast({
					message: 'Terjadi Kesalahan. ' + error.message,
					position: 'top',
					color: 'danger',
					duration: 2000
				})
			}
		}
	}, []);

	const SaveItem = async (data: IFormInput) => {
		try {
			const body = new FormData();
			if (imagePath) {
				const blobImg = await fetch(imagePath).then(res => res.blob());
				body.append('avatar', blobImg);
			}
			body.append("username", data.username)
			body.append("password", data.password)
			body.append("passwordConfirm", data.password)
			body.append("email", data.email)
			body.append("emailVisibility", 'true')
			body.append("name", data.name)
			const record = await Pocketbase.collection('users').create(body)
			setUsers(prev => [...prev, record]);
			toast({
				message: 'Berhasil',
				position: 'top',
				color: 'success',
				duration: 2000
			})
			resetField("username")
			resetField("password")
			resetField("name")
			resetField("email")
			setImagePath('')
		} catch (error: any) {
			toast({
				message: 'Terjadi Kesalahan. ' + error.message,
				position: 'top',
				color: 'danger',
				duration: 2000
			})
		}

	}

	useEffect(() => {
		userFetch();

		return () => {
			setUsers([]);
			setImagePath('')
		}
	}, [userFetch, takePhotos, toast])

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar color={"tertiary"}>
					<IonButtons>
						<IonBackButton defaultHref="/app/settings" />
					</IonButtons>
					<IonTitle>
						User Setting
					</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent className="ion-padding-vertical" fullscreen>
				<IonGrid>
					<IonRow>
						<IonCol className="ion-no-padding ion-no-margin">
							<IonText className="ion-text-center ion-no-padding">
								<p>Form User</p>
							</IonText>
						</IonCol>
					</IonRow>
				</IonGrid>
				<form onSubmit={handleSubmit(SaveItem)}>
					<IonList>
						<IonItem>
							<IonLabel position="stacked">Nama</IonLabel>
							<IonInput {...register("name", { required: true })} placeholder="Nama Asli" />
						</IonItem>
						<IonItem>
							<IonLabel position="stacked">Username</IonLabel>
							<IonInput {...register("username", { required: true })} placeholder="Username Untuk Login" />
						</IonItem>
						<IonItem>
							<IonLabel position="stacked">Email</IonLabel>
							<IonInput type="email" {...register("email", { required: true })} placeholder="Email Untuk Login" />
						</IonItem>
						<IonItem>
							<IonLabel position="stacked">Password</IonLabel>
							<IonInput {...register("password", { required: true })} placeholder="Password" />
						</IonItem>
						<IonItem>
							<IonLabel position="stacked">Avatar</IonLabel>
							<IonButton onClick={takePhotos} color={"secondary"}>
								<IonIcon className="ion-margin-end" icon={cameraOutline} />
								Ambil Foto</IonButton>
							<IonAvatar slot="end" >
								<IonImg src={imagePath} alt="avatar" />
							</IonAvatar>
						</IonItem>
					</IonList>
					<div className="ion-padding">
						<IonButton type="submit" expand="block" color={"success"}>
							<IonIcon className="ion-margin-end" icon={saveOutline} />
							Simpan
						</IonButton>
					</div>
				</form>
				<IonGrid>
					<IonRow>
						<IonCol className="ion-no-padding ion-no-margin">
							<IonText className="ion-text-center ion-no-padding">
								<p>Daftar User</p>
							</IonText>
						</IonCol>
					</IonRow>
				</IonGrid>
				<IonList>
					{users.map((row: IUserResponse) => (
						<IonItemSliding key={row.id}>
							<IonItem>
								<IonAvatar>
									<IonImg src={imgBaseUrl({
										collectionId: row.collectionId,
										id: row.id
									}, row.avatar)}></IonImg>
								</IonAvatar>
								<IonLabel className="ion-margin-start">{row.name}</IonLabel>
								<IonText>{row.email}</IonText>
							</IonItem>
						</IonItemSliding>
					))}
				</IonList>
			</IonContent>
		</IonPage>
	)
}