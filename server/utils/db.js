// Creating PostgreSQL Client here
import * as pg from "pg";

const { Pool } = pg.default;

export const pool = new Pool({
  connectionString: "postgresql://postgres:Pp_0644519162@localhost:5432/posts",
});
