import { clerkMiddleware } from "@clerk/nextjs/server";
clerkMiddleware(async (auth: any, req: any) => {
  console.log(typeof auth); // in v7, auth is an object, in v6 it's a function.
  if (typeof auth === 'function') {
      console.log('auth is a function');
  } else {
      console.log('auth is an object');
  }
});
