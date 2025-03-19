interface Props {
  dbName?: string;
  storeName?: string;
  key?: IDBValidKey;
}

function readFromIndexedDB<T>(props: Props): Promise<T | undefined> {
  const { dbName = "recipe_db", storeName = "recipe", key = "" } = props;
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
      const getRequest =
        Boolean(key) === true ? store.get(key) : store.getAll();

      console.log("[LOGGER:DB] (PREPARE) read data key: ", key);

      getRequest.onsuccess = () => {
        console.log(
          "[LOGGER:DB] (SUCCESS) read data response: ",
          getRequest.result
        );
        resolve(getRequest.result as T | undefined);
      };

      getRequest.onerror = () => {
        console.log(
          "[LOGGER:DB] (FAILED) read data response: ",
          getRequest.error.message
        );
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
