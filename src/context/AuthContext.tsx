import { createContext, useMemo, useReducer } from "react";
import { IAuthContext, IStateAuth, IUserResponse } from "../interfaces/IResponse";

export const AuthContext = createContext<IAuthContext>({
	state:
	{
		token: '',
		user: {},
		valid: false
	},
	deState: {
		login: () => { },
		logout: () => { }
	}
});

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


export const AuthProvider = ({ children }: any) => {
	const [state, dispatch] = useReducer(appReducer, {
		token: '', user: { name: 'AP' }, valid: false
	})

	const deState = useMemo(
		() => ({
			login: (token: string, user: any) => {
				console.log('asuidguiasduis')
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
		<AuthContext.Provider value={{ state, deState }}>
			{children}
		</AuthContext.Provider>
	)
}