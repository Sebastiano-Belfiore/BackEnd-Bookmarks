const dotenv = require('dotenv');
const mysql = require('mysql2/promise');

dotenv.config();

async function createDatabaseAndTables() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
  });

  const databaseName = process.env.DB_NAME;

  try {
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${databaseName}`);
    console.log(`Database ${databaseName} created or already exists.`);

    await connection.changeUser({ database: databaseName });

    const createTablesQueries = [
      `CREATE TABLE IF NOT EXISTS entities (
        entity_id int NOT NULL AUTO_INCREMENT,
        link varchar(255) DEFAULT NULL,
        link_img varchar(255) DEFAULT NULL,
        created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (entity_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci`,

      `CREATE TABLE IF NOT EXISTS tags (
        tag_id int NOT NULL AUTO_INCREMENT,
        name varchar(255) NOT NULL,
        color varchar(6) NOT NULL DEFAULT '242424',
        created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        is_favorite tinyint(1) NOT NULL DEFAULT '0',
        PRIMARY KEY (tag_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci`,

      `CREATE TABLE IF NOT EXISTS entitytags (
        entity_id int NOT NULL,
        tag_id int NOT NULL,
        created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (entity_id, tag_id),
        KEY (tag_id),
        CONSTRAINT entitytags_ibfk_1 FOREIGN KEY (entity_id) REFERENCES entities (entity_id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT entitytags_ibfk_2 FOREIGN KEY (tag_id) REFERENCES tags (tag_id) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci`,
    ];

    await Promise.all(createTablesQueries.map((query) => connection.query(query)));
    console.log('Tables created successfully.');

    const untaggedTagQuery = `INSERT INTO tags (name, color, is_favorite) VALUES ('UNTAGGED', '242424', 0);`;
    await connection.query(untaggedTagQuery);
    console.log('Successfully added the UNTAGGED tag.');

    const createTriggersQueries = [
      `
        CREATE TRIGGER entitytags_AFTER_INSERT
        AFTER INSERT ON entitytags
        FOR EACH ROW
        BEGIN
          UPDATE entities
          SET updated_at = CURRENT_TIMESTAMP
          WHERE entity_id = NEW.entity_id;
        END;
      `,
      `
        CREATE TRIGGER entitytags_AFTER_DELETE
        AFTER DELETE ON entitytags
        FOR EACH ROW
        BEGIN
          DECLARE tag_count INT;
          DECLARE untagged_tag_id INT;

          SELECT COUNT(*) INTO tag_count
          FROM entitytags
          WHERE entity_id = OLD.entity_id;

          IF tag_count = 0 THEN
            SELECT tag_id INTO untagged_tag_id
            FROM tags
            WHERE name = 'UNTAGGED'
            LIMIT 1;

            INSERT INTO entitytags (entity_id, tag_id)
            VALUES (OLD.entity_id, untagged_tag_id);
          END IF;
        END;
      `,
    ];

    await Promise.all(createTriggersQueries.map((query) => connection.query(query)));
    console.log('Triggers created successfully.');
  } catch (error) {
    console.error('Error during setup_db:', error);
  } finally {
    await connection.end();
  }
}

const setupDB = async () => {
  await createDatabaseAndTables().catch((error) =>
    console.error('Error in the database and table creation process:', error),
  );
};
setupDB();
