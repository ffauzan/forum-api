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
      id: '123',
      title: 1234,
      body: true,
      date: '2021-08-08T07:22:13.017Z',
      username: 'abc',
      comments: [],
    };

    // Action and Assert
    expect(() => new AddedThread(payload)).toThrow('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create addedThread object correctly', () => {
    // Arrange
    const payload = {
      id: '123',
      title: 'abc',
      body: 'abc',
      date: '2021-08-08T07:22:13.017Z',
      username: 'abc',
      comments: [],
    };

    // Action
    const {
      id, title, body, date, username, comments,
    } = new AddedThread(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(date).toEqual(payload.date);
    expect(username).toEqual(payload.username);
    expect(comments).toEqual(payload.comments);
  });
});
