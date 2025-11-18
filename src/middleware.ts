import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          req.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          req.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  // Verificar sessão do usuário
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Rotas protegidas que exigem autenticação
  const protectedRoutes = ['/app'];
  const isProtectedRoute = protectedRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  );

  // Se tentar acessar rota protegida sem estar logado, redirecionar para LP
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Se estiver logado, verificar se está ativo (is_active)
  if (session && isProtectedRoute) {
    const { data: userData } = await supabase
      .from('user_data')
      .select('is_active')
      .eq('user_id', session.user.id)
      .single();

    // Se usuário não está ativo, redirecionar para LP
    if (!userData?.is_active) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  // Rota admin - verificar se é admin
  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    // Verificar se é admin (pode ser por email específico)
    const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
    if (!adminEmails.includes(session.user.email || '')) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return response;
}

export const config = {
  matcher: ['/app/:path*', '/admin/:path*'],
};
