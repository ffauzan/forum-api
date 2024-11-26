const AddedComment = require('../AddedComment');

describe('a AddedComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      userId: 'user-123',
      threadId: 'thread-123',
      content: 'abc',
    };

    // Action and Assert
    expect(() => new AddedComment(payload)).toThrow('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 1,
      userId: 'user-123',
      threadId: 'thread-123',
      content: 123,
      createdAt: '2021-08-08T07:22:13.017Z',
    };

    // Action and Assert
    expect(() => new AddedComment(payload)).toThrow('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when replyTo did not meet data specifications', () => {
    // Arrange
    const payload = {
      id: '123',
      userId: 'user-123',
      threadId: 'thread-123',
      content: '123',
      replyTo: 123,
      createdAt: '2021-08-08T07:22:13.017Z',
    };

    // Action and Assert
    expect(() => new AddedComment(payload)).toThrow('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create addedComment object correctly', () => {
    // Arrange
    const payload = {
      id: '123',
      userId: 'user-123',
      threadId: 'thread-123',
      replyTo: null,
      content: 'abc',
      createdAt: '2021-08-08T07:22:13.017Z',
    };

    // Action
    const {
      id, userId, threadId, replyTo, content, createdAt,
    } = new AddedComment(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(userId).toEqual(payload.userId);
    expect(threadId).toEqual(payload.threadId);
    expect(replyTo).toEqual(payload.replyTo);
    expect(content).toEqual(payload.content);
    expect(createdAt).toEqual(payload.createdAt);
  });
});
