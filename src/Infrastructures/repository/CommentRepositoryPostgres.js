const InvariantError = require('../../Commons/exceptions/InvariantError');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(addComment) {
    const {
      userId, threadId, content, replyTo,
    } = addComment;
    const id = `comment-${this._idGenerator()}`;

    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6, $7) returning id, user_id, thread_id, reply_to, content, created_at',
      values: [id, userId, threadId, replyTo, content, createdAt, updatedAt],
    };

    try {
      const result = await this._pool.query(query);

      return new AddedComment({
        id: result.rows[0].id,
        userId: result.rows[0].user_id,
        threadId: result.rows[0].thread_id,
        replyTo: result.rows[0].reply_to,
        content: result.rows[0].content,
        createdAt: result.rows[0].created_at,
      });
    } catch (error) {
      throw new InvariantError('Gagal menambahkan komentar');
    }
  }

  async getCommentById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Komentar tidak ditemukan');
    }

    return new AddedComment({
      id: result.rows[0].id,
      userId: result.rows[0].user_id,
      threadId: result.rows[0].thread_id,
      replyTo: result.rows[0].reply_to,
      content: result.rows[0].content,
      createdAt: result.rows[0].created_at,
    });
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: 'SELECT * FROM comments WHERE thread_id = $1',
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result.rows.map((comment) => new AddedComment({
      id: comment.id,
      userId: comment.user_id,
      threadId: comment.thread_id,
      replyTo: comment.reply_to,
      content: comment.content,
      createdAt: comment.created_at,
    }));
  }

  async deleteCommentById(id) {
    const query = {
      text: 'DELETE FROM comments WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Komentar gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = CommentRepositoryPostgres;
