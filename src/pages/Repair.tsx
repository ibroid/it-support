import { IonAvatar, IonBadge, IonButton, IonButtons, IonCard, IonCardContent, IonChip, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList, IonModal, IonPage, IonRow, IonSelect, IonSelectOption, IonText, IonTextarea, IonThumbnail, IonTitle, IonToolbar, useIonActionSheet, useIonToast } from "@ionic/react";
import { add, bagHandle, cafe, camera, close, hammerOutline, musicalNotes, pencilOutline, personOutline, print, printOutline, saveOutline, trashBinOutline, tvOutline } from "ionicons/icons";
import { useEffect, useState } from "react";
import { Camera, CameraResultType } from '@capacitor/camera';
import { Controller, useForm } from "react-hook-form";
import Pocketbase from "../utils/Pocketbase";
import { IRepairResponse } from "../interfaces/IResponse";
import { format, formatDistanceToNow, parseISO } from "date-fns"
import { id } from 'date-fns/locale';
import "./global.css"
import { iconRepair, imgBaseUrl } from "../utils/Helper";
import DefaultHeader from "../components/DefaultHeader";

type IFormInputs = {
	jenis: string;
	operator: string;
	pengguna: string;
	catatan: string;
	status: string
}

export default function Repair() {

	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [imagePath, setImagePath] = useState<string>('');
	const [repairList, setRepairList] = useState<any[]>([]);
	const [refetch, setRefetch] = useState<number>(0);
	const [actionSheet] = useIonActionSheet();
	const [toast] = useIonToast();
	const [selectedItem, setSelectedItem] = useState<IRepairResponse>()

	const { register, handleSubmit, resetField, formState: { errors } } = useForm<IFormInputs>({
		values: {
			jenis: selectedItem?.jenis ?? '',
			operator: selectedItem?.operator ?? '',
			catatan: selectedItem?.catatan ?? '',
			pengguna: selectedItem?.pengguna ?? '',
			status: selectedItem?.status ?? '',
		}
	});

	useEffect(() => {
		(async function init() {
			try {
				const records = await Pocketbase.collection('repair').getFullList();
				setRepairList(records);
			} catch (error: any) {
				if (error.status !== 0) {
					toast({
						message: 'Terjadi kesalahan. ' + error.message,
						position: 'top',
						duration: 2000,
						color: 'danger'
					})
				}
			}
		})()

		return () => {
			setRepairList([]);
			closeModal()
		}
	}, [refetch, toast])

	const takePhotos = async () => {
		const image = await Camera.getPhoto({
			quality: 90,
			allowEditing: true,
			resultType: CameraResultType.Uri
		});
		console.log(image)
		setImagePath(image.webPath || image.path || '');
	}

	function closeModal() {
		setIsOpen(false);
		setImagePath('');
		resetField('catatan')
		resetField('jenis')
		resetField('operator')
		resetField('pengguna')
		resetField('status')
		setSelectedItem(undefined);
	}

	const saveItem = async (data: IFormInputs) => {
		const body = new FormData();
		if (imagePath) {
			const blobImg = await fetch(imagePath).then(res => res.blob());
			body.append('foto', blobImg);
		}
		body.append('catatan', data.catatan)
		body.append('jenis', data.jenis)
		body.append('operator', data.operator)
		body.append('pengguna', data.pengguna)
		body.append('status', data.status)

		try {

			const record = Pocketbase.collection('repair')
			if (!selectedItem?.id) {
				await record.create(body);
			} else {
				await record.update(selectedItem?.id, body);
			}
			toast({
				message: 'Berhasil',
				position: 'top',
				duration: 2000,
				color: 'success'
			})
		} catch (error: any) {
			toast({
				message: 'Terjadi kesalahan. ' + error.message,
				position: 'top',
				duration: 2000,
				color: 'danger'
			})
		}
		closeModal();
		setRefetch(prev => prev + 1);
	}

	function openOption(data: IRepairResponse) {
		actionSheet([
			{
				text: 'Batal',
				role: 'cancel'
			},
			{
				text: 'Edit',
				icon: pencilOutline,
				handler() {
					setSelectedItem(data)
					setIsOpen(true)
				},
			},
			{
				text: 'Hapus',
				icon: trashBinOutline,
				async handler() {
					try {
						await Pocketbase.collection('repair').delete(data.id);
						toast({
							message: 'Berhasil',
							position: 'top',
							duration: 2000,
							color: 'success'
						})
					} catch (error: any) {
						toast({
							message: 'Terjadi kesalahan. ' + error.message,
							position: 'top',
							duration: 2000,
							color: 'danger'
						})
					}
					setRefetch(prev => prev + 1);
				},
			},
		])
	}

	return (
		<IonPage>
			<DefaultHeader title="Repair" leftButton={
				() => (
					<IonButton onClick={() => setIsOpen(true)}>
						<IonIcon size='large' icon={add} />
					</IonButton>
				)
			} />
			<IonContent className="ion-padding">
				<div id="P9SIgntEkYBufhuledH9">
					<IonGrid className="ion-no-padding">
						<IonRow>
							<IonCol size="12">
								<IonCard className="card">
									<IonCardContent className="ion-padding-vertical ion-no-padding">
										<IonLabel className="ion-padding-horizontal">
											<span className="title">Daftar Perbaikan</span>
										</IonLabel>
										{repairList.map((row: IRepairResponse) => (
											<IonItem onClick={() => openOption(row)} key={row.id} className="" lines="none">
												<IonAvatar slot="start" className="large">
													<IonIcon color={"tertiary"} icon={iconRepair(row.jenis)}></IonIcon>
												</IonAvatar>
												<IonLabel>
													<span className="user-name">Perbaikan {row.jenis}</span>
													<span className="date-time">{formatDistanceToNow(parseISO(String(row.created)), { addSuffix: true, locale: id })}</span>
													<span className="date-time">
														<p><IonIcon icon={personOutline}></IonIcon> {row.pengguna}</p>
													</span>
												</IonLabel>
												<div>
													<span className="price">
														<IonIcon size="small" icon={hammerOutline} />
														<p>{row.operator}</p>
													</span>
													<span className="price">
														<IonChip color={row.status === "Beres" ? "success" : "warning"}>{row.status}</IonChip>
													</span>
												</div>
											</IonItem>
										))}
									</IonCardContent>
								</IonCard>
							</IonCol>
						</IonRow>
					</IonGrid>
				</div>
				<IonModal isOpen={isOpen}>
					<IonHeader>
						<IonToolbar color={"tertiary"}>
							<IonTitle>Tambah Repair</IonTitle>
							<IonButtons slot="end">
								<IonButton onClick={closeModal}>
									<IonIcon icon={close} size={"large"} />
								</IonButton>
							</IonButtons>
						</IonToolbar>
					</IonHeader>
					<IonContent className="ion-padding">
						<form onSubmit={handleSubmit(saveItem)}>
							<IonList>
								<IonItem>
									<IonLabel position={"stacked"}>Jenis Barang</IonLabel>
									<IonSelect {...register("jenis", { required: true })} placeholder="Pilih Barang">
										<IonSelectOption>Komputer</IonSelectOption>
										<IonSelectOption>Printer</IonSelectOption>
										<IonSelectOption>Scanner</IonSelectOption>
										<IonSelectOption>Laptop</IonSelectOption>
										<IonSelectOption>Jaringan</IonSelectOption>
										<IonSelectOption>Lainya</IonSelectOption>
									</IonSelect>
								</IonItem>
								<IonItem>
									<IonLabel position={"stacked"}>Operator</IonLabel>
									<IonInput {...register("operator", { required: true })} placeholder={"Yang memperbaiki"} />
								</IonItem>
								<IonItem>
									<IonLabel position={"stacked"}>Pengguna</IonLabel>
									<IonInput {...register("pengguna", { required: true })} placeholder={"Pengguna Barang"} />
								</IonItem>
								<IonItem>
									<IonLabel position={"stacked"}>Status</IonLabel>
									<IonSelect {...register("status", { required: true })} placeholder="Pilih Status Perbaikan">
										<IonSelectOption>Proses</IonSelectOption>
										<IonSelectOption>Beres</IonSelectOption>
										<IonSelectOption>Diteruskan Ke Umum</IonSelectOption>
									</IonSelect>
								</IonItem>
								<IonItem>
									<IonLabel position={"stacked"}>Catatan</IonLabel>
									<IonTextarea {...register("catatan", { required: true })} placeholder="Tulis Keterangan"></IonTextarea>
								</IonItem>
								<IonItem>
									<IonButton onClick={takePhotos}>
										<IonIcon icon={camera} className={"ion-margin-end"} />
										Ambil Foto</IonButton>
									<IonThumbnail slot="end">
										<IonImg src={imagePath || imgBaseUrl({ collectionId: selectedItem?.collectionId!, id: selectedItem?.id! }, selectedItem?.foto)} alt="preview" />
									</IonThumbnail>
								</IonItem>
								<IonButton type="submit" color={"success"} className="ion-margin" expand="block">
									<IonIcon icon={saveOutline} className="ion-margin-end" />
									Simpan</IonButton>
							</IonList>
						</form>
					</IonContent>
				</IonModal>
			</IonContent>
		</IonPage>
	)
}