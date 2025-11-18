# คู่มืออธิบาย 5 Operations แบบละเอียด

## 📚 สารบัญ
1. [CREATE (Insert) - เพิ่มข้อมูล](#1-create-insert---เพิ่มข้อมูล)
2. [READ (Select/Connect) - อ่านข้อมูล](#2-read-selectconnect---อ่านข้อมูล)
3. [UPDATE (Edit) - แก้ไขข้อมูล](#3-update-edit---แก้ไขข้อมูล)
4. [DELETE - ลบข้อมูล](#4-delete---ลบข้อมูล)
5. [CONNECT - เชื่อมต่อฐานข้อมูล](#5-connect---เชื่อมต่อฐานข้อมูล)

---

## 1. CREATE (Insert) - เพิ่มข้อมูล

### 📍 อยู่ที่ไหน?
**ไฟล์:** `server.js` บรรทัด 288-453

### 🎯 ทำอะไร?
เพิ่มข้อมูลใหม่เข้าไปในตาราง

### ✅ เงื่อนไขที่ต้องตรง:
1. ต้องใช้ HTTP Method `POST`
2. ต้องส่งข้อมูลในรูปแบบ JSON
3. ต้องมี Header `Content-Type: application/json`
4. ข้อมูลที่ส่งต้องครบตามที่กำหนด (NOT NULL fields)

---

### 🔍 ตัวอย่าง 1: เพิ่มโต๊ะใหม่

#### ตำแหน่งในโค้ด:
```javascript
// server.js บรรทัด 288-310
app.post('/api/tables', (req, res) => {
    const { tableNumber, capacity, status } = req.body;

    if (!tableNumber || !capacity) {
        res.status(400).json({ error: 'Table number and capacity are required' });
        return;
    }

    db.run(
        'INSERT INTO `Table` (Table_Number, Capacity, Status) VALUES (?, ?, ?)',
        [tableNumber, capacity, status || 'ว่าง'],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({
                message: 'Table created successfully',
                tableId: this.lastID
            });
        }
    );
});
```

#### วิธีใช้งาน:
```javascript
// ส่ง Request แบบนี้
fetch('http://localhost:3000/api/tables', {
    method: 'POST',  // ← ต้องเป็น POST
    headers: {
        'Content-Type': 'application/json'  // ← ต้องมี Header นี้
    },
    body: JSON.stringify({
        tableNumber: 11,    // ← จำเป็น (required)
        capacity: 4,        // ← จำเป็น (required)
        status: 'ว่าง'      // ← ไม่จำเป็น (optional, default = 'ว่าง')
    })
})
.then(res => res.json())
.then(data => console.log(data));
```

#### เงื่อนไขที่ต้องผ่าน:
```javascript
// 1. ตรวจสอบว่ามีข้อมูลครบไหม?
if (!tableNumber || !capacity) {
    // ถ้าไม่ครบ → Error 400
    res.status(400).json({ error: 'Table number and capacity are required' });
    return;
}

// 2. INSERT ลงฐานข้อมูล
db.run('INSERT INTO `Table` ...', [...], function(err) {
    if (err) {
        // ถ้า INSERT ไม่สำเร็จ → Error 500
        res.status(500).json({ error: err.message });
    } else {
        // สำเร็จ → ส่ง ID กลับ
        res.json({ tableId: this.lastID });
    }
});
```

---

### 🔍 ตัวอย่าง 2: เพิ่มพนักงานใหม่

#### ตำแหน่งในโค้ด:
```javascript
// server.js บรรทัด 341-363
app.post('/api/employees', (req, res) => {
    const { employeeName, position } = req.body;

    if (!employeeName || !position) {
        res.status(400).json({ error: 'Employee name and position are required' });
        return;
    }

    db.run(
        'INSERT INTO Employee (Employee_Name, Position) VALUES (?, ?)',
        [employeeName, position],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({
                message: 'Employee created successfully',
                employeeId: this.lastID
            });
        }
    );
});
```

#### วิธีใช้งาน:
```javascript
fetch('http://localhost:3000/api/employees', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        employeeName: 'สมศรี ใจดี',  // ← จำเป็น
        position: 'พนักงานเสิร์ฟ'      // ← จำเป็น
    })
})
.then(res => res.json())
.then(data => console.log(data));
```

---

### 🔍 ตัวอย่าง 3: เพิ่มเมนูใหม่

#### ตำแหน่งในโค้ด:
```javascript
// server.js บรรทัด 394-416
app.post('/api/menu', (req, res) => {
    const { menuName, menuPrice, category } = req.body;

    if (!menuName || !menuPrice) {
        res.status(400).json({ error: 'Menu name and price are required' });
        return;
    }

    db.run(
        'INSERT INTO Menu (Menu_Name, Menu_Price, Category) VALUES (?, ?, ?)',
        [menuName, menuPrice, category],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({
                message: 'Menu item created successfully',
                menuId: this.lastID
            });
        }
    );
});
```

#### วิธีใช้งาน:
```javascript
fetch('http://localhost:3000/api/menu', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        menuName: 'ส้มตำ',       // ← จำเป็น
        menuPrice: 45,          // ← จำเป็น
        category: 'อาหารจานหลัก' // ← ไม่จำเป็น (optional)
    })
})
.then(res => res.json())
.then(data => console.log(data));
```

---

## 2. READ (Select/Connect) - อ่านข้อมูล

### 📍 อยู่ที่ไหน?
**ไฟล์:** `server.js` บรรทัด 24-286

### 🎯 ทำอะไร?
ดึงข้อมูลจากฐานข้อมูลมาแสดง

### ✅ เงื่อนไขที่ต้องตรง:
1. ต้องใช้ HTTP Method `GET`
2. ไม่ต้องส่ง Body
3. สามารถส่ง Parameter ผ่าน URL ได้

---

### 🔍 ตัวอย่าง 1: อ่านข้อมูลโต๊ะทั้งหมด

#### ตำแหน่งในโค้ด:
```javascript
// server.js บรรทัด 24-32
app.get('/api/tables', (req, res) => {
    db.all('SELECT * FROM `Table` ORDER BY Table_Number', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});
```

#### วิธีใช้งาน:
```javascript
// แค่เรียก GET ไม่ต้องส่งอะไร
fetch('http://localhost:3000/api/tables')
    .then(res => res.json())
    .then(data => console.log(data));
```

#### SQL ที่ทำงาน:
```sql
SELECT * FROM `Table` ORDER BY Table_Number
```

#### ได้ผลลัพธ์:
```json
[
  {
    "Table_ID": 1,
    "Table_Number": 1,
    "Capacity": 4,
    "Status": "ว่าง"
  },
  {
    "Table_ID": 2,
    "Table_Number": 2,
    "Capacity": 4,
    "Status": "กำลังใช้งาน"
  }
]
```

---

### 🔍 ตัวอย่าง 2: อ่านข้อมูลพนักงานทั้งหมด

#### ตำแหน่งในโค้ด:
```javascript
// server.js บรรทัด 80-88
app.get('/api/employees', (req, res) => {
    db.all('SELECT * FROM Employee', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});
```

#### วิธีใช้งาน:
```javascript
fetch('http://localhost:3000/api/employees')
    .then(res => res.json())
    .then(data => console.log(data));
```

---

### 🔍 ตัวอย่าง 3: อ่านข้อมูลออเดอร์เฉพาะ ID

#### ตำแหน่งในโค้ด:
```javascript
// server.js บรรทัด 159-197
app.get('/api/order/:orderId', (req, res) => {
    const orderId = req.params.orderId;  // ← รับ parameter จาก URL

    db.get(
        `SELECT o.*, t.Table_Number, e.Employee_Name
         FROM \`Order\` o
         LEFT JOIN \`Table\` t ON o.Table_ID = t.Table_ID
         LEFT JOIN Employee e ON o.Employee_ID = e.Employee_ID
         WHERE o.Order_ID = ?`,
        [orderId],
        (err, order) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }

            if (!order) {
                res.status(404).json({ error: 'Order not found' });
                return;
            }

            db.all(
                `SELECT od.*, m.Menu_Name, m.Menu_Price
                 FROM OrderDetail od
                 LEFT JOIN Menu m ON od.Menu_ID = m.Menu_ID
                 WHERE od.Order_ID = ?`,
                [orderId],
                (err, details) => {
                    if (err) {
                        res.status(500).json({ error: err.message });
                        return;
                    }
                    res.json({ order, details });
                }
            );
        }
    );
});
```

#### วิธีใช้งาน:
```javascript
// ส่ง orderId ผ่าน URL
fetch('http://localhost:3000/api/order/1')  // ← 1 = orderId
    .then(res => res.json())
    .then(data => console.log(data));
