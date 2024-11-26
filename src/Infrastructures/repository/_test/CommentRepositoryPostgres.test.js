const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepositoryPostgres', () => {
  beforeAll(async () => {
    // Create dummy user
    await UsersTableTestHelper.addUser({ id: 'user-1' });

    // Create dummy thread
    await ThreadsTableTestHelper.addThread({ id: 'thread-1', userId: 'user-1' });
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist add comment and return added comment correctly', async () => {
      // Arrange
      const addComment = new AddComment({
        userId: 'user-1',
        threadId: 'thread-1',
        content: 'content',
      });
      const fakeIdGenerator = () => '1'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const c = await commentRepositoryPostgres.addComment(addComment);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentById('comment-1');
      expect(comments).toHaveLength(1);
      expect(c.userId).toEqual(addComment.userId);
      expect(c.threadId).toEqual(addComment.threadId);
      expect(c.content).toEqual(addComment.content);
    });

    it('should persist add comment with replyTo and return added comment correctly', async () => {
      // Arrange
      // Add dummy comment
      await CommentsTableTestHelper.addComment({
        id: 'comment-1', userId: 'user-1', threadId: 'thread-1', content: 'content',
      });

      // Add reply to comment
      const reply = new AddComment({
        userId: 'user-1',
        threadId: 'thread-1',
        content: 'content',
        replyTo: 'comment-1',
      });

      const fakeIdGenerator = () => '2'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const c = await commentRepositoryPostgres.addComment(reply);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentById('comment-2');
      expect(comments).toHaveLength(1);
      expect(c.userId).toEqual(reply.userId);
      expect(c.threadId).toEqual(reply.threadId);
      expect(c.content).toEqual(reply.content);
      expect(c.replyTo).toEqual(reply.replyTo);
    });

    it('should throw InvariantError when adding comment to non exist thread', async () => {
      // Arrange
      const addComment = new AddComment({
        userId: 'user-1',
        threadId: 'thread-999',
        content: 'content',
      });
      const fakeIdGenerator = () => '1'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      await expect(commentRepositoryPostgres.addComment(addComment)).rejects.toThrow(InvariantError);
    });
  });

  describe('getCommentById function', () => {
    it('should return comment correctly', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: 'comment-1', userId: 'user-1', threadId: 'thread-1', content: 'content',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const c = await commentRepositoryPostgres.getCommentById('comment-1');

      // Assert
      expect(c.id).toEqual('comment-1');
      expect(c.userId).toEqual('user-1');
      expect(c.threadId).toEqual('thread-1');
      expect(c.content).toEqual('content');
    });

    it('should throw NotFound when comment not found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.getCommentById('comment-1')).rejects.toThrow(NotFoundError);
    });
  });

  describe('getCommentsByThreadId function', () => {
    it('should return comments correctly', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: 'comment-1', userId: 'user-1', threadId: 'thread-1', content: 'content',
      });

      await CommentsTableTestHelper.addComment({
        id: 'comment-2', userId: 'user-1', threadId: 'thread-1', content: 'content',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const comments = await commentRepositoryPostgres.getCommentsByThreadId('thread-1');

      // Assert
      expect(comments).toHaveLength(2);
      expect(comments[0].id).toEqual('comment-1');
      expect(comments[1].id).toEqual('comment-2');
    });
  });

  describe('deleteCommentById function', () => {
    it('should delete comment correctly', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: 'comment-1', userId: 'user-1', threadId: 'thread-1', content: 'content',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      await commentRepositoryPostgres.deleteCommentById('comment-1');

      // Assert
      const comments = await CommentsTableTestHelper.findCommentById('comment-1');
      expect(comments).toHaveLength(0);
    });

    it('should throw InvariantError when delete non exist comment', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.deleteCommentById('comment-1')).rejects.toThrow(InvariantError);
    });
  });

  describe('getCoomentReplies function', () => {
    it('should return comment replies correctly', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: 'comment-1', userId: 'user-1', threadId: 'thread-1', content: 'content',
      });

      await CommentsTableTestHelper.addComment({
        id: 'comment-2',
        userId: 'user-1',
        threadId: 'thread-1',
        content: 'content',
        replyTo: 'comment-1',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const comments = await commentRepositoryPostgres.getCommentReplies('comment-1');

      // Assert
      expect(comments).toHaveLength(1);
      expect(comments[0].id).toEqual('comment-2');
    });
  });
});
