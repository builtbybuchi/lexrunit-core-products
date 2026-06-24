import { Client, Databases } from 'node-appwrite';

export const DATABASE_ID = 'website-db';

export function getAppwriteClient(env: any) {
  const client = new Client();
  client
    .setEndpoint(env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(env.APPWRITE_PROJECT_ID || 'db')
    .setKey(env.APPWRITE_API_KEY || 'your-api-key');
  return client;
}

export function getDatabases(env: any) {
  return new Databases(getAppwriteClient(env));
}
