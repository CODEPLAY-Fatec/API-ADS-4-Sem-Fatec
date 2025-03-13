import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import axios from "axios";

const protectedRoutes = [
  "/projetos",
];

export async function middleware(request: NextRequest) {
  if (protectedRoutes.includes(request.nextUrl.pathname)) {
    try {
      const response = await axios.get("/me", {
        withCredentials: true, 
      });


      // Se a resposta não for 200, redireciona para a home
      if (response.status !== 200) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch (error) {
        console.log(error)
      return NextResponse.redirect(new URL("/", request.url));// se der erro tb redireciona pra home
    }
  }

  return NextResponse.next();
}

// Define para quais rotas o middleware será aplicado
export const config = {
    matcher: ["/projetos/:path*"], // Aplica o middleware para qualquer sub-rota de /projetos
  };
  
