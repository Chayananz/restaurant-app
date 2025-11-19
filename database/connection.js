const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// เชื่อมต่อฐานข้อมูล
const dbPath = path.join(__dirname, '..', 'restaurant.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error:', err);
    } else {
        console.log('เชื่อมต่อฐานข้อมูลสำเร็จ');

        // เปิดใช้งาน Foreign Key Constraints (สำคัญมากสำหรับ SQLite)
        db.run('PRAGMA foreign_keys = ON', (err) => {
            if (err) {
                console.error('Error enabling foreign keys:', err);
            } else {
                console.log('Foreign Key Constraints เปิดใช้งานแล้ว');
            }
        });
    }
});

// Export ตัวแปร db เพื่อให้ไฟล์อื่นใช้งาน
module.exports = db;
