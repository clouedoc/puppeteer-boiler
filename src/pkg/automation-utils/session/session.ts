import { Page } from "puppeteer";
import * as z from "zod";
import { log } from "../../services/log/log";
import { getCookies, setCookies } from "./storages/cookies";
import {
  ExportedIndexedDBDatabase,
  getAllIndexedDB,
  setAllIndexedDB,
} from "./storages/IndexedDB";
import { getLocalStorage, setLocalStorage } from "./storages/localStorage";
import {
  getSessionStorage,
  setSessionStorage,
} from "./storages/sessionStorage";

// note: we are not implementing sessionStorage because the content is removed each time the tab is closed

export const SessionData = z.object({
  localStorage: z.string(),
  sessionStorage: z.string(),
  indexedDBDatabases: z.array(ExportedIndexedDBDatabase),
  cookies: z.string(),
});
export type SessionData = z.infer<typeof SessionData>;

/**
 *
 * @param securityOrigin to get this: Dev Tools > Application > IndexedDB > properties of a database > security origin
 * @returns
 */
export async function getSessionData(
  page: Page,
  securityOrigin: string
): Promise<SessionData> {
  log.silly("extracting session data");
  return {
    localStorage: await getLocalStorage(page),
    cookies: await getCookies(page),
    sessionStorage: await getSessionStorage(page),
    indexedDBDatabases: await getAllIndexedDB(page, securityOrigin),
  };
}

export async function setSessionData(page: Page, sessionData: SessionData) {
  log.silly("restoring session data");
  await Promise.all([
    setCookies(page, sessionData.cookies),
    setLocalStorage(page, sessionData.localStorage),
    setSessionStorage(page, sessionData.sessionStorage),
    setAllIndexedDB(page, sessionData.indexedDBDatabases),
  ]);
}
