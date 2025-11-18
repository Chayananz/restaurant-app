const db = require('../database/connection');

// ดูพนักงานทั้งหมด
function getAllEmployees(callback) {
    db.all('SELECT * FROM Employee', [], (err, rows) => {
        if (err) {
            console.error('Error:', err.message);
            callback();
            return;
        }
        console.log('\nรายการพนักงานทั้งหมด:');
        console.log('----------------------------------------');
        rows.forEach(row => {
            console.log(`ID: ${row.Employee_ID} | ชื่อ: ${row.Employee_Name} | ตำแหน่ง: ${row.Position}`);
        });
        console.log('----------------------------------------');
        callback();
    });
}

// เพิ่มพนักงานใหม่
function insertEmployee(name, position, callback) {
    db.run('INSERT INTO Employee (Employee_Name, Position) VALUES (?, ?)',
           [name, position],
           function(err) {
        if (err) {
            console.error('Error:', err.message);
            callback();
            return;
        }
        console.log(`เพิ่มพนักงานสำเร็จ! ID: ${this.lastID}`);
        callback();
    });
}

// แก้ไขพนักงาน
function updateEmployee(employeeId, name, position, callback) {
    db.run('UPDATE Employee SET Employee_Name = ?, Position = ? WHERE Employee_ID = ?',
           [name, position, employeeId],
           function(err) {
        if (err) {
            console.error('Error:', err.message);
            callback();
            return;
        }
        console.log(`แก้ไขพนักงานสำเร็จ!`);
        callback();
    });
}

// ลบพนักงาน
function deleteEmployee(employeeId, callback) {
    db.run('DELETE FROM Employee WHERE Employee_ID = ?', [employeeId], function(err) {
        if (err) {
            console.error('Error:', err.message);
            callback();
            return;
        }
        console.log(`ลบพนักงานสำเร็จ!`);
        callback();
    });
}

module.exports = {
    getAllEmployees,
    insertEmployee,
    updateEmployee,
    deleteEmployee
};