```

#### เงื่อนไขที่ต้องผ่าน:
```javascript
// 1. ต้องมี orderId ใน URL
const orderId = req.params.orderId;

// 2. ตรวจสอบว่ามีออเดอร์นี้ในฐานข้อมูลไหม?
if (!order) {
    // ถ้าไม่เจอ → Error 404
    res.status(404).json({ error: 'Order not found' });
}
```

---

## 3. UPDATE (Edit) - แก้ไขข้อมูล

### 📍 อยู่ที่ไหน?
**ไฟล์:** `server.js` บรรทัด 312-433

### 🎯 ทำอะไร?
แก้ไขข้อมูลที่มีอยู่แล้วในฐานข้อมูล

### ✅ เงื่อนไขที่ต้องตรง:
1. ต้องใช้ HTTP Method `PUT`
2. ต้องส่ง ID ของข้อมูลที่ต้องการแก้ผ่าน URL
3. ต้องส่งข้อมูลใหม่ในรูปแบบ JSON
4. ต้องมี Header `Content-Type: application/json`

---

### 🔍 ตัวอย่าง 1: แก้ไขข้อมูลโต๊ะ

#### ตำแหน่งในโค้ด:
```javascript
// server.js บรรทัด 312-327
app.put('/api/tables/:tableId', (req, res) => {
    const tableId = req.params.tableId;  // ← รับ ID จาก URL
    const { tableNumber, capacity, status } = req.body;  // ← รับข้อมูลใหม่

    db.run(
        'UPDATE `Table` SET Table_Number = ?, Capacity = ?, Status = ? WHERE Table_ID = ?',
        [tableNumber, capacity, status, tableId],  // ← ใช้ WHERE เพื่อระบุแถวที่จะแก้
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ message: 'Table updated successfully' });
        }
    );
});
```

#### วิธีใช้งาน:
```javascript
// แก้ไขโต๊ะ ID = 1
fetch('http://localhost:3000/api/tables/1', {  // ← ส่ง ID ใน URL
    method: 'PUT',  // ← ต้องเป็น PUT
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        tableNumber: 1,
        capacity: 6,              // ← เปลี่ยนจาก 4 เป็น 6
        status: 'กำลังใช้งาน'     // ← เปลี่ยนสถานะ
    })
})
.then(res => res.json())
.then(data => console.log(data));
```

#### SQL ที่ทำงาน:
```sql
UPDATE `Table`
SET Table_Number = 1,
    Capacity = 6,
    Status = 'กำลังใช้งาน'
