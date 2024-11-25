const AddedThread = require('../AddedThread');

describe('a AddedThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'abc',
    };

    // Action and Assert
    expect(() => new AddedThread(payload)).toThrow('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 1,
      userId: 'user-123',
      title: 1234,
      body: true,
      createdAt: '2021-08-08T07:22:13.017Z',
    };

    // Action and Assert
    expect(() => new AddedThread(payload)).toThrow('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create addedThread object correctly', () => {
    // Arrange
    const payload = {
      id: '123',
      userId: 'user-123',
      title: 'abc',
      body: 'abc',
      createdAt: '2021-08-08T07:22:13.017Z',
    };

    // Action
    const {
      id, userId, title, body, createdAt,
    } = new AddedThread(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(userId).toEqual(payload.userId);
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(createdAt).toEqual(payload.createdAt);
  });
});
