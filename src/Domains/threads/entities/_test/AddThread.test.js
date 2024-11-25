const AddThread = require('../AddThread');

describe('a AddThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'abc',
    };

    // Action and Assert
    expect(() => new AddThread(payload)).toThrow('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      userId: 'user-123',
      title: 123,
      body: true,
    };

    // Action and Assert
    expect(() => new AddThread(payload)).toThrow('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create addThread object correctly', () => {
    // Arrange
    const payload = {
      userId: 'user-123',
      title: 'abc',
      body: 'abc',
    };

    // Action
    const { title, body } = new AddThread(payload);

    // Assert
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
  });
});
