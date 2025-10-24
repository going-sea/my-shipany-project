import { oneTapClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

import { envConfigs } from '@/config';

// auth client for client-side use
export const authClient = createAuthClient({
  baseURL: envConfigs.auth_url,
  secret: envConfigs.auth_secret,
});

// export auth client methods
export const { signIn, signUp, signOut, useSession } = authClient;

// get auth client with configs
export function getAuthClient(configs: Record<string, string>) {
  const authClient = createAuthClient({
    baseURL: envConfigs.auth_url,
    secret: envConfigs.auth_secret,
    plugins:
      configs.google_client_id && configs.google_one_tap_enabled === 'true'
        ? [
            oneTapClient({
              clientId: configs.google_client_id,
              // Optional client configuration:
              autoSelect: false,
              cancelOnTapOutside: false,
              context: 'signin',
              additionalOptions: {
                // Any extra options for the Google initialize method
              },
              // Configure prompt behavior and exponential backoff:
              promptOptions: {
                baseDelay: 1000, // Base delay in ms (default: 1000)
                maxAttempts: 1, // Only attempt once to avoid multiple error logs (default: 5)
              },
            }),
          ]
        : [],
  });

  return authClient;
}
