class AddLike {
  constructor({
    userId, commentId,
  }) {
    this._verifyPayload({
      userId, commentId,
    });

    this.userId = userId;
    this.commentId = commentId;
  }

  _verifyPayload({
    userId, commentId,
  }) {
    if (!userId || !commentId) {
      throw new Error('ADD_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof userId !== 'string' || typeof commentId !== 'string') {
      throw new Error('ADD_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddLike;
