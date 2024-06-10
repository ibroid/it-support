import { IonAvatar, IonCard, IonCardContent, IonCardHeader, IonCol, IonContent, IonGrid, IonImg, IonItem, IonLabel, IonPage, IonProgressBar, IonRow, IonTitle, useIonToast } from '@ionic/react';
import Pocketbase from '../utils/Pocketbase';
import { useCallback, useEffect, useState } from 'react';
import "./global.css";
import { format } from "date-fns"
import { id } from 'date-fns/locale';
import { IUserResponse } from '../interfaces/IResponse';
import { imgBaseUrl } from '../utils/Helper';
import DefaultHeader from '../components/DefaultHeader';

const Home: React.FC = () => {

  // const [plaformList, setPlatformList] = useState<any[]>([])
  const [taskList, setTaskList] = useState<any[]>([]);
  const [taskStatusList, setTaskStatusList] = useState<any[]>([]);
  const [repairList, setRepairList] = useState<any[]>([]);
  const [undoneList, setUndoneList] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [toast] = useIonToast();

  const fetchTasks = useCallback(async () => {
    try {
      const records = await Pocketbase.collection('tasks').getFullList()
      setTaskList(records);
    } catch (error: any) {
      if (error.status !== 0) toast({
        message: "Terjadi kesalahan. " + error.message,
        position: "top",
        color: "danger",
        duration: 2000
      })
    }
  }, [])

  const fetchUser = useCallback(async () => {
    try {
      const records = await Pocketbase.collection('users').getFullList()
      setUsersList(records);
    } catch (error: any) {
      if (error.status !== 0) toast({
        message: "Terjadi kesalahan. " + error.message,
        position: "top",
        color: "danger",
        duration: 2000
      })
    }
  }, [])

  const fetchTasksStatus = useCallback(async () => {
    try {
      const records = await Pocketbase.collection('status').getFullList({
        filter: `created>='${format(new Date(), 'yyyy-MM-dd 00:00:00', { locale: id })}'`,

      })
      setTaskStatusList(records);
    } catch (error: any) {
      if (error.status !== 0) toast({
        message: "Terjadi kesalahan. " + error.message,
        position: "top",
        color: "danger",
        duration: 2000
      })
    }
  }, [])

  const fetchRepair = useCallback(async () => {
    try {
      const records = await Pocketbase.collection('repair').getFullList()
      setRepairList(records);
      setUndoneList(records.filter(val => val.status === 'Beres'));
    } catch (error: any) {
      if (error.status !== 0) toast({
        message: "Terjadi kesalahan. " + error.message,
        position: "top",
        color: "danger",
        duration: 2000
      })
    }
  }, [])

  useEffect(() => {
    fetchTasks();
    fetchTasksStatus();
    fetchRepair();
    fetchUser();

    return function cleanup() {
      setTaskList([]);
      setTaskStatusList([]);
      setRepairList([]);
      setUndoneList([])
    }
  }, [fetchTasks, toast, fetchTasksStatus, setRepairList])

  return (
    <IonPage>
      <DefaultHeader title='Home' />
      <IonContent fullscreen className='ion-padding ion-margin-bot'>
        <div id="mjeUkvKhqX8az6a9VS5f">
          <IonGrid className="ion-no-padding">
            <IonRow>
              <IonCol size="12">
                <IonCard className="card">
                  <IonCardHeader className="ion-no-padding">
                    <IonItem lines="none">
                      <IonLabel className="">
                        <span className="title">Aktivitas</span>
                      </IonLabel>
                    </IonItem>
                  </IonCardHeader>
                  <IonCardContent>
                    <IonGrid className="ion-no-padding">
                      <IonRow className="a-section ion-no-padding">
                        <IonCol size="3">
                          <IonImg src="https://cdn-icons-png.flaticon.com/512/744/744970.png"></IonImg>
                        </IonCol>
                        <IonCol size="9">
                          <IonLabel>
                            <span className="title">Tugas Harian</span>
                            <span className="sub-title">
                              Tugas Rutinan IT
                            </span>
                          </IonLabel>
                          {
                            (taskStatusList.length === taskList.length)
                              ? <IonLabel className="a-status">DONE</IonLabel>
                              : <IonProgressBar value={parseFloat((taskStatusList.length / taskList.length).toFixed(2))}></IonProgressBar>
                          }
                          <IonLabel className="count">{taskStatusList.length}/{taskList.length}</IonLabel>
                        </IonCol>
                      </IonRow>
                      <IonRow className="a-section ion-no-padding">
                        <IonCol size="3">
                          <IonImg src="/assets/icon/repair.png"></IonImg>
                        </IonCol>
                        <IonCol size="9">
                          <IonLabel>
                            <span className="title">Perbaikan</span>
                            <span className="sub-title">
                              Perbaikan barang elektronik
                            </span>
                          </IonLabel>
                          {
                            (undoneList.length === repairList.length)
                              ? <IonLabel className="a-status">DONE</IonLabel>
                              : <IonProgressBar value={parseFloat((undoneList.length / repairList.length).toFixed(2))}></IonProgressBar>
                          }
                          <IonLabel className="count">{undoneList.length}/{repairList.length}</IonLabel>
                        </IonCol>
                      </IonRow>
                    </IonGrid>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
          </IonGrid>
        </div>


        <div id="nlDMVfmAaPpJLR5qW4IG">
          <IonGrid className="widget">
            <IonRow className="ion-padding-vertical">
              <IonCol size="12">
                <IonTitle className="ion-text-start">Admins</IonTitle>
              </IonCol>
            </IonRow>
            <IonRow>
              {usersList.map((row: IUserResponse) => {
                return <IonCol key={row.id} size="3" className="ion-text-center ion-margin-bottom">
                  <div className="contact-person">
                    <IonAvatar>
                      <img
                        alt="avatar"
                        src={imgBaseUrl({ collectionId: row.collectionId, id: row.id }, row.avatar)}
                      />
                    </IonAvatar>
                  </div>
                  <IonLabel className="name">{row.name}</IonLabel>
                </IonCol>
              })}

            </IonRow>
          </IonGrid>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;