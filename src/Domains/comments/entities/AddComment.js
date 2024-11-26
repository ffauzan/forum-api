class AddComment {
  constructor({
    userId, threadId, replyTo, content,
  }) {
    this._verifyPayload({
      userId, threadId, replyTo, content,
    });

    this.userId = userId;
    this.threadId = threadId;
    this.replyTo = replyTo;
    this.content = content;
  }

  _verifyPayload({
    userId, threadId, replyTo, content,
  }) {
    if (!userId || !threadId || !content) {
      throw new Error('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof userId !== 'string' || typeof threadId !== 'string' || typeof content !== 'string') {
      throw new Error('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (replyTo !== null && replyTo !== undefined && typeof replyTo !== 'string') {
      throw new Error('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddComment;
