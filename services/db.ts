
import { MonthlyData } from '../types';

const DB_NAME = 'LifeGraphDB';
const STORE_NAME = 'userData';
const DB_VERSION = 1;

export const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject('DB 접속에 실패했습니다.');
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };
  });
};

export const saveData = async (data: MonthlyData[]): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(data, 'currentYearData');

    request.onsuccess = () => resolve();
    request.onerror = () => reject('데이터 저장 중 오류가 발생했습니다.');
  });
};

export const loadData = async (): Promise<MonthlyData[] | null> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get('currentYearData');

    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject('데이터 로드 중 오류가 발생했습니다.');
  });
};