WHERE Table_ID = 1
```

---

### 🔍 ตัวอย่าง 2: แก้ไขข้อมูลพนักงาน

#### ตำแหน่งในโค้ด:
```javascript
// server.js บรรทัด 365-380
app.put('/api/employees/:employeeId', (req, res) => {
    const employeeId = req.params.employeeId;
    const { employeeName, position } = req.body;

    db.run(
        'UPDATE Employee SET Employee_Name = ?, Position = ? WHERE Employee_ID = ?',
        [employeeName, position, employeeId],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ message: 'Employee updated successfully' });
        }
    );
});
```

#### วิธีใช้งาน:
```javascript
// แก้ไขพนักงาน ID = 1
fetch('http://localhost:3000/api/employees/1', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        employeeName: 'สมชาย มีความสุข',  // ← เปลี่ยนชื่อ
        position: 'หัวหน้าพนักงาน'          // ← เลื่อนตำแหน่ง
    })
})
.then(res => res.json())
.then(data => console.log(data));
```

---

### 🔍 ตัวอย่าง 3: เปลี่ยนสถานะโต๊ะ (แบบพิเศษ)

#### ตำแหน่งในโค้ด:
```javascript
// server.js บรรทัด 34-78
app.get('/api/updateStatus/:tableId', (req, res) => {
    const tableId = req.params.tableId;

    // 1. อ่านสถานะปัจจุบัน
    db.get('SELECT Status FROM `Table` WHERE Table_ID = ?', [tableId], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        if (!row) {
            res.status(404).json({ error: 'Table not found' });
            return;
        }

        // 2. กำหนดสถานะใหม่ตามลำดับ
        let newStatus;
        switch (row.Status) {
            case 'ว่าง':
                newStatus = 'กำลังใช้งาน';
                break;
            case 'กำลังใช้งาน':
                newStatus = 'กำลังจัดการ';
                break;
            case 'กำลังจัดการ':
                newStatus = 'ว่าง';
                break;
            default:
                newStatus = 'ว่าง';
        }

        // 3. อัพเดทสถานะใหม่
        db.run('UPDATE `Table` SET Status = ? WHERE Table_ID = ?', [newStatus, tableId], function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ message: 'Status updated', newStatus: newStatus });
        });
    });
});
```

#### วิธีใช้งาน:
```javascript
// แค่เรียก GET ก็เปลี่ยนสถานะได้
fetch('http://localhost:3000/api/updateStatus/1')
    .then(res => res.json())
    .then(data => console.log(data));
