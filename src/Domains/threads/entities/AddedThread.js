class AddedThread {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, userId, title, body, createdAt,
    } = payload;

    this.id = id;
    this.userId = userId;
    this.title = title;
    this.body = body;
    this.createdAt = createdAt;
  }

  _verifyPayload({
    id, userId, title, body, createdAt,
  }) {
    if (!id || !userId || !title || !body || !createdAt) {
      throw new Error('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof userId !== 'string' || typeof title !== 'string' || typeof body !== 'string' || typeof createdAt !== 'string') {
      throw new Error('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddedThread;
