/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const LikesTableTestHelper = {
  async addLike({ id = 'like-123', userId = 'user-123', commentId = 'comment-123' }) {
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    const query = {
      text: 'INSERT INTO likes VALUES($1, $2, $3, $4, $5)',
      values: [id, userId, commentId, createdAt, updatedAt],
    };

    await pool.query(query);
  },

  async findLike({ commentId, userId }) {
    const query = {
      text: 'SELECT * FROM likes WHERE comment_id = $1 AND user_id = $2',
      values: [commentId, userId],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async findLikeById(id) {
    const query = {
      text: 'SELECT * FROM likes WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows[0];
  },

  async cleanTable() {
    await pool.query('DELETE FROM likes WHERE 1=1');
  },
};

module.exports = LikesTableTestHelper;
