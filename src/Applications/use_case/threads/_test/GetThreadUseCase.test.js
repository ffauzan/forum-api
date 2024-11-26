const GetThreadUseCase = require('../GetThreadUseCase');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const UserRepository = require('../../../../Domains/users/UserRepository');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const AddedThread = require('../../../../Domains/threads/entities/AddedThread');

describe('GetThreadUseCase', () => {
  it('should orchestrate the get thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
    };

    const expectedUser = {
      id: 'user-123',
      username: 'threadOwner',
    };

    const expectedThread = {
      id: 'thread-123',
      title: 'Thread Title',
      body: 'Thread body content',
      date: '2024-11-26T00:00:00.000Z',
      username: 'threadOwner',
    };

    const expectedCommentUser = {
      id: 'user-456',
      username: 'commentUser',
    };

    const expectedComments = [
      {
        id: 'comment-123',
        content: 'Comment content',
        date: '2024-11-26T01:00:00.000Z',
        username: 'commentUser',
      },
    ];

    const mockThreadRepository = new ThreadRepository();
    const mockUserRepository = new UserRepository();
    const mockCommentRepository = new CommentRepository();

    // Mocking
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: 'thread-123',
        userId: 'user-123',
        title: 'Thread Title',
        body: 'Thread body content',
        createdAt: '2024-11-26T00:00:00.000Z',
      }));

    mockUserRepository.getUserById = jest.fn()
      // Thread owner
      .mockImplementationOnce(() => Promise.resolve({
        id: 'user-123',
        username: 'threadOwner',
      }))
      // Comment user
      .mockImplementationOnce(() => Promise.resolve({
        id: 'user-456',
        username: 'commentUser',
      }))
      // Reply user
      .mockImplementationOnce(() => Promise.resolve({
        id: 'user-123',
        username: 'threadOwner',
      }));

    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve([
        {
          id: 'comment-123',
          userId: 'user-456',
          content: 'Comment content',
          createdAt: '2024-11-26T01:00:00.000Z',
        },
        {
          id: 'comment-124',
          userId: 'user-123',
          content: 'Reply to comment content',
          createdAt: '2024-11-26T02:00:00.000Z',
          replyTo: 'comment-123',
        },
      ]));

    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const thread = await getThreadUseCase.execute(useCasePayload.threadId);

    // Assert
    expect(thread).toStrictEqual({
      ...expectedThread,
      comments: [
        {
          ...expectedComments[0],
          replies: [
            {
              id: 'comment-124',
              username: 'threadOwner',
              date: '2024-11-26T02:00:00.000Z',
              content: 'Reply to comment content',
            },
          ],
        },
      ],
    });

    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockUserRepository.getUserById).toHaveBeenCalledTimes(3);
    expect(mockUserRepository.getUserById).toHaveBeenCalledWith('user-123');
    expect(mockUserRepository.getUserById).toHaveBeenCalledWith('user-456');
    expect(mockUserRepository.getUserById).toHaveBeenCalledWith('user-123');
    expect(mockCommentRepository.getCommentsByThreadId).toHaveBeenCalledWith(useCasePayload.threadId);
  });
});
