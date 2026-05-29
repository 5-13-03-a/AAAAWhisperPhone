/* ============ WhisperPhone IndexedDB Engine ============ */
/* 用法：
 *   await WhisperDB.set('key', anyValueIncludingObjectsAndBlobs);
 *   const val = await WhisperDB.get('key');
 *   await WhisperDB.remove('key');
 *   const allKeys = await WhisperDB.keys();
 *   await WhisperDB.clear();
 *   const { usage, quota } = await WhisperDB.estimate();
 */
const WhisperDB = (() => {
    const DB_NAME    = 'WhisperPhoneDB';
    const STORE_NAME = 'kv';
    const DB_VERSION = 1;

    let _dbPromise = null;

    function openDB() {
        if (_dbPromise) return _dbPromise;
        _dbPromise = new Promise((resolve, reject) => {
            if (!('indexedDB' in window)) {
                reject(new Error('IndexedDB is not supported in this browser.'));
                return;
            }
            const req = indexedDB.open(DB_NAME, DB_VERSION);
            req.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME);
                }
            };
            req.onsuccess = (e) => resolve(e.target.result);
            req.onerror   = (e) => {
                _dbPromise = null;
                reject(e.target.error);
            };
            req.onblocked = () => {
                console.warn('[WhisperDB] open blocked by another tab');
            };
        });
        return _dbPromise;
    }

    function tx(mode) {
        return openDB().then(db => {
            const t = db.transaction(STORE_NAME, mode);
            return t.objectStore(STORE_NAME);
        });
    }

    async function set(key, value) {
        const store = await tx('readwrite');
        return new Promise((resolve, reject) => {
            const req = store.put(value, key);
            req.onsuccess = () => resolve(true);
            req.onerror   = (e) => reject(e.target.error);
        });
    }

    async function get(key) {
        const store = await tx('readonly');
        return new Promise((resolve, reject) => {
            const req = store.get(key);
            req.onsuccess = (e) => resolve(e.target.result?? null);
            req.onerror   = (e) => reject(e.target.error);
        });
    }

    async function remove(key) {
        const store = await tx('readwrite');
        return new Promise((resolve, reject) => {
            const req = store.delete(key);
            req.onsuccess = () => resolve(true);
            req.onerror   = (e) => reject(e.target.error);
        });
    }

    async function keys() {
        const store = await tx('readonly');
        return new Promise((resolve, reject) => {
            const req = store.getAllKeys();
            req.onsuccess = (e) => resolve(e.target.result || []);
            req.onerror   = (e) => reject(e.target.error);
        });
    }

    async function clear() {
        const store = await tx('readwrite');
        return new Promise((resolve, reject) => {
            const req = store.clear();
            req.onsuccess = () => resolve(true);
            req.onerror   = (e) => reject(e.target.error);
        });
    }

    async function estimate() {
        if (navigator.storage && navigator.storage.estimate) {
            try {
                const r = await navigator.storage.estimate();
                return { usage: r.usage || 0, quota: r.quota || 0 };
            } catch (e) {
                return { usage: 0, quota: 0 };
            }
        }
        return { usage: 0, quota: 0 };
    }

    // 主动请求持久化存储权限（防止浏览器在空间紧张时清除数据）
    async function persist() {
        if (navigator.storage && navigator.storage.persist) {
            try { return await navigator.storage.persist(); } catch (e) { return false; }
        }
        return false;
    }

    return { set, get, remove, keys, clear, estimate, persist, _open: openDB };
})();

window.WhisperDB = WhisperDB;

// 自动尝试申请持久化权限（拒绝也无所谓，不影响读写）
WhisperDB.persist().then(ok => {
    if (ok) console.log('[WhisperDB] storage persisted');
});
