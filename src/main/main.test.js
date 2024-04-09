const { runQueryDB, handleSQLCommandsDB } = require("./functions");

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(":memory:");

describe("ROMS Unit Test", () => {
  beforeAll(async () => {
    await runQueryDB(
      db,
      `CREATE TABLE IF NOT EXISTS employees (pin TEXT PRIMARY KEY NOT NULL, first_name TEXT NOT NULL, last_name TEXT NOT NULL);`
    );

    await runQueryDB(
      db,
      `INSERT INTO employees (pin, first_name, last_name) VALUES('1111', 'Test', 'User')`
    );
  });

  it("Test: PIN Valid?", async () => {
    const response = await handleSQLCommandsDB(
      null,
      db,
      `SELECT * FROM employees WHERE pin='1111'`
    );

    expect(response[0].pin).toEqual("1111");
  });
  it("Test: First Name Valid?", async () => {
    const response = await handleSQLCommandsDB(
      null,
      db,
      `SELECT * FROM employees WHERE pin='1111'`
    );

    expect(response[0].first_name).toEqual("Test");
  });
  it("Test: Last Name Valid?", async () => {
    const response = await handleSQLCommandsDB(
      null,
      db,
      `SELECT * FROM employees WHERE pin='1111'`
    );

    expect(response[0].last_name).toEqual("User");
  });
});
