const pool = require('../../database/postgres/pool');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads/{threadId}/comments/{commentId}/likes endpoint', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-1', username: 'user1', password: '123456' });
    await ThreadsTableTestHelper.addThread({ id: 'thread-1', userId: 'user-1' });
    await CommentsTableTestHelper.addComment({ id: 'comment-1', userId: 'user-1', threadId: 'thread-1' });
  });

  afterEach(async () => {
    await LikesTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('when PUT /threads/{threadId}/comments/{commentId}/likes', () => {
    it('should response 200 and do like/dislike action', async () => {
      // Arrange
      const accessToken = await container.getInstance('AuthenticationTokenManager').createAccessToken({
        username: 'user1',
        id: 'user-1',
      });

      // Action
      const server = await createServer(container);
      const response = await server.inject({
        method: 'PUT',
        url: '/threads/thread-1/comments/comment-1/likes',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response with 404 when thread not found', async () => {
      // Arrange
      const accessToken = await container.getInstance('AuthenticationTokenManager').createAccessToken({
        username: 'user1',
        id: 'user-1',
      });

      // Action
      const server = await createServer(container);
      const response = await server.inject({
        method: 'PUT',
        url: '/threads/thread-2/comments/comment-1/likes',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });

    it('should response with 404 when comment not found', async () => {
      // Arrange
      const accessToken = await container.getInstance('AuthenticationTokenManager').createAccessToken({
        username: 'user1',
        id: 'user-1',
      });

      // Action
      const server = await createServer(container);
      const response = await server.inject({
        method: 'PUT',
        url: '/threads/thread-1/comments/comment-2/likes',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Komentar tidak ditemukan');
    });
  });
});
