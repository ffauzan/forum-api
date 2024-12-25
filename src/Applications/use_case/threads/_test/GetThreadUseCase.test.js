const AddedThread = require('../../../../Domains/threads/entities/AddedThread');
const GetThreadUseCase = require('../GetThreadUseCase');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const UserRepository = require('../../../../Domains/users/UserRepository');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const LikeRepository = require('../../../../Domains/likes/LikeRepository');
const RegisteredUser = require('../../../../Domains/users/entities/RegisteredUser');
const AddedComment = require('../../../../Domains/comments/entities/AddedComment');
const NotFoundError = require('../../../../Commons/exceptions/NotFoundError');

describe('GetThreadUseCase', () => {
  it('should orchestrate the get thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
    };

    const expectedThread = {
      id: 'thread-123',
      title: 'Thread Title',
      body: 'Thread body content',
      date: '2024-11-26T00:00:00.000Z',
      username: 'threadOwner',
    };

    const expectedComments = [
      {
        id: 'comment-123',
        content: 'Comment content',
        date: '2024-11-26T01:00:00.000Z',
        username: 'commentUser',
      },
    ];

    // Use case dependency
    const mockThreadRepository = new ThreadRepository();
    const mockUserRepository = new UserRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    // Mocking needed function
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(new AddedThread({
        id: 'thread-123',
        userId: 'user-123',
        title: 'Thread Title',
        body: 'Thread body content',
        createdAt: '2024-11-26T00:00:00.000Z',
      })));

    mockUserRepository.getUserById = jest.fn()
      // Thread owner
      .mockImplementationOnce(() => Promise.resolve(new RegisteredUser({
        id: 'user-123',
        username: 'threadOwner',
        fullname: 'Thread Owner',
      })))
      // Comment 1 user
      .mockImplementationOnce(() => Promise.resolve(new RegisteredUser({
        id: 'user-456',
        username: 'commentUser',
        fullname: 'Comment User',
      })))
      // Reply of comment 1 user
      .mockImplementationOnce(() => Promise.resolve(new RegisteredUser({
        id: 'user-123',
        username: 'threadOwner',
        fullname: 'Thread Owner',
      })))
      // Comment 2 user
      .mockImplementationOnce(() => Promise.resolve(new RegisteredUser({
        id: 'user-456',
        username: 'commentUser',
        fullname: 'Comment User',
      })));

    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation((threadId) => Promise.resolve([
        new AddedComment({
          id: 'comment-123',
          userId: 'user-456',
          threadId,
          content: 'Comment content',
          createdAt: '2024-11-26T01:00:00.000Z',
          replyTo: null,
          isDeleted: false,
        }),
        new AddedComment({
          id: 'comment-124',
          userId: 'user-123',
          threadId,
          content: 'Reply to comment content',
          createdAt: '2024-11-26T02:00:00.000Z',
          replyTo: 'comment-123',
          isDeleted: true,
        }),
        new AddedComment({
          id: 'comment-125',
          userId: 'user-456',
          threadId,
          content: 'Comment content 2',
          createdAt: '2024-11-26T03:00:00.000Z',
          replyTo: null,
          isDeleted: true,
        }),
      ]));

    mockLikeRepository.getLikeCountByCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve(0));

    // Creating instance of use case
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    const thread = await getThreadUseCase.execute(useCasePayload.threadId);

    // Assert
    expect(thread).toStrictEqual({
      ...expectedThread,
      comments: [
        {
          ...expectedComments[0],
          likeCount: 0,
          replies: [
            {
              id: 'comment-124',
              username: 'threadOwner',
              date: '2024-11-26T02:00:00.000Z',
              content: '**balasan telah dihapus**',
              likeCount: 0,
            },
          ],
        },
        {
          id: 'comment-125',
          username: 'commentUser',
          date: '2024-11-26T03:00:00.000Z',
          content: '**komentar telah dihapus**',
          likeCount: 0,
          replies: [],
        },
      ],
    });

    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockUserRepository.getUserById).toHaveBeenCalledTimes(4);
    expect(mockUserRepository.getUserById).toHaveBeenCalledWith('user-123');
    expect(mockUserRepository.getUserById).toHaveBeenCalledWith('user-456');
    expect(mockUserRepository.getUserById).toHaveBeenCalledWith('user-123');
    expect(mockUserRepository.getUserById).toHaveBeenCalledWith('user-456');
    expect(mockCommentRepository.getCommentsByThreadId).toHaveBeenCalledWith(useCasePayload.threadId);

    expect(mockLikeRepository.getLikeCountByCommentId).toHaveBeenCalledTimes(3);
    expect(mockLikeRepository.getLikeCountByCommentId).toHaveBeenCalledWith('comment-123');
    expect(mockLikeRepository.getLikeCountByCommentId).toHaveBeenCalledWith('comment-124');
    expect(mockLikeRepository.getLikeCountByCommentId).toHaveBeenCalledWith('comment-125');
  });

  it('should throw error if thread not found', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
    };

    // Use case dependency
    const mockThreadRepository = new ThreadRepository();

    // Mocking needed function
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.reject(new NotFoundError('thread tidak ditemukan')));

    // Creating instance of use case
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action & Assert
    await expect(getThreadUseCase.execute(useCasePayload.threadId))
      .rejects
      .toThrow(new NotFoundError('thread tidak ditemukan'));
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(useCasePayload.threadId);
  });
});
