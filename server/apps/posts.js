import { Router } from "express";
import { pool } from "../utils/db.js";

const postRouter = Router();

postRouter.get("/", async (req, res) => {
  const status = req.query.status || "";
  const keywords = `%${req.query.keywords}%` || "";
  const page = +req.query.page;

  const pageSize = 5;
  const offset = (page - 1) * pageSize;

  let query = "";
  let values = [];

  if (status && keywords) {
    query = `select * from posts where status like $1 and title=$2 limit $3 offset $4`;
    values = [status, keywords, pageSize, offset];
  } else if (keywords) {
    query = `select * from posts where title like $1 limit $2 offset $3`;
    values = [keywords, pageSize, offset];
  } else if (status) {
    query = `select * from posts where status=$1 limit $2 offset $3`;
    values = [status, pageSize, offset];
  } else {
    query = `select * from posts limit $1 offset $2`;
    values = [pageSize, offset];
  }
  try {
    const result = await pool.query(query, values);
    return res.json({
      data: result.rows,
    });
  } catch {
    return res.status(500).json({
      message: "Server",
    });
  }
});

postRouter.get("/:id", async (req, res) => {
  const postId = +req.params.id;
  try {
    const result = await pool.query("select * from posts where post_id=$1", [
      postId,
    ]);
    return res.json({
      data: result.rows[0],
    });
  } catch {
    return res.status(500).json({
      message: "Server",
    });
  }
});

postRouter.post("/", async (req, res) => {
  const hasPublished = req.body.status === "published";
  const newPost = {
    ...req.body,
    created_at: new Date(),
    updated_at: new Date(),
    published_at: hasPublished ? new Date() : null,
  };
  try {
    await pool.query(
      "insert into posts(title,content,status,category,created_at,updated_at,published_at) values($1,$2,$3,$4,$5,$6,$7)",
      [
        newPost.title,
        newPost.content,
        newPost.status,
        "new post",
        newPost.created_at,
        newPost.updated_at,
        newPost.published_at,
      ]
    );
    return res.json({
      message: "Post has been created.",
    });
  } catch {
    return res.status(500).json({
      message: "Server",
    });
  }
});

postRouter.put("/:id", async (req, res) => {
  const hasPublished = req.body.status === "published";

  const updatedPost = {
    ...req.body,
    updated_at: new Date(),
    published_at: hasPublished ? new Date() : null,
  };
  const postId = req.params.id;
  try {
    await pool.query(
      `update posts set title=$1,content=$2,status=$3,category=$4,updated_at=$5,published_at=$6 where post_id=$7`,
      [
        updatedPost.title,
        updatedPost.content,
        updatedPost.status,
        "aol ha",
        updatedPost.updated_at,
        updatedPost.published_at,
        postId,
      ]
    );

    return res.json({
      message: `Post ${postId} has been updated.`,
    });
  } catch {
    return res.status(500).json({
      message: "Server",
    });
  }
});

postRouter.delete("/:id", async (req, res) => {
  const postId = req.params.id;
  try {
    await pool.query(`delete from posts where post_id=$1`, [postId]);
    return res.json({
      message: `Post ${postId} has been deleted.`,
    });
  } catch {
    return res.status(500).json({
      message: "Server",
    });
  }
});

export default postRouter;
