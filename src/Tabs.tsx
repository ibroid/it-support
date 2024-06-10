import * as React from "react";
import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from "@ionic/react";
import { Redirect, Route } from "react-router-dom";
import { homeOutline, cogOutline, layersOutline, hammerOutline } from "ionicons/icons";
import Platform from "./pages/Platform";
import Credential from "./pages/Credential";
import "./pages/global.css";
import Repair from "./pages/Repair";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import Users from "./pages/Users";
import { AuthContext } from "./context/AuthContext";
import Login from "./pages/Login";

export default function Tabs() {

	const { state } = React.useContext(AuthContext);
	console.log(state)
	if (!state.token) {
		return <Login />
	}

	return (
		<IonTabs>
			<IonRouterOutlet>
				<Route path="/app/home" component={Home} />
				<Route path="/app/platform" component={Platform} />
				<Route path="/app/platform/:id/credential" component={Credential} />
				<Route path="/app/repair" component={Repair} />
				<Route path="/app/settings" component={Settings} />
				<Route path="/app/settings/users" component={Users} />
				<Route path={"/app"}>
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
				<IonTabButton>
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
		</IonTabs>
	)
}