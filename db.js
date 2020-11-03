let db = request.result;
const request = window.indexedDB.open("budget", 1);
request.onupgradeneeded = function(event) {
    const budgetStore = db.createObjectStore ("pending");
};

request.onsuccess = function(event) {
    const db = target.result;

    if (navigator.onLine) {
        checkDatabase();
    }
};

request.onerror = function(event) {

};

function saveRecord(record) {
    const transaction = db.transaction(["pending"], "readwrite");

    const pendingStore = transaction.objectStore("pending");

}

function checkDatabase() {}

