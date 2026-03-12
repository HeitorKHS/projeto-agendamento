'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import Cookies from "js-cookie";
import { api } from "../services/api";

interface User{
    id: string,
    name: string,
    email: string,
    role: string,
};

interface AuthContextData{
    user: User | null,
    isAuthenticated: boolean,
    login: (email: string, password: string) => Promise<void>,
    logout: () => void,
};

interface TokenPayload{ 
    sub: string, 
    name: string,
    email: string,
    role: string,
};

//Cria um contexto do react, {} é o valor inicial que é vazio, as AuthContextData é type assertion
const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({children}: {children: ReactNode}){

    const [user, setUser] = useState<User|null>(null);

    const isAuthenticated = !!user;

    function decodeToken(token: string): TokenPayload|null{

        try {

            const payload = JSON.parse(atob(token.split(".")[1]));
            return payload;

        } catch(error){

            return null;

        }

    }

    useEffect(()=>{

        const token = Cookies.get("token");

        if(token){

            const payload = decodeToken(token);
            
            if (payload) {
                setUser({
                    id: payload.sub,
                    name: payload.name,
                    email: payload.email,
                    role: payload.role,
                });
            }

        }

    },[]);

    async function login(email: string, password: string){

        try{

            const response = await api.post("/auth/login", {email, password});
            const { token } = response.data;

            Cookies.set("token", token, {expires: 7});

            const payload = decodeToken(token);

            if (!payload) {
                throw new Error("Token inválido");
            }

            setUser({
                id: payload.sub,
                name: payload.name,
                email: payload.email,
                role: payload.role,
            })

        } catch(error){

            throw new Error("E-mail ou senha inválidos.");

        }

    }

    function logout(){

        Cookies.remove("token");
        setUser(null);

    }

    return (

        <AuthContext.Provider value={{user, isAuthenticated, login, logout}}>
            {children}
        </AuthContext.Provider>

    );

}