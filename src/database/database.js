import pkg from 'pg';
import fs from 'fs';
const {Client} = pkg;
import {config} from 'dotenv';
config()
const client = new Client({
    host: process.env.POSTGRESQL_HOST,
    user: process.env.POSTGRESQL_USER,
    password: process.env.POSTGRESQL_PASSWORD,
    database: process.env.POSTGRESQL_DATABASE,
    port: process.env.POSTGRESQL_PORT,
    ssl: {
        ca: fs.readFileSync('./src/database/DigiCertGlobalRootCA.crt.pem')
    }
});

client.connect()
    .then(() => console.log('Conecting successfull'))
    .catch(err => {
        console.error('Error with database ', err);
        client.end();
    });

export {client};