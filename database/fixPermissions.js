#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('\n========================================');
console.log('🔧 แก้ไขปัญหา SQLITE_READONLY');
console.log('========================================\n');

const dbPath = path.join(__dirname, '..', 'restaurant.db');
const dbDir = path.dirname(dbPath);

console.log('📍 ตำแหน่งไฟล์ database:', dbPath);
console.log('📁 ตำแหน่ง directory:', dbDir);
console.log('');

// ตรวจสอบว่าไฟล์ database มีอยู่หรือไม่
if (!fs.existsSync(dbPath)) {
    console.log('❌ ไม่พบไฟล์ database!');
    console.log('💡 โปรดรัน: node database/createSchema.js ก่อน\n');
    process.exit(1);
}

console.log('🔍 ตรวจสอบ permissions ปัจจุบัน...\n');

try {
    // ตรวจสอบ permissions ของ database file
    const dbStats = fs.statSync(dbPath);
    const dbMode = (dbStats.mode & parseInt('777', 8)).toString(8);
    console.log(`   Database file permissions: ${dbMode}`);

    // ตรวจสอบ permissions ของ directory
    const dirStats = fs.statSync(dbDir);
    const dirMode = (dirStats.mode & parseInt('777', 8)).toString(8);
    console.log(`   Directory permissions: ${dirMode}\n`);

    console.log('🔧 แก้ไข permissions...\n');

    // แก้ไข permissions ของ database file
    if (process.platform !== 'win32') {
        try {
            execSync(`chmod 666 "${dbPath}"`, { stdio: 'inherit' });
            console.log('   ✅ แก้ไข database file permissions เป็น 666 (rw-rw-rw-)');
        } catch (err) {
            console.log('   ⚠️  ไม่สามารถแก้ไข database file permissions:', err.message);
        }

        // ตรวจสอบ และแก้ไข permissions ของ directory (ถ้าจำเป็น)
        if (dirMode[0] < '7') {
            try {
                execSync(`chmod 755 "${dbDir}"`, { stdio: 'inherit' });
                console.log('   ✅ แก้ไข directory permissions เป็น 755 (rwxr-xr-x)');
            } catch (err) {
                console.log('   ⚠️  ไม่สามารถแก้ไข directory permissions:', err.message);
            }
        }
    }

    // ตรวจสอบและปิดโปรเซสที่กำลังใช้งาน database
    console.log('\n🔍 ตรวจสอบโปรเซสที่เปิด database...\n');

    try {
        const lsofOutput = execSync(`lsof "${dbPath}" 2>/dev/null || echo ""`, { encoding: 'utf8' });

        if (lsofOutput.trim() !== '') {
            console.log('⚠️  พบโปรเซสกำลังใช้งาน database:');
            console.log(lsofOutput);

            if (lsofOutput.includes('DB Browser') || lsofOutput.includes('DB Bro')) {
                console.log('\n❌ ต้องปิด DB Browser for SQLite ก่อน!');
                console.log('💡 กรุณาปิด DB Browser แล้วรันสคริปต์นี้อีกครั้ง\n');
                process.exit(1);
            }

            console.log('⚠️  แนะนำให้ปิดโปรเซสเหล่านี้ก่อน\n');
        } else {
            console.log('   ✅ ไม่มีโปรเซสกำลังใช้งาน database');
        }
    } catch (err) {
        console.log('   ℹ️  ไม่สามารถตรวจสอบ lsof');
    }

    // ลบไฟล์ lock ถ้ามี (อาจเป็นสาเหตุของปัญหา)
    const lockFiles = [
        path.join(dbDir, 'restaurant.db-journal'),
        path.join(dbDir, 'restaurant.db-shm'),
        path.join(dbDir, 'restaurant.db-wal')
    ];

    console.log('\n🗑️  ลบไฟล์ lock (ถ้ามี)...\n');

    let hasLockFiles = false;
    lockFiles.forEach(lockFile => {
        if (fs.existsSync(lockFile)) {
            try {
                fs.unlinkSync(lockFile);
                console.log(`   ✅ ลบ ${path.basename(lockFile)}`);
                hasLockFiles = true;
            } catch (err) {
                console.log(`   ❌ ไม่สามารถลบ ${path.basename(lockFile)}:`, err.message);
            }
        }
    });

    if (!hasLockFiles) {
        console.log('   ℹ️  ไม่พบไฟล์ lock');
    }

    // ลบ extended attributes (macOS)
    if (process.platform === 'darwin') {
        console.log('\n🧹 ลบ extended attributes (macOS)...\n');

        try {
            execSync(`xattr -c "${dbPath}"`, { stdio: 'inherit' });
            console.log('   ✅ ลบ extended attributes สำเร็จ');
        } catch (err) {
            console.log('   ℹ️  ไม่มี extended attributes หรือลบไม่ได้');
        }
    }

    console.log('\n========================================');
    console.log('✅ แก้ไขเสร็จสิ้น!');
    console.log('========================================\n');

    console.log('💡 วิธีทดสอบ:\n');
    console.log('   1. รัน: node database/testOperations.js');
    console.log('   2. หรือ: node server.js\n');

} catch (err) {
    console.error('❌ เกิดข้อผิดพลาด:', err.message);
    process.exit(1);
}
