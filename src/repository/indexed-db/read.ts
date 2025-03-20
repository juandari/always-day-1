import { DATABASE_NAME, TABLE_NAME } from "./constants";

interface Props {
  dbName?: string;
  storeName?: string;
  key?: IDBValidKey;
}

function readFromIndexedDB<T>(props: Props): Promise<T | undefined> {
  const { dbName = DATABASE_NAME, storeName = TABLE_NAME, key = "" } = props;
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: "id", autoIncrement: true });
      }
    };

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction(storeName, "readonly");
      const store = transaction.objectStore(storeName);
      const getRequest = key ? store.get(key) : store.getAll();

      getRequest.onsuccess = () => {
        resolve(getRequest.result as T | undefined);
      };

      getRequest.onerror = () => {
        reject(getRequest.error);
      };

      transaction.oncomplete = () => {
        db.close();
      };
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

export default readFromIndexedDB;
