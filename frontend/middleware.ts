import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/projetos"];

export async function middleware(request: NextRequest) {
  if (protectedRoutes.includes(request.nextUrl.pathname)) {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500)); //  delay pq tava dando erro quando o middleware ia direto
      
      const res = await fetch(`${request.nextUrl.origin}/api/me`, {//tem q ser fetch aqui pq o axios nao funciona no middleware
        method: "GET",
        credentials: "include",
        headers: { Cookie: request.headers.get("cookie") || "" }, 
      });//withcredentials true nao funcionada aqui, por isso foi feito dessa forma

      if (!res.ok) {
        throw new Error("Usuário não autenticado.");
      }

      console.log("Usuário autenticado!");
    } catch (error) {
      console.error("Usuário não autenticado!", error);
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/projetos/:path*"],//para aplicar na rota projeto e os filhos dela
};
