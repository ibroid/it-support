import * as React from "react";
import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from "@ionic/react";
import { Redirect, Route } from "react-router-dom";
import { homeOutline, cogOutline, layersOutline, hammerOutline, cubeOutline } from "ionicons/icons";
import Platform from "./pages/Platform";
import Credential from "./pages/Credential";
import "./pages/global.css";
import Repair from "./pages/Repair";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import Users from "./pages/Users";
import { AuthContext } from "./context/AuthContext";
import Login from "./pages/Login";
import { Task } from "./pages/Task";

export default function Tabs() {

	const { state } = React.useContext(AuthContext);
	if (!state.valid) {
		return <Login />
	}

	return (
		<IonTabs>
			<IonRouterOutlet>
				<Route exact path="/app/home" component={Home} />
				<Route exact path="/app/tasks" component={Task} />
				<Route exact path="/app/platform" component={Platform} />
				<Route exact path="/app/platform/:id/credential" component={Credential} />
				<Route exact path="/app/repair" component={Repair} />
				<Route exact path="/app/settings" component={Settings} />
				<Route exact path="/app/settings/users" component={Users} />
				<Route exact path={"/app"}>
					<Redirect to={"/app/home"} />
				</Route>
			</IonRouterOutlet>

			<IonTabBar slot="bottom">
				<IonTabButton tab="Home" href="/app/home">
					<IonIcon icon={homeOutline}></IonIcon>
					<IonLabel>Home</IonLabel>
				</IonTabButton>
				<IonTabButton tab="Platform" href="/app/platform">
					<IonIcon icon={layersOutline}></IonIcon>
					<IonLabel>Platform</IonLabel>
				</IonTabButton>
				<IonTabButton tab="Task" href="/app/tasks">
					<IonIcon icon={cubeOutline}></IonIcon>
					<IonLabel>Task</IonLabel>
				</IonTabButton>
				<IonTabButton tab="History" href="/app/repair">
					<IonIcon icon={hammerOutline}></IonIcon>
					<IonLabel>Repair</IonLabel>
				</IonTabButton>
				<IonTabButton tab="Settings" href="/app/settings">
					<IonIcon icon={cogOutline}></IonIcon>
					<IonLabel>Settings</IonLabel>
				</IonTabButton>
			</IonTabBar>
		</IonTabs >
	)
}