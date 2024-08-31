import mysql from "mysql2/promise";

export let conn: mysql.Connection;

export const init = async () => {
  conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });
  await conn.query(`
    CREATE TABLE IF NOT EXISTS albamon (
        id INT PRIMARY KEY,
        title TEXT,
        status TEXT,
        company TEXT,
        payType TEXT,
        pay TEXT,
        negoPay BOOLEAN,
        workingTime TEXT,
        workingPeriod TEXT,
        negoWorkPeriod TEXT,
        workingWeek TEXT,
        workingDate TEXT,
        trainee BOOLEAN,
        parts TEXT,
        closingDate TEXT,
        closingDateWithDDay TEXT,
        closingDDay TEXT,
        age TEXT,
        latitude FLOAT,
        longitude FLOAT,
        existsMap BOOLEAN,
        workplaceAddress TEXT,
        workplaceArea TEXT
    )
  `);
};
