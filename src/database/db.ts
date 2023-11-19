// using IndexDB to store movies
import { Movie } from 'src/types/movie';

let db: IDBDatabase | null = null;

const request = indexedDB.open('MoviesDatabase', 1);

request.onerror = (event: Event) => {
  const request = event.target as IDBRequest;
  console.error('Database error:', request.error);
};

request.onsuccess = (event: Event) => {
  db = (event.target as IDBOpenDBRequest).result as IDBDatabase;
};

request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
  const db = (event.target as IDBOpenDBRequest).result as IDBDatabase;

  db.createObjectStore('movies', { keyPath: 'id', autoIncrement: true });
};

function addMovieToDB(movie: Movie): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject('IndexedDB is not initialized');
      return;
    }

    const transaction = db.transaction(['movies'], 'readwrite');
    const store = transaction.objectStore('movies');

    // Lakukan deep clone objek di sini jika perlu
    const movieToStore = JSON.parse(JSON.stringify(movie));

    const request = store.add(movieToStore);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(`Error adding movie: ${request.error}`);
  });
}

export const getMovieById = async (
  id: string | number
): Promise<Movie | null> => {
  console.log('Fetching movie with ID:', id);
  return new Promise((resolve, reject) => {
    const openRequest = indexedDB.open('MoviesDatabase', 1);

    openRequest.onerror = (event: Event) => {
      const request = event.target as IDBRequest; // Type assertion here
      if (request.error) {
        console.error('Database open error:', request.error);
        reject('Database error: ' + request.error.message);
      } else {
        reject('Unknown database error');
      }
    };

    openRequest.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result; // Type assertion here
      if (db && !db.objectStoreNames.contains('movies')) {
        db.createObjectStore('movies', { keyPath: 'id' });
      }
    };

    openRequest.onsuccess = (event: Event) => {
      const db = (event.target as IDBOpenDBRequest).result; // Type assertion here
      if (db) {
        const transaction = db.transaction(['movies'], 'readonly');
        const store = transaction.objectStore('movies');
        const getRequest = store.get(id);

        getRequest.onsuccess = () => {
          console.log('GetRequest result:', getRequest.result);
          if (getRequest.result) {
            resolve(getRequest.result);
          } else {
            console.error('No movie found with ID:', id);
            reject('No movie found with id: ' + id);
          }
        };

        getRequest.onerror = (event: Event) => {
          const request = event.target as IDBRequest; // Type assertion here
          if (request.error) {
            console.error('Error fetching movie:', request.error);
            reject('Error fetching movie with id: ' + id);
          } else {
            reject('Unknown error in fetching movie');
          }
        };
      } else {
        reject('Database open request was unsuccessful');
      }
    };
  });
};

export const updateMovieInDB = async (movie: Movie) => {
  return new Promise((resolve, reject) => {
    const openRequest = indexedDB.open('MoviesDatabase', 1);

    openRequest.onerror = (event) => {
      reject('Database error: ' + (event.target as IDBRequest).error?.message);
    };

    openRequest.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction(['movies'], 'readwrite');
      const store = transaction.objectStore('movies');

      const updateRequest = store.put(movie);

      updateRequest.onsuccess = () => {
        resolve(updateRequest.result);
      };

      updateRequest.onerror = () => {
        reject('Update error: ' + updateRequest.error?.message);
      };
    };
  });
};

export const deleteMovieFromDB = async (id: string | number): Promise<void> => {
  return new Promise((resolve, reject) => {
    const openRequest = indexedDB.open('MoviesDatabase', 1);

    openRequest.onerror = (event) => {
      const request = event.target as IDBRequest;
      console.error('Database open error:', request.error);
      reject('Database error: ' + request.error?.message);
    };

    openRequest.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction(['movies'], 'readwrite');
      const store = transaction.objectStore('movies');

      const numericId = typeof id === 'string' ? Number(id) : id;
      console.log('Deleting movie with ID:', numericId); // Log the ID

      const deleteRequest = store.delete(numericId);

      deleteRequest.onsuccess = () => {
        console.log('Delete successful for ID:', numericId);
        resolve();
      };

      deleteRequest.onerror = (event) => {
        console.error('Delete error for ID:', numericId, event);
        reject('Error deleting movie with id: ' + numericId);
      };

      transaction.onerror = (event) => {
        console.error('Transaction error:', event);
      };
    };
  });
};

export { addMovieToDB };
