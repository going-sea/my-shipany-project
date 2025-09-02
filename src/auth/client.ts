import { createAuthClient } from "better-auth/react";
import { getConfigs } from "@/config";

const configs = getConfigs();

export const authClient = createAuthClient({
  baseURL: configs.authUrl,
  secret: configs.authSecret,
});

export const { signIn, signUp, useSession } = authClient;
