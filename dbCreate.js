"use strict";

import path from 'path';
import { readFileSync } from 'fs';
import { createConnection } from 'mysql2';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Function to create database
const createDatabaseIfNotExists = async () => {
    const connection = createConnection({
        host: '0.0.0.0',
        user: 'root',
        password: ''
    });

    // Check if database exists, if not, create it
    const [ttdb_rows] = await connection.promise().query('SHOW DATABASES LIKE "tt_database"');
    if (ttdb_rows.length === 0) {
        console.log('\x1b[33mDatabase does not exist, creating tt_database...\x1b[0m');
        await connection.promise().query('CREATE DATABASE tt_database');

        // Connect to the database after it is created
        const db = createConnection({
            host: '0.0.0.0',
            user: 'root',
            password: '',
            database: 'tt_database',
            multipleStatements: true
        });

        // Initialize tables
        const initSql = readFileSync(path.join(__dirname, '/database/ttDatabase.sql'), 'utf8');
        await db.promise().query(initSql);

        // Populate tables
        const insertSql = readFileSync(path.join(__dirname, '/database/ttInitDatabase.sql'), 'utf8');
        await db.promise().query(insertSql);

        console.log('\x1b[32mDatabase tt_database created and populated successfully.\x1b[0m');
        db.end();
    } else {
        console.log('\x1b[32mDatabase already exists.\x1b[0m');
    }
    connection.end();
};

createDatabaseIfNotExists();