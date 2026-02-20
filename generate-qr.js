import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';

// Get URL from command line args or default to localhost
const url = process.argv[2] || 'http://localhost:5173';
const outputPath = path.resolve('public', 'app-qr-code.png');

console.log(`Generating QR Code for: ${url}`);

QRCode.toFile(outputPath, url, {
    color: {
        dark: '#000000',
        light: '#ffffff'
    },
    width: 300
}, function (err) {
    if (err) throw err;
    console.log(`QR Code saved to ${outputPath}`);
});

QRCode.toString(url, { type: 'terminal' }, function (err, url) {
    if (err) throw err;
    console.log(url);
});
