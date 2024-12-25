class AddLike {
  constructor({
    userId, threadId, commentId,
  }) {
    this._verifyPayload({
      userId, threadId, commentId,
    });

    this.userId = userId;
    this.threadId = threadId;
    this.commentId = commentId;
  }

  _verifyPayload({
    userId, threadId, commentId,
  }) {
    if (!userId || !threadId || !commentId) {
      throw new Error('ADD_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof userId !== 'string' || typeof threadId !== 'string' || typeof commentId !== 'string') {
      throw new Error('ADD_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddLike;
