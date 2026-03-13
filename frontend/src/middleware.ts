import { NextRequest, NextResponse } from "next/server";

const publicRoutes = [
    "/",
    "/login",
    "/register"
];

//O middleware será executado para todas as solicitações, exceto para caminhos que correspondem a arquivos estáticos do Next.js (como imagens, arquivos JavaScript, favicon.ico, etc.)
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

export function middleware(req: NextRequest){

    const token = req.cookies.get("token")?.value;
    const { pathname } = req.nextUrl; //Pega o caminho da URL que o usuário está tentando acessar.

    const isPublicRoute = publicRoutes.includes(pathname); //Verifica se a rota atual (pathname) está dentro da lista de rotas públicas

    //Se não tiver token e tentar acessar rota protegia, redireciona para /login
    if(!token && !isPublicRoute){
        return NextResponse.redirect(new URL("/login", req.url));
    }

    //Se tiver token e tentar acessar /login ou /register, redireciona para /dashboard
    if(token && (pathname === "/login" || pathname === "/register")){
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    //Proteção de rotas admin
    if(token && pathname.startsWith("/admin")){

        //split(".") tranforma em ["header","payload","signature"], o [1] pega a segunda parte que é payload, o atob() decodifica Base64 para texto normal e o JSON.parse converto texto json para objeto javascript
        const payload = JSON.parse(atob(token.split(".")[1]));

        if(payload.role !== "ADMIN"){
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }

    }

    return NextResponse.next();

}