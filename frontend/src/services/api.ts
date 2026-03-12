import axios from "axios"; //biblioteca para fazer requisições HTTP (GET, POST, etc)
import Cookies from "js-cookie"; //Biblioteca para ler e salvar cookies no navegador

//Criando uma instância do Axios chamada api. Isso serve para não precisar repetir a URL base em todas as requisições.
export const api = axios.create({
    baseURL: "http://localhost:3333",
});

//Interceptores são funções que executam antes da requisição ser enviada
api.interceptors.request.use((config) => {

    //Pega o token no cookie
    const token = Cookies.get("token");

    //Se o token existir, ele adiciona no header da requisição
    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }

    return config;

})