const InvariantError = require('../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const LikeRepository = require('../../Domains/likes/LikeRepository');

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addLike(addLike) {
    const { userId, commentId } = addLike;
    const id = `like-${this._idGenerator()}`;

    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO likes VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, userId, commentId, createdAt, updatedAt],
    };

    try {
      const result = await this._pool.query(query);

      return result.rows[0].id;
    } catch (error) {
      throw new InvariantError('Gagal menambahkan like');
    }
  }

  async isLikeExist(userId, commentId) {
    const query = {
      text: 'SELECT * FROM likes WHERE user_id = $1 AND comment_id = $2',
      values: [userId, commentId],
    };

    const result = await this._pool.query(query);

    return result.rows.length > 0;
  }

  async getLikeCountByCommentId(commentId) {
    const query = {
      text: 'SELECT COUNT(comment_id) FROM likes WHERE comment_id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    return parseInt(result.rows[0].count, 10);
  }

  async deleteLike(userId, commentId) {
    const query = {
      text: 'DELETE FROM likes WHERE user_id = $1 AND comment_id = $2 RETURNING id',
      values: [userId, commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Like tidak ditemukan');
    }

    return result.rows[0].id;
  }
}

module.exports = LikeRepositoryPostgres;
