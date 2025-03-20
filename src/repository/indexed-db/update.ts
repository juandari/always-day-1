import { DATABASE_NAME, TABLE_NAME } from "./constants";

interface Props {
  dbName?: string;
  storeName?: string;
  key: IDBValidKey;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
}

function writeToIndexedDB(props: Props): Promise<IDBValidKey> {
  const {
    dbName = DATABASE_NAME,
    storeName = TABLE_NAME,
    key = "",
    data,
  } = props;
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: "id", autoIncrement: true });
      }
    };

    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);
      const recipe = store.get(key);

      recipe.onsuccess = () => {
        const updateRequest = store.put({ ...recipe.result, ...data, id: key });

        updateRequest.onsuccess = () => {
          resolve(updateRequest.result);
        };

        updateRequest.onerror = (e) => {
          reject(updateRequest.error);
        };

        transaction.oncomplete = () => {
          db.close();
        };
      };
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

export default writeToIndexedDB;
