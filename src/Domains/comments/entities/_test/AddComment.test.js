const AddComment = require('../AddComment');

describe('a AddComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      content: 'abc',
    };

    // Action and Assert
    expect(() => new AddComment(payload)).toThrow('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      userId: 'user-123',
      threadId: 'thread-123',
      content: 123,
    };

    // Action and Assert
    expect(() => new AddComment(payload)).toThrow('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when replyTo did not meet data specifications', () => {
    // Arrange
    const payload = {
      userId: 'user-123',
      threadId: 'thread-123',
      content: '123',
      replyTo: 123,
    };

    // Action and Assert
    expect(() => new AddComment(payload)).toThrow('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create addComment object correctly', () => {
    // Arrange
    const payload = {
      userId: 'user-123',
      threadId: 'thread-123',
      replyTo: null,
      content: 'abc',
    };

    // Action
    const { userId, threadId, content } = new AddComment(payload);

    // Assert
    expect(userId).toEqual(payload.userId);
    expect(threadId).toEqual(payload.threadId);
    expect(content).toEqual(payload.content);
  });
});
