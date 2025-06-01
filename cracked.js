import {
    existsSync,
    readFileSync,
    writeFileSync,
    copyFileSync
}
from 'fs';
import winVersionInfo from 'win-version-info';

function crackExeFile(originalExePath, argvOption) {
    if (!existsSync(originalExePath)) {
        console.error('找不到exe');
        process.exit(1);
    }

    const version = winVersionInfo(originalExePath).FileVersion;
    console.log(`exe version:${version}`);

    const exeData = readFileSync(originalExePath);
    const isHighetVersion = version >= '7.38.0.1';
    const targetSignature = isHighetVersion
         ? Buffer.from([0xC7, 0x86, 0x18, 0x01, 0x00, 0x00, 0x98, 0x00])
         : Buffer.from([0xC7, 0x87, 0x18, 0x01, 0x00, 0x00, 0x00, 0x00]);

    const signatureIndex = exeData.indexOf(targetSignature);
    if (signatureIndex === -1) {
        console.error('尚未找到特徵');
        process.exit(1);
    }

    if (isHighetVersion) {
        let writeValue = argvOption === '2' ? 0x1B20 : 0x03D4;
        exeData.writeUInt16LE(writeValue, signatureIndex + 6);
    } else {
        exeData.writeUInt8(1, signatureIndex + 6);
    }

    copyFileSync(originalExePath, originalExePath.replace('.exe', '_old.BAK'));
    writeFileSync(originalExePath, exeData);

    console.log('破解完成');
}

crackExeFile('Bandizip.exe', '1');