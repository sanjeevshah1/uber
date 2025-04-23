import fs from 'fs';
    const publicKey = fs.readFileSync("./public.pem",'utf-8');
    const privateKey =fs.readFileSync("./private.pem",'utf-8');
export default {
    portNo : 1337,
    mongoUrl : 'mongodb://localhost:27017/uber',
    saltFactor: 10,
    publicKey,
    privateKey
}