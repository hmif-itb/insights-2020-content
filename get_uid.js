require('dotenv').config();
const crypto = require('crypto');

const secret = process.env.GEN_SECRET || "hmif-itb";
const nim = process.argv[2];
const mac = crypto.createHmac("sha1", secret).update(nim).digest("hex");
console.log(nim, mac + '-' + nim)