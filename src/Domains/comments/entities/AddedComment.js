class AddedComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, userId, threadId, replyTo, content, createdAt, isDeleted,
    } = payload;

    this.id = id;
    this.userId = userId;
    this.threadId = threadId;
    this.replyTo = replyTo || null; // Default to null if not provided
    this.content = content;
    this.createdAt = createdAt;
    this.isDeleted = isDeleted || false; // Default to false if not provided
  }

  _verifyPayload({
    id, userId, threadId, replyTo, content, createdAt,
  }) {
    if (!id || !userId || !threadId || !content || !createdAt) {
      throw new Error('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof userId !== 'string' || typeof threadId !== 'string' || typeof content !== 'string' || typeof createdAt !== 'string') {
      throw new Error('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (replyTo !== null && replyTo !== undefined && typeof replyTo !== 'string') {
      throw new Error('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddedComment;
