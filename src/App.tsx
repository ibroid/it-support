import { AuthContext } from './context/AuthContext';
import { IStateAuth, IUserResponse } from './interfaces/IResponse';
import { useMemo, useReducer } from 'react';
import { Route } from 'react-router-dom';
import {
  IonApp,
  IonRouterOutlet,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import Login from './pages/Login';
import Tabs from './Tabs';
import "./pages/global.css"
import MiddleFab from './components/MIddleFab';

setupIonicReact();

function appReducer(state: IStateAuth, action: { type: "LOGIN" | "LOGOUT", token: string, user: IUserResponse | any }) {
  switch (action.type) {
    case 'LOGIN':
      return { token: action.token, user: action.user, valid: true };
    case 'LOGOUT':
      return { token: action.token, user: action.user, valid: false };
    default:
      return state;
  }
}


const App: React.FC = () => {

  const [state, dispatch] = useReducer(appReducer, {
    token: '', user: {}, valid: false
  })

  const deState = useMemo(
    () => ({
      login: (token: string, user: any) => {
        dispatch({ type: "LOGIN", token, user })
      },
      logout: () => {
        dispatch({
          type: "LOGOUT",
          token: "",
          user: undefined
        })
      }
    }),
    []
  );

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path={"/"} component={Login} />
          <AuthContext.Provider value={{ state, deState }}>
            <Route path={"/app"} component={Tabs} />
          </AuthContext.Provider>
        </IonRouterOutlet>
        <MiddleFab />
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
