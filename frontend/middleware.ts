import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/projetos", "/perfil"];//rotas que precisam de autenticação
const authCheckRoutes = ["/", "/cadastro", "/login"];//rotas que não precisam de autenticação
const publicApiRoutes = ["/api/userAvatar"]; // APIs públicas que não exigem autenticação

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Verificar se a rota é uma API pública
  if (publicApiRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  try {
    // For API routes that require authentication like /api/me
    await new Promise((resolve) => setTimeout(resolve, 250));

    const res = await fetch(`${request.nextUrl.origin}/api/me`, {
      method: "GET",
      credentials: "include",
      headers: { Cookie: request.headers.get("cookie") || "" },//pega desse jeito diferente pq aqui roda no servidor
    });


    if (!res.ok) {
      console.log("Usuário não autenticado.");
      if (protectedRoutes.some(route => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL("/", request.url));
      }
      return NextResponse.next();
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
  matcher: ["/", "/projetos/:path*", "/login", "/cadastro", "/perfil", "/api/userAvatar/:path*"],
};
