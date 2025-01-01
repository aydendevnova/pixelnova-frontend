import { GeneratedImage } from "@/types/types";
import { useState, useEffect } from "react";

const DB_NAME = "pixelnova-db";
const STORE_NAME = "generated-images";
const DB_VERSION = 1;

export function useIndexedDB() {
  const [db, setDb] = useState<IDBDatabase | null>(null);

  useEffect(() => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error(
        "IndexedDB error:",
        (event.target as IDBOpenDBRequest).error,
      );
    };

    request.onsuccess = (event) => {
      setDb((event.target as IDBOpenDBRequest).result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create the object store if it doesn't exist
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });

        // Create indexes for searching/sorting
        store.createIndex("timestamp", "timestamp", { unique: false });
        store.createIndex("prompt", "prompt", { unique: false });
      }
    };
  }, []);

  const saveImage = async (
    image: Omit<GeneratedImage, "id">,
  ): Promise<number> => {
    return new Promise((resolve, reject) => {
      if (!db) {
        reject(new Error("Database not initialized"));
        return;
      }

      const transaction = db.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);

      const request = store.add({
        url: image.url,
        prompt: image.prompt,
        timestamp: image.timestamp,
      });

      request.onsuccess = () => {
        resolve(request.result as number);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  };

  const getImages = async (): Promise<GeneratedImage[]> => {
    return new Promise((resolve, reject) => {
      if (!db) {
        reject(new Error("Database not initialized"));
        return;
      }

      const transaction = db.transaction([STORE_NAME], "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index("timestamp");
      const request = index.openCursor(null, "prev"); // Sort by newest first

      const results: GeneratedImage[] = [];

      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor) {
          results.push(cursor.value);
          cursor.continue();
        } else {
          resolve(results);
        }
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  };

  const deleteImage = async (id: number): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!db) {
        reject(new Error("Database not initialized"));
        return;
      }

      const transaction = db.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  };

  const clearImages = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!db) {
        reject(new Error("Database not initialized"));
        return;
      }

      const transaction = db.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  };

  const searchByPrompt = async (
    searchTerm: string,
  ): Promise<GeneratedImage[]> => {
    return new Promise((resolve, reject) => {
      if (!db) {
        reject(new Error("Database not initialized"));
        return;
      }

      const transaction = db.transaction([STORE_NAME], "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index("prompt");
      const request = index.openCursor();

      const results: GeneratedImage[] = [];

      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor) {
          // Case-insensitive search
          if (
            cursor.value.prompt.toLowerCase().includes(searchTerm.toLowerCase())
          ) {
            results.push(cursor.value);
          }
          cursor.continue();
        } else {
          // Sort results by timestamp descending
          results.sort(
            (a, b) =>
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
          );
          resolve(results);
        }
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  };

  return {
    saveImage,
    getImages,
    deleteImage,
    clearImages,
    searchByPrompt,
  };
}
