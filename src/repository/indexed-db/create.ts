interface Props {
  dbName?: string;
  storeName?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
}

function writeToIndexedDB(props: Props): Promise<IDBValidKey> {
  const { dbName = "recipe_db", storeName = "recipe", data } = props;
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
      console.log("[LOGGER:DB] (PREPARE) read data payload: ", data);
      const addRequest = store.add(data);

      addRequest.onsuccess = () => {
        console.log(
          "[LOGGER:DB] (SUCCESS) read data response: ",
          addRequest.result
        );
        resolve(addRequest.result);
      };

      addRequest.onerror = () => {
        console.log(
          "[LOGGER:DB] (FAILED) read data response: ",
          addRequest.error.message
        );
        reject(addRequest.error);
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

export default writeToIndexedDB;
