import { IonBackButton, IonButton, IonButtons, IonChip, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonList, IonPage, IonSelect, IonSelectOption, IonText, IonTitle, IonToolbar, useIonActionSheet, useIonToast } from "@ionic/react";
import { copy, swapHorizontalSharp } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { RouteComponentProps } from "react-router-dom";
import { ICredentialResponse } from "../interfaces/IResponse";
import Pocketbase from "../utils/Pocketbase";
import { Clipboard } from '@capacitor/clipboard';


interface CredDetailPageProps
  extends RouteComponentProps<{
    id: string;
  }> { }

type FormInput = {
  user: string,
  password: string,
  status: string
}

const Credential: React.FC<CredDetailPageProps> = ({ match }) => {
  const [toast] = useIonToast();
  const [actionSheet] = useIonActionSheet();
  const [credList, setCredlist] = useState<any[]>([]);
  const { register, resetField, formState: { errors }, handleSubmit } = useForm<FormInput>()
  const [refetch, setRefetch] = useState<number>(0);

  useEffect(() => {
    (async function init() {
      try {
        const records = await Pocketbase.collection('credentials')
          .getList(undefined, undefined, {
            filter: `platform_id="${match.params.id}"`
          })
        setCredlist(records.items);
      } catch (error: any) {
        if (error.status !== 0) {
          toast({
            message: 'Terjadi kesalahan' + error.message,
            duration: 2000,
            position: 'top',
            color: 'danger'
          })
        }
      }

    }())

    return () => {
      setCredlist([]);

    }
  }, [refetch])

  const saveItem = async (data: FormInput) => {
    try {
      await Pocketbase.collection('credentials').create({
        user: data.user,
        status: data.status,
        platform_id: match.params.id,
        password: data.password
      })
      toast({
        message: 'Berhasil ditambahkan',
        position: 'top',
        color: 'success',
        duration: 2000
      })
    } catch (error: any) {
      toast({
        message: 'Terjadi kesalahan' + error.message,
        duration: 2000,
        position: 'top',
        color: 'danger'
      })
    }
    resetField('user')
    resetField('password')
    resetField('status')
    setRefetch(prev => prev + 1);
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color={"tertiary"}>
          <IonButtons>
            <IonBackButton defaultHref="/app/platform" />
            <IonTitle>Credential</IonTitle>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="ion-margin">
          <IonText>Tambah Credential</IonText>
        </div>
        <form onSubmit={handleSubmit(saveItem)}>
          <IonList>
            <IonItem>
              <IonLabel position={"stacked"}>Username</IonLabel>
              <IonInput {...register('user')} placeholder="Isi Username" />
            </IonItem>
            <IonItem>
              <IonLabel position={"stacked"}>Password</IonLabel>
              <IonInput {...register('password')} placeholder="Isi Password" />
            </IonItem>
            <IonItem>
              <IonLabel position={"stacked"}>Status</IonLabel>
              <IonSelect {...register('status')} placeholder="Select Status">
                <IonSelectOption value="Active">Active</IonSelectOption>
                <IonSelectOption value="Inactive">Inactive</IonSelectOption>
              </IonSelect>
            </IonItem>
            <IonButton type="submit" className="ion-margin" expand="block">Simpan</IonButton>
          </IonList>
        </form>
        <div className="ion-margin">
          <IonText>Daftar Credential</IonText>
        </div>
        <IonList>
          {credList?.map((val: ICredentialResponse, i) => (
            <IonItem button key={val.id}
              onClick={() => {
                actionSheet([
                  {
                    text: 'Copy',
                    icon: copy,
                    async handler() {
                      await Clipboard.write({
                        string: val.password
                      });
                      toast({
                        position: 'top',
                        message: 'Berhasil disalin',
                        duration: 2000
                      })
                    },
                  },
                  {
                    text: 'Ganti Status',
                    icon: swapHorizontalSharp,
                    async handler() {
                      await Pocketbase.collection('credentials')
                        .update(val.id, { ...val, status: (val.status === 'Active') ? 'Inactive' : 'Active' });
                      toast({
                        message: 'Berhasil diubah',
                        position: 'top',
                        color: 'success',
                        duration: 2000
                      })
                      setRefetch(prev => prev + 1);
                    },
                  },
                  {
                    text: 'Ok',
                    role: 'cancel'
                  }
                ], val.password)
              }}
            >
              <IonLabel>
                <h3>Username : {val.user}</h3>
                <p>Password : {val.password}</p>
              </IonLabel>
              <IonChip color={val.status === "Active" ? "success" : "danger"}>{val.status}</IonChip>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  )
}

export default Credential;