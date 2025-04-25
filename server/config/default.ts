import fs from 'fs';
    const publicKey = fs.readFileSync("./public_key.pem",'utf-8');
    const privateKey =fs.readFileSync("./private_key.pem",'utf-8');
export default {
    portNo : 1337,
    mongoUrl : 'mongodb://localhost:27017/uber',
    saltFactor: 10,
    publicKey,
    privateKey
}