```

#### เงื่อนไขการเปลี่ยนสถานะ:
```
ว่าง → กำลังใช้งาน → กำลังจัดการ → ว่าง (วนซ้ำ)
```

---

## 4. DELETE - ลบข้อมูล

### 📍 อยู่ที่ไหน?
**ไฟล์:** `server.js` บรรทัด 329-471

### 🎯 ทำอะไร?
ลบข้อมูลออกจากฐานข้อมูล

### ✅ เงื่อนไขที่ต้องตรง:
1. ต้องใช้ HTTP Method `DELETE`
2. ต้องส่ง ID ของข้อมูลที่ต้องการลบผ่าน URL
3. ข้อมูลที่เกี่ยวข้อง (Foreign Key) ต้องลบก่อน

---

### 🔍 ตัวอย่าง 1: ลบโต๊ะ

#### ตำแหน่งในโค้ด:
```javascript
// server.js บรรทัด 329-339
app.delete('/api/tables/:tableId', (req, res) => {
    const tableId = req.params.tableId;  // ← รับ ID จาก URL

    db.run('DELETE FROM `Table` WHERE Table_ID = ?', [tableId], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Table deleted successfully' });
    });
});
```

#### วิธีใช้งาน:
```javascript
// ลบโต๊ะ ID = 11
fetch('http://localhost:3000/api/tables/11', {
    method: 'DELETE'  // ← ต้องเป็น DELETE
})
.then(res => res.json())
.then(data => console.log(data));
```

#### SQL ที่ทำงาน:
```sql
DELETE FROM `Table` WHERE Table_ID = 11
```

---

### 🔍 ตัวอย่าง 2: ลบพนักงาน

#### ตำแหน่งในโค้ด:
```javascript
// server.js บรรทัด 382-392
app.delete('/api/employees/:employeeId', (req, res) => {
    const employeeId = req.params.employeeId;

    db.run('DELETE FROM Employee WHERE Employee_ID = ?', [employeeId], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Employee deleted successfully' });
    });
});
```

#### วิธีใช้งาน:
```javascript
fetch('http://localhost:3000/api/employees/4', {
    method: 'DELETE'
})
.then(res => res.json())
.then(data => console.log(data));
```

---

### 🔍 ตัวอย่าง 3: ลบออเดอร์ (แบบซับซ้อน - ต้องลบหลายตาราง)

#### ตำแหน่งในโค้ด:
```javascript
// server.js บรรทัด 447-471
app.delete('/api/orders/:orderId', (req, res) => {
    const orderId = req.params.orderId;

    // ต้องลบตามลำดับ เพราะมี Foreign Key

    // 1. ลบ OrderDetail ก่อน
    db.run('DELETE FROM OrderDetail WHERE Order_ID = ?', [orderId], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        // 2. ลบ Receipt
        db.run('DELETE FROM Receipt WHERE Order_ID = ?', [orderId], function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }

            // 3. ลบ Order สุดท้าย
            db.run('DELETE FROM `Order` WHERE Order_ID = ?', [orderId], function(err) {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                res.json({ message: 'Order deleted successfully' });
            });
        });
    });
});
```

#### วิธีใช้งาน:
```javascript
fetch('http://localhost:3000/api/orders/1', {
    method: 'DELETE'
})
.then(res => res.json())
.then(data => console.log(data));
```

#### เงื่อนไขสำคัญ:
```javascript
// ⚠️ ต้องลบตามลำดับ!
// 1. ลบ OrderDetail ก่อน (ตารางลูก)
// 2. ลบ Receipt (ตารางลูก)
// 3. ลบ Order (ตารางแม่)

// ถ้าลบไม่ตามลำดับ → จะเกิด Foreign Key Constraint Error
```

---

## 5. CONNECT - เชื่อมต่อฐานข้อมูล

### 📍 อยู่ที่ไหน?
**ไฟล์:** `server.js` บรรทัด 15-22

### 🎯 ทำอะไร?
สร้างการเชื่อมต่อกับฐานข้อมูล SQLite

### ✅ เงื่อนไขที่ต้องตรง:
1. ไฟล์ฐานข้อมูล `restaurant.db` ต้องมีอยู่
2. ต้องมี Permission ในการอ่าน/เขียนไฟล์

---

### 🔍 การเชื่อมต่อฐานข้อมูล

#### ตำแหน่งในโค้ด:
```javascript
// server.js บรรทัด 15-22
const dbPath = path.join(__dirname, 'restaurant.db');  // ← หา path ของไฟล์ database
const db = new sqlite3.Database(dbPath, (err) => {     // ← สร้าง connection
    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('Connected to SQLite database');
    }
});
```

#### อธิบายแต่ละส่วน:
```javascript
// 1. กำหนด path ของไฟล์ database
const dbPath = path.join(__dirname, 'restaurant.db');
// → c:\Users\wave\Desktop\restaurant-app\restaurant.db

// 2. สร้าง database connection object
const db = new sqlite3.Database(dbPath, callback);

// 3. Callback function เมื่อเชื่อมต่อสำเร็จหรือผิดพลาด
(err) => {
    if (err) {
        // เชื่อมต่อไม่สำเร็จ
        console.error('Error connecting to database:', err);
    } else {
        // เชื่อมต่อสำเร็จ
        console.log('Connected to SQLite database');
    }
}
```

---

### 🔍 การใช้งาน Database Connection

#### ทุก API ใช้ connection object `db` เดียวกัน:

```javascript
// ตัวอย่างการใช้งาน db object

// 1. db.all() - ดึงข้อมูลหลายแถว
db.all('SELECT * FROM `Table`', [], (err, rows) => {
    // rows = array of objects
});

// 2. db.get() - ดึงข้อมูลแถวเดียว
db.get('SELECT * FROM `Table` WHERE Table_ID = ?', [1], (err, row) => {
    // row = single object
});

// 3. db.run() - INSERT, UPDATE, DELETE
db.run('INSERT INTO `Table` (...) VALUES (...)', [...], function(err) {
    // this.lastID = ID ของแถวที่เพิ่งเพิ่ม
    // this.changes = จำนวนแถวที่ได้รับผลกระทบ
});

// 4. db.prepare() - สำหรับ INSERT หลายแถว
const stmt = db.prepare('INSERT INTO Table (...) VALUES (?, ?)');
stmt.run(value1, value2);
stmt.run(value3, value4);
stmt.finalize();
```

---

### 🔍 การจัดการ Connection

#### เปิด Connection:
```javascript
// เปิด connection ตอน server start
const db = new sqlite3.Database(dbPath);
```

#### ปิด Connection:
```javascript
// ปิด connection ตอน server stop
db.close((err) => {
    if (err) {
        console.error('Error closing database:', err);
    } else {
        console.log('Database closed successfully!');
    }
});
```

#### ตัวอย่างใน `init-database.js`:
```javascript
// init-database.js บรรทัด 100-106

