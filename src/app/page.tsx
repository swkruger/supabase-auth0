import { auth0 } from "./lib/auth0"

export default async function Home() {
  const session = await auth0.getSession();
  
  if (!session) {
    return (
      <main>
        <a href="/auth/login?screen_hint=signup">Sign up</a>
        <a href="/auth/login">Log in</a>
      </main>
    )
  }
  
  // Define type for the decoded token
  interface DecodedToken {
    "https://fifolio.app.com/roles"?: string[];
    "permissions"?: string[];
    [key: string]: any; // Allow other properties
  }

  // Extract decoded token from the accessToken
  let decodedToken: DecodedToken = {};
  try {
    if (session.tokenSet?.accessToken) {
      const parts = session.tokenSet.accessToken.split('.');
      if (parts.length === 3) {
        decodedToken = JSON.parse(atob(parts[1]));
      }
    }
  } catch (error) {
    console.error("Error decoding token:", error);
  }
  
  // Access roles and permissions from decoded token
  const userRoles = decodedToken["https://fifolio.app.com/roles"] || [];
  const userPermissions = decodedToken["permissions"] || [];
  
  console.log("User roles:", userRoles);
  console.log("User permissions:", userPermissions);
  
  // Check if user has specific role
  const isAdmin = userRoles.includes("admin");
  
  return (
    <main>
      <h1>Welcome, {session.user.name}!</h1>
      {isAdmin && <div>Admin panel access granted</div>}
      <div>Your roles: {userRoles.join(", ")}</div>
      <div>Your permissions: {userPermissions.join(", ")}</div>
    </main>
  );
}
