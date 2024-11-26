/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async addComment({
    id = 'comment-123', userId = 'user-123', threadId = 'thread-123', replyTo = null, content = 'content',
  }) {
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6, $7, $8)',
      values: [id, userId, threadId, replyTo, content, createdAt, updatedAt, false],
    };

    await pool.query(query);
  },

  async findCommentById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async findCommentsByThreadId(threadId) {
    const query = {
      text: 'SELECT * FROM comments WHERE thread_id = $1',
      values: [threadId],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },

  async findCommentReplies(commentId) {
    const query = {
      text: 'SELECT * FROM comments WHERE reply_to = $1',
      values: [commentId],
    };

    const result = await pool.query(query);
    return result.rows;
  },
};

module.exports = CommentsTableTestHelper;
