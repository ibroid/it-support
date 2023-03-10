import { IonButton, IonContent, IonImg, IonInput, IonItem, IonLabel, IonList, IonNote, IonThumbnail, useIonToast, useIonViewDidEnter } from "@ionic/react";

import { arrowBack } from "ionicons/icons";
import Pocketbase from "../utils/Pocketbase";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { IPlatformResponse } from "../interfaces/IResponse";

interface ChildProps {
	afterAdd: Function,
	item?: IPlatformResponse
}

export default function FormPlatform(props: ChildProps) {
	type FormInput = {
		name: string;
		address: string;
	}
	const [toast] = useIonToast();
	const [file, setFile] = useState<File>();

	const { register, handleSubmit, formState: { errors }, resetField } = useForm<FormInput>({
		values: {
			name: props.item?.name ?? '',
			address: props.item?.address ?? ''
		}
	})

	const saveData = async (data: FormInput) => {
		const formData = new FormData()
		if (file) {
			formData.append('icon', file);
		}
		formData.append('name', data.name);
		formData.append('address', data.address);

		try {
			const record = Pocketbase.collection('platform')
			if (props.item?.id) {
				await record.update(props.item?.id, formData);
			} else {
				await record.create(formData);
			}

			toast({
				message: 'Berhasil',
				position: 'top',
				duration: 2000,
				color: 'success'
			})
		} catch (error: any) {
			let errMessage = '';
			if (error.data.data.address) {
				errMessage += `Alamat :${error.data.data.address.message}. `;
			}
			if (error.data.data.icon) {
				errMessage += `Icon : ${error.data.data.icon.message}. `;
			}
			if (error.data.data.name) {
				errMessage += `Platform : ${error.data.data.name.message}. `;
			}

			toast({
				message: 'Terjadi kesalahan. ' + errMessage,
				position: 'top',
				duration: 2000,
				color: 'danger'
			})
		}
		resetField('name')
		resetField('address')
		props.afterAdd()
	}

	return (
		<IonContent>
			<form onSubmit={handleSubmit(saveData)}>
				<IonList className="ion-padding">
					<IonItem>
						<IonLabel position={"stacked"}>Nama Platform :</IonLabel>
						<IonInput {...register('name', { required: 'Nama Harus di Isi' })} placeholder="e.g Ubuntu, Github"></IonInput>
						<IonNote slot="helper">{errors.name?.message}</IonNote>
					</IonItem>
					<IonItem>
						<IonLabel position={"stacked"}>Alamat Platform :</IonLabel>
						<IonInput {...register('address', { required: 'Alamat Harus di Isi' })} placeholder="e.g IP, Link"></IonInput>
						<IonNote slot="helper">{errors.address?.message}</IonNote>
					</IonItem>
					<IonItem>
						{props.item?.icon ? (<IonThumbnail>
							<IonImg src={`${process.env.REACT_APP_POCKETBASE_URL}/api/files/${props.item?.collectionId}/${props.item?.id}/${props.item?.icon}`} />
						</IonThumbnail>) : ''}

						<IonLabel>Icon</IonLabel>
					</IonItem>
					<IonItem>
						<input onChange={(e: any) => {
							setFile(e.target.files[0]);
						}} type="file" name="icon" />
					</IonItem>
					<IonButton type="submit" expand={"block"} className="ion-margin-top">Simpan</IonButton>
				</IonList>
			</form>
		</IonContent>
	)
}