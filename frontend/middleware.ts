import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/projetos"];//rotas que precisam de autenticação
const authCheckRoutes = ["/","/cadastro", "/login"];//rotas que não precisam de autenticação

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  try {
    await new Promise((resolve) => setTimeout(resolve, 500)); 

    const res = await fetch(`${request.nextUrl.origin}/api/me`, {
      method: "GET",
      credentials: "include",
      headers: { Cookie: request.headers.get("cookie") || "" },//pega desse jeito diferente pq aqui roda no servidor
    });

    if (!res.ok) {
      throw new Error("Usuário não autenticado.");
    }

    console.log("Usuário autenticado!");

    
    if (authCheckRoutes.includes(pathname)) {//redirecionamentos do login/home/cadastro
      return NextResponse.redirect(new URL("/projetos", request.url));
    }
  } catch (error) {
    console.error("Usuário não autenticado!", error);

    
    if (protectedRoutes.some(route => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/projetos/:path*"], // rotas em q o arquivo esta aplicado
};
