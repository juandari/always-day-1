function deleteIndexedDB(dbName: string = "recipe_db"): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(dbName);
    console.log("[LOGGER:DB] (PREPARE) delete data");

    request.onsuccess = () => {
      console.log("[LOGGER:DB] (SUCCESS) delete data");
      resolve();
    };

    request.onerror = () => {
      console.log("[LOGGER:DB] (FAILED) delete data: ", request.error.message);
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