// เปิด connection
const db = new sqlite3.Database(dbPath);

// ทำงานกับ database
db.serialize(() => {
    // CREATE TABLE, INSERT data
});

// ปิด connection เมื่อเสร็จ
db.close((err) => {
    if (err) {
        console.error('Error closing database:', err);
    } else {
        console.log('Database initialized and closed successfully!');
    }
});
```

---

## 📊 สรุปเงื่อนไขแต่ละ Operation

| Operation | HTTP Method | ต้องส่ง Body? | ต้องส่ง ID? | ต้องมี Header? |
|-----------|-------------|--------------|------------|---------------|
| **CREATE** | POST | ✅ ใช่ | ❌ ไม่ | ✅ Content-Type: application/json |
| **READ** | GET | ❌ ไม่ | บางครั้ง | ❌ ไม่ |
| **UPDATE** | PUT | ✅ ใช่ | ✅ ใช่ | ✅ Content-Type: application/json |
| **DELETE** | DELETE | ❌ ไม่ | ✅ ใช่ | ❌ ไม่ |
| **CONNECT** | - | - | - | - |

---

## 🧪 ทดสอบทุก Operation

### ทดสอบในลำดับ:
```javascript
// 1. CONNECT - เชื่อมต่อฐานข้อมูล (อัตโนมัติตอน start server)
// npm start

// 2. READ - อ่านข้อมูลโต๊ะทั้งหมด
fetch('http://localhost:3000/api/tables')
    .then(res => res.json())
    .then(data => console.log('READ:', data));

// 3. CREATE - เพิ่มโต๊ะใหม่
fetch('http://localhost:3000/api/tables', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tableNumber: 11, capacity: 4, status: 'ว่าง' })
})
    .then(res => res.json())
    .then(data => console.log('CREATE:', data));

// 4. UPDATE - แก้ไขโต๊ะ
fetch('http://localhost:3000/api/tables/11', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tableNumber: 11, capacity: 6, status: 'กำลังใช้งาน' })
})
    .then(res => res.json())
    .then(data => console.log('UPDATE:', data));

// 5. DELETE - ลบโต๊ะ
fetch('http://localhost:3000/api/tables/11', {
    method: 'DELETE'
})
    .then(res => res.json())
    .then(data => console.log('DELETE:', data));
```

---

## ⚠️ ข้อควรระวัง

### 1. Foreign Key Constraints
```javascript
// ❌ ลบไม่ได้ ถ้ามีข้อมูลเชื่อมโยง
DELETE FROM Employee WHERE Employee_ID = 1
// → Error: มี Order ที่ใช้ Employee_ID = 1

// ✅ ต้องลบข้อมูลที่เชื่อมโยงก่อน
DELETE FROM `Order` WHERE Employee_ID = 1  // ลบออเดอร์ก่อน
DELETE FROM Employee WHERE Employee_ID = 1  // แล้วค่อยลบพนักงาน
```

### 2. Data Validation
```javascript
// ❌ ข้อมูลไม่ครบ
{ tableNumber: 11 }  // ไม่มี capacity → Error

// ✅ ข้อมูลครบ
{ tableNumber: 11, capacity: 4 }  // OK
```

### 3. SQL Injection Protection
```javascript
// ❌ อันตราย - ไม่ใช้ parameterized query
db.run(`DELETE FROM Table WHERE Table_ID = ${tableId}`);

// ✅ ปลอดภัย - ใช้ ? placeholder
db.run('DELETE FROM Table WHERE Table_ID = ?', [tableId]);
```

---

## 🎓 สรุป

แต่ละ Operation มีจุดประสงค์และเงื่อนไขที่ต่างกัน:

1. **CREATE** → เพิ่มข้อมูลใหม่ (POST + Body)
2. **READ** → อ่านข้อมูล (GET)
3. **UPDATE** → แก้ไขข้อมูล (PUT + ID + Body)
4. **DELETE** → ลบข้อมูล (DELETE + ID)
5. **CONNECT** → เชื่อมต่อ database (อัตโนมัติ)

ทุก Operation ต้องผ่านการตรวจสอบ error และ validation ก่อนทำงานจริง! ✅
