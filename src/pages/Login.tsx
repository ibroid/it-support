import { IonButton, IonCol, IonContent, IonGrid, IonHeader, IonInput, IonItem, IonLabel, IonPage, IonRow, IonTitle, IonToolbar, useIonRouter } from "@ionic/react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../context/AuthContext";
import Pocketbase from "../utils/Pocketbase";
import "./global.css";

interface IFormInput {
	username: string;
	password: string
}

export default function Login() {

	const nav = useIonRouter()
	const { register, handleSubmit } = useForm<IFormInput>();
	const { deState } = React.useContext(AuthContext);

	const doLogin = async (data: IFormInput) => {
		const loginResponse = await Pocketbase.collection("users").authWithPassword(data.username, data.password);

		deState.login(loginResponse.token, loginResponse.record);
		nav.push('/app', 'root', 'replace');
	}

	return (
		<IonPage>
			<IonContent id="pPKdCQzxCZHeKWYWF5PW">
				<div className="login-bg">
					<IonGrid>
						<IonRow className="ion-justify-content-center">
							<IonCol
								className="card"
								size="12"
								size-sm="6"
								size-md="4"
								size-lg="3"
							>
								<form onSubmit={handleSubmit(doLogin)}>
									<IonRow className="ion-margin-bottom">
										<IonCol size="12" className="ion-margin-bottom">
											<h1 className="title ion-text-center"> Login </h1>
										</IonCol>
									</IonRow>
									<IonRow className="ion-margin-bottom">
										<IonCol size="12">
											<IonItem
												className="ion-margin-bottom ion-align-self-center"
												lines="none"
											>
												<IonLabel mode="md" position="floating">
													User Name or E-mail
												</IonLabel>
												<IonInput
													{...register("username", { required: true })}
													className=""
													placeholder="Enter User Name or E-mail"
												></IonInput>
											</IonItem>
										</IonCol>
									</IonRow>
									<IonRow className="ion-margin-top">
										<IonCol size="12" className="ion-margin-bottom">
											<IonItem className="" lines="none">
												<IonLabel mode="md" position="floating">
													Password
												</IonLabel>
												<IonInput
													{...register("password", { required: true })}
													className="ion-padding-start"
													type="password"
													placeholder="Enter Password"
												></IonInput>
											</IonItem>
											<a className="fp" color="medium">
												Forgot Password?
											</a>
										</IonCol>
									</IonRow>
									<IonRow>
										<IonCol size="12">
											<IonRow className="ion-margin-bottom">
												<IonCol size="6">
													<IonButton
														type="submit"
														fill="solid"
														shape="round"
														color="primary"
														className="login-button ion-text-capitalize ion-no-margin"
													>
														Login
													</IonButton>
												</IonCol>
												<IonCol size="6">
													<IonButton
														fill="clear"
														shape="round"
														color="medium"
														className="back-button ion-text-capitalize ion-no-margin"
													>
														Back to Home
													</IonButton>
												</IonCol>
											</IonRow>
										</IonCol>
									</IonRow>
								</form>
							</IonCol>
						</IonRow>
					</IonGrid>
				</div>
			</IonContent>
		</IonPage>
	)
}