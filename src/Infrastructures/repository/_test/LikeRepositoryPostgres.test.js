const LikesTableHelper = require('../../../../tests/LikesTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');

const InvariantError = require('../../../Commons/exceptions/InvariantError');
const AddLike = require('../../../Domains/likes/entities/AddLike');
const pool = require('../../database/postgres/pool');
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('LikeRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123' });
    await UsersTableTestHelper.addUser({ id: 'user-124', username: 'username2' });
    await ThreadsTableTestHelper.addThread({ id: 'thread-123', userId: 'user-123' });
    await CommentsTableTestHelper.addComment({ id: 'comment-123', userId: 'user-123', threadId: 'thread-123' });
  });

  afterEach(async () => {
    await LikesTableHelper.cleanTable();
  });

  afterAll(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addLike function', () => {
    it('should persist add like and return added like correctly', async () => {
      // Arrange
      const addLike = new AddLike({
        userId: 'user-123',
        commentId: 'comment-123',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const likeId = await likeRepositoryPostgres.addLike(addLike);

      // Assert
      const likes = await LikesTableHelper.findLikeById('like-123');
      expect(likes.id).toEqual('like-123');
      expect(likeId).toEqual('like-123');
    });

    it('should throw InvariantError when add like to non existent comment', async () => {
      // Arrange
      const addLike = new AddLike({
        userId: 'user-123',
        commentId: 'comment-999',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      await expect(likeRepositoryPostgres.addLike(addLike)).rejects.toThrow(InvariantError);
    });
  });

  describe('isLikeExist function', () => {
    it('should return true when like exist', async () => {
      // Arrange
      await LikesTableHelper.addLike({ id: 'like-123', commentId: 'comment-123', userId: 'user-123' });
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action
      const isLikeExist = await likeRepositoryPostgres.isLikeExist('user-123', 'comment-123');

      // Assert
      expect(isLikeExist).toEqual(true);
    });

    it('should return false when like not exist', async () => {
      // Arrange
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action
      const isLikeExist = await likeRepositoryPostgres.isLikeExist('user-123', 'comment-123');

      // Assert
      expect(isLikeExist).toEqual(false);
    });
  });

  describe('getLikeCountByCommentId function', () => {
    it('should return like count correctly', async () => {
      // Arrange
      await LikesTableHelper.addLike({ id: 'like-123', commentId: 'comment-123', userId: 'user-123' });
      await LikesTableHelper.addLike({ id: 'like-124', commentId: 'comment-123', userId: 'user-124' });
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action
      const likeCount = await likeRepositoryPostgres.getLikeCountByCommentId('comment-123');

      // Assert
      expect(likeCount).toEqual(2);
    });

    it('should return 0 when like not exist', async () => {
      // Arrange
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action
      const likeCount = await likeRepositoryPostgres.getLikeCountByCommentId('comment-123');

      // Assert
      expect(likeCount).toEqual(0);
    });
  });

  describe('deleteLike function', () => {
    it('should delete like correctly', async () => {
      // Arrange
      await LikesTableHelper.addLike({ id: 'like-123', userId: 'user-123', commentId: 'comment-123' });
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action
      await likeRepositoryPostgres.deleteLike('user-123', 'comment-123');

      // Assert
      const likes = await LikesTableHelper.findLike({ commentId: 'comment-123', userId: 'user-123' });
      expect(likes).toHaveLength(0);
    });

    it('should throw NotFoundError when delete like to non existent like', async () => {
      // Arrange
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(likeRepositoryPostgres.deleteLike('user-123', 'comment-123')).rejects.toThrow(NotFoundError);
    });
  });
});
