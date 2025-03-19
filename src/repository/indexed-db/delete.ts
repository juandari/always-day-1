import { DATABASE_NAME } from "./constants";

function deleteIndexedDB(dbName: string = DATABASE_NAME): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(dbName);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(request.error);
    };

    request.onblocked = () => {
      console.warn(
        `Database "${dbName}" deletion is blocked. Close open connections and try again.`
      );
    };
  });
}

export default deleteIndexedDB;
