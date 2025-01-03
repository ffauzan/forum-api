const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  beforeAll(async () => {
    // Create dummy user
    await UsersTableTestHelper.addUser({ id: 'user-123' });
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    // await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist add thread and return added thread correctly', async () => {
      // Arrange
      const addThread = new AddThread({
        userId: 'user-123',
        title: 'title',
        body: 'body',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(addThread);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadsById('thread-123');

      expect(threads).toHaveLength(1);

      expect(addedThread).toEqual({
        id: 'thread-123',
        userId: 'user-123',
        title: 'title',
        body: 'body',
        createdAt: expect.any(String),
      });
    });
  });

  describe('getThreadById function', () => {
    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.getThreadById('thread-999')).rejects.toThrow(NotFoundError);
    });

    it('should return thread correctly', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({
        id: 'thread-234',
        userId: 'user-123',
        title: 'title',
        body: 'body',
      });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const thread = await threadRepositoryPostgres.getThreadById('thread-234');

      // Assert
      expect(thread).toEqual({
        id: 'thread-234',
        userId: 'user-123',
        title: 'title',
        body: 'body',
        createdAt: expect.any(String),
      });
    });
  });

  describe('isThreadExist function', () => {
    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.isThreadExist('thread-999')).rejects.toThrow(NotFoundError);
    });

    it('should return true when thread found', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({ id: 'thread-234' });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.isThreadExist('thread-234')).resolves.not.toThrow(NotFoundError);
      expect(await threadRepositoryPostgres.isThreadExist('thread-234')).toEqual(true);
    });
  });
});
