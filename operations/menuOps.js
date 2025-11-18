const db = require('../database/connection');

// ดูเมนูทั้งหมด
function getAllMenu(callback) {
    db.all('SELECT * FROM Menu ORDER BY Category, Menu_Name', [], (err, rows) => {
        if (err) {
            console.error('Error:', err.message);
            callback();
            return;
        }
        console.log('\nรายการเมนูทั้งหมด:');
        console.log('----------------------------------------');
        rows.forEach(row => {
            console.log(`ID: ${row.Menu_ID} | เมนู: ${row.Menu_Name} | ราคา: ${row.Menu_Price} บาท | หมวด: ${row.Category}`);
        });
        console.log('----------------------------------------');
        callback();
    });
}

// เพิ่มเมนูใหม่
function insertMenu(menuName, menuPrice, category, callback) {
    db.run('INSERT INTO Menu (Menu_Name, Menu_Price, Category) VALUES (?, ?, ?)',
           [menuName, menuPrice, category],
           function(err) {
        if (err) {
            console.error('Error:', err.message);
            callback();
            return;
        }
        console.log(`เพิ่มเมนูสำเร็จ! ID: ${this.lastID}`);
        callback();
    });
}

// แก้ไขเมนู
function updateMenu(menuId, menuName, menuPrice, category, callback) {
    db.run('UPDATE Menu SET Menu_Name = ?, Menu_Price = ?, Category = ? WHERE Menu_ID = ?',
           [menuName, menuPrice, category, menuId],
           function(err) {
        if (err) {
            console.error('Error:', err.message);
            callback();
            return;
        }
        console.log(`แก้ไขเมนูสำเร็จ!`);
        callback();
    });
}

// ลบเมนู
function deleteMenu(menuId, callback) {
    db.run('DELETE FROM Menu WHERE Menu_ID = ?', [menuId], function(err) {
        if (err) {
            console.error('Error:', err.message);
            callback();
            return;
        }
        console.log(`ลบเมนูสำเร็จ!`);
        callback();
    });
}

// ดูเมนูตามหมวดหมู่
function getMenuByCategory(category, callback) {
    db.all('SELECT * FROM Menu WHERE Category = ? ORDER BY Menu_Name', [category], (err, rows) => {
        if (err) {
            console.error('Error:', err.message);
            callback();
            return;
        }
        console.log(`\nรายการเมนูหมวด "${category}":`);
        console.log('----------------------------------------');
        if (rows.length === 0) {
            console.log('ไม่พบเมนูในหมวดนี้');
        } else {
            rows.forEach(row => {
                console.log(`ID: ${row.Menu_ID} | เมนู: ${row.Menu_Name} | ราคา: ${row.Menu_Price} บาท`);
            });
        }
        console.log('----------------------------------------');
        callback();
    });
}

// ดูเมนูเรียงตามราคา (จากน้อยไปมาก)
function getMenuByPriceAsc(callback) {
    db.all('SELECT * FROM Menu ORDER BY Menu_Price ASC, Menu_Name', [], (err, rows) => {
        if (err) {
            console.error('Error:', err.message);
            callback();
            return;
        }
        console.log('\nรายการเมนู (ราคาน้อย → มาก):');
        console.log('----------------------------------------');
        rows.forEach(row => {
            console.log(`ID: ${row.Menu_ID} | เมนู: ${row.Menu_Name} | ราคา: ${row.Menu_Price} บาท | หมวด: ${row.Category}`);
        });
        console.log('----------------------------------------');
        callback();
    });
}

// ดูเมนูเรียงตามราคา (จากมากไปน้อย)
function getMenuByPriceDesc(callback) {
    db.all('SELECT * FROM Menu ORDER BY Menu_Price DESC, Menu_Name', [], (err, rows) => {
        if (err) {
            console.error('Error:', err.message);
            callback();
            return;
        }
        console.log('\nรายการเมนู (ราคามาก → น้อย):');
        console.log('----------------------------------------');
        rows.forEach(row => {
            console.log(`ID: ${row.Menu_ID} | เมนู: ${row.Menu_Name} | ราคา: ${row.Menu_Price} บาท | หมวด: ${row.Category}`);
        });
        console.log('----------------------------------------');
        callback();
    });
}

// ดูหมวดหมู่ทั้งหมดที่มี
function getAllCategories(callback) {
    db.all('SELECT DISTINCT Category FROM Menu ORDER BY Category', [], (err, rows) => {
        if (err) {
            console.error('Error:', err.message);
            callback();
            return;
        }
        console.log('\nหมวดหมู่ทั้งหมด:');
        console.log('----------------------------------------');
        rows.forEach((row, index) => {
            console.log(`${index + 1}. ${row.Category}`);
        });
        console.log('----------------------------------------');
        callback(rows);
    });
}

// ดูเมนูตามหมวดหมู่พร้อมเรียงราคา
function getMenuByCategorySort(category, sortOrder, callback) {
    const orderBy = sortOrder === 'ASC' ? 'ASC' : 'DESC';
    const sql = `SELECT * FROM Menu WHERE Category = ? ORDER BY Menu_Price ${orderBy}, Menu_Name`;

    db.all(sql, [category], (err, rows) => {
        if (err) {
            console.error('Error:', err.message);
            callback();
            return;
        }
        const sortText = sortOrder === 'ASC' ? 'ราคาน้อย → มาก' : 'ราคามาก → น้อย';
        console.log(`\nรายการเมนูหมวด "${category}" (${sortText}):`);
        console.log('----------------------------------------');
        if (rows.length === 0) {
            console.log('ไม่พบเมนูในหมวดนี้');
        } else {
            rows.forEach(row => {
                console.log(`ID: ${row.Menu_ID} | เมนู: ${row.Menu_Name} | ราคา: ${row.Menu_Price} บาท`);
            });
        }
        console.log('----------------------------------------');
        callback();
    });
}

module.exports = {
    getAllMenu,
    insertMenu,
    updateMenu,
    deleteMenu,
    getMenuByCategory,
    getMenuByPriceAsc,
    getMenuByPriceDesc,
    getAllCategories,
    getMenuByCategorySort
};
