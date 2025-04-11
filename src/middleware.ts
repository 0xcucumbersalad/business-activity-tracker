import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./auth/stateless-session";
import { verifyJWT } from "./auth/stateless-session";
import { cookies } from "next/headers";

// Define route categories
const protectedRoutes = ["/dashboard"];
const publicRoutes = ["/login", "/signup", "/"];

// Add an exception path
const exceptionRoutes = ["/api/user/login", "/api/user/forgot"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Check if the route is an exception
  const isExceptionRoute = exceptionRoutes.includes(path);

  // Check if the route is protected
  const isProtectedRoute =
    (protectedRoutes.includes(path) || path.startsWith("/api/")) &&
    !isExceptionRoute;

  // Check if the route is public
  const isPublicRoute = publicRoutes.includes(path);

  // Check Authorization header
  const authorizationHeader = req.headers.get("Authorization");
  let verifiedToken;

  if (authorizationHeader) {
    const token = authorizationHeader.split(" ")[1]; // Assumes "Bearer <token>" format
    if (token) {
      try {
        verifiedToken = await verifyJWT(token); // Use your token verification logic
      } catch (err) {
        console.error("Invalid token:", err);
      }
    }
  }

  // Decrypt session from cookies
  const cookie = cookies().get("session")?.value;
  const session = await decrypt(cookie);

  // Redirect if accessing a protected route without valid session or token
  if (isProtectedRoute && !session?.userId && !verifiedToken?.userId) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // Redirect if logged in and accessing a public route
  if (
    isPublicRoute &&
    (session?.userId || verifiedToken?.userId) &&
    !req.nextUrl.pathname.startsWith("/dashboard")
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
}
