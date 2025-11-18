const db = require('../database/connection');

// ดูโต๊ะทั้งหมด
function getAllTables(callback) {
    db.all('SELECT * FROM `Table` ORDER BY Table_Number', [], (err, rows) => {
        if (err) {
            console.error('Error:', err.message);
            callback();
            return;
        }
        console.log('\nรายการโต๊ะทั้งหมด:');
        console.log('----------------------------------------');
        rows.forEach(row => {
            console.log(`ID: ${row.Table_ID} | โต๊ะ: ${row.Table_Number} | ที่นั่ง: ${row.Capacity} | สถานะ: ${row.Status}`);
        });
        console.log('----------------------------------------');
        callback();
    });
}

// เพิ่มโต๊ะใหม่
function insertTable(tableNumber, capacity, status, callback) {
    db.run('INSERT INTO `Table` (Table_Number, Capacity, Status) VALUES (?, ?, ?)',
           [tableNumber, capacity, status],
           function(err) {
        if (err) {
            console.error('Error:', err.message);
            callback();
            return;
        }
        console.log(`เพิ่มโต๊ะสำเร็จ! ID: ${this.lastID}`);
        callback();
    });
}

// แก้ไขโต๊ะ
function updateTable(tableId, tableNumber, capacity, status, callback) {
    db.run('UPDATE `Table` SET Table_Number = ?, Capacity = ?, Status = ? WHERE Table_ID = ?',
           [tableNumber, capacity, status, tableId],
           function(err) {
        if (err) {
            console.error('Error:', err.message);
            callback();
            return;
        }
        console.log(`แก้ไขโต๊ะสำเร็จ!`);
        callback();
    });
}

// เปลี่ยนสถานะโต๊ะ
function updateTableStatus(tableId, newStatus, callback) {
    db.run('UPDATE `Table` SET Status = ? WHERE Table_ID = ?',
           [newStatus, tableId],
           function(err) {
        if (err) {
            console.error('Error:', err.message);
            callback();
            return;
        }
        console.log(`เปลี่ยนสถานะโต๊ะสำเร็จ!`);
        callback();
    });
}

// ลบโต๊ะ
function deleteTable(tableId, callback) {
    db.run('DELETE FROM `Table` WHERE Table_ID = ?', [tableId], function(err) {
        if (err) {
            console.error('Error:', err.message);
            callback();
            return;
        }
        console.log(`ลบโต๊ะสำเร็จ!`);
        callback();
    });
}

// Export ทุก function เพื่อให้ไฟล์อื่นใช้งาน
module.exports = {
    getAllTables,
    insertTable,
    updateTable,
    updateTableStatus,
    deleteTable
};
