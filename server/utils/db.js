// Creating PostgreSQL Client here
import * as pg from "pg";

const { Pool } = pg.default;

const pool = new Pool({
  connectionString: "postgresql://postgres:1234@localhost:5432/node",
});

export { pool };
