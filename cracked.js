import { existsSync, readFileSync, writeFileSync, copyFileSync } from 'fs';


const originalExePath = 'Bandizip.exe';
if (!existsSync(originalExePath)) {
    console.error('找不到exe');
    process.exit(1);
}

const exeData = readFileSync(originalExePath);

const signatureIndex = exeData.indexOf(Buffer.from([0xC7, 0x87, 0x18, 0x01, 0x00, 0x00, 0x00, 0x00]));
if (signatureIndex !== -1) {
    exeData.writeUInt8(1, signatureIndex + 6);
} else {
    console.error('尚未找到特徵');
    process.exit(1);
}

const modifiedExePath = 'Bandizip.exe';
writeFileSync(modifiedExePath, exeData);

const backupExePath = originalExePath.replace('.exe', '_old.BAK');
copyFileSync(originalExePath, backupExePath);

console.log('破解完成');