import { createContext } from "react";
import { IAuthContext } from "../interfaces/IResponse";



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
