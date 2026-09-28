/**
 * IndexedDB Offline Chat Queue
 * 
 * If a command console drops offline, messages sent by the user are cached here.
 * When connectivity is restored, the queue is processed and sent to the server.
 */

const DB_NAME = 'SurakshaChatOfflineDB';
const STORE_NAME = 'message_queue';
const DB_VERSION = 1;

let dbPromise = null;

function initDB() {
    if (dbPromise) return dbPromise;

    dbPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = (event) => {
            console.error('[OfflineChat] IndexedDB error:', event.target.error);
            reject(event.target.error);
        };

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
            }
        };
    });

    return dbPromise;
}

export async function queueMessage(conversation_id, messagePayload) {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);

        const record = {
            conversation_id,
            payload: messagePayload,
            timestamp: Date.now()
        };

        const request = store.add(record);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export async function getQueuedMessages() {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export async function clearQueuedMessage(id) {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(id);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

/**
 * Flush the queue: Send all queued messages to the API.
 * Should be called when the application detects it has come back online.
 */
export async function syncOfflineQueue(apiSendFunction) {
    if (!navigator.onLine) return;

    try {
        const messages = await getQueuedMessages();
        if (messages.length === 0) return;

        console.log(`[OfflineChat] Syncing ${messages.length} queued messages...`);

        for (const msg of messages) {
            try {
                await apiSendFunction(msg.conversation_id, msg.payload);
                await clearQueuedMessage(msg.id);
            } catch (err) {
                console.error(`[OfflineChat] Failed to sync message ${msg.id}:`, err);
                // Stop syncing on first failure to maintain order and avoid flooding
                break;
            }
        }
    } catch (err) {
        console.error('[OfflineChat] Error during sync:', err);
    }
}
