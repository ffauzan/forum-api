const GetThreadUseCase = require('../GetThreadUseCase');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const UserRepository = require('../../../../Domains/users/UserRepository');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');

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

    // Mocking needed function
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
      // Comment 1 user
      .mockImplementationOnce(() => Promise.resolve({
        id: 'user-456',
        username: 'commentUser',
      }))
      // Reply of comment 1 user
      .mockImplementationOnce(() => Promise.resolve({
        id: 'user-123',
        username: 'threadOwner',
      }))
      // Comment 2 user
      .mockImplementationOnce(() => Promise.resolve({
        id: 'user-456',
        username: 'commentUser',
      }));

    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve([
        {
          id: 'comment-123',
          userId: 'user-456',
          content: 'Comment content',
          createdAt: '2024-11-26T01:00:00.000Z',
          replyTo: null,
          isDeleted: false,
        },
        {
          id: 'comment-124',
          userId: 'user-123',
          content: 'Reply to comment content',
          createdAt: '2024-11-26T02:00:00.000Z',
          replyTo: 'comment-123',
          isDeleted: true,
        },
        {
          id: 'comment-125',
          userId: 'user-456',
          content: 'Comment content 2',
          createdAt: '2024-11-26T03:00:00.000Z',
          replyTo: null,
          isDeleted: true,
        },
      ]));

    // Creating instance of use case
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
              content: '**balasan telah dihapus**',
            },
          ],
        },
        {
          id: 'comment-125',
          username: 'commentUser',
          date: '2024-11-26T03:00:00.000Z',
          content: '**komentar telah dihapus**',
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
  });
});
