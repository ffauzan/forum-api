const AddedComment = require('../../../../Domains/comments/entities/AddedComment');
const AddComment = require('../../../../Domains/comments/entities/AddComment');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const AddCommentUseCase = require('../AddCommentUseCase');
const InvariantError = require('../../../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../../../Commons/exceptions/NotFoundError');

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      userId: 'user-123',
      threadId: 'thread-123',
      content: 'abc',
    };

    const expectedAddedComment = new AddedComment({
      id: 'comment-123',
      userId: useCasePayload.userId,
      threadId: useCasePayload.threadId,
      content: useCasePayload.content,
      createdAt: '2021-08-08T07:22:13.017Z',
    });

    // Use case dependency
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    // Mocking needed function
    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(
        new AddedComment({
          id: 'comment-123',
          userId: useCasePayload.userId,
          threadId: useCasePayload.threadId,
          content: useCasePayload.content,
          createdAt: '2021-08-08T07:22:13.017Z',
        }),
      ));

    mockThreadRepository.isThreadExist = jest.fn()
      .mockImplementation(() => Promise.resolve());

    // Creating instance of use case
    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedComment = await addCommentUseCase.execute(useCasePayload);

    // Assert
    expect(addedComment).toStrictEqual(expectedAddedComment);
    expect(mockCommentRepository.addComment).toHaveBeenCalledWith(new AddComment(useCasePayload));
  });

  it('should throw error if thread not found', async () => {
    // Arrange
    const useCasePayload = {
      userId: 'user-123',
      threadId: 'thread-123',
      content: 'abc',
    };

    // Use case dependency
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    // Mocking needed function
    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockThreadRepository.isThreadExist = jest.fn()
      .mockImplementation(() => Promise.reject(new NotFoundError('thread tidak ditemukan')));

    // Creating instance of use case
    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action & Assert
    await expect(addCommentUseCase.execute(useCasePayload)).rejects.toThrow('thread tidak ditemukan');
  });

  it('should throw error if replyTo not found', async () => {
    // Arrange
    const useCasePayload = {
      userId: 'user-123',
      threadId: 'thread-123',
      content: 'abc',
      replyTo: 'comment-123',
    };

    // Use case dependency
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    // Mocking needed function
    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockThreadRepository.isThreadExist = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.getCommentById = jest.fn()
      .mockImplementation(() => Promise.reject(new InvariantError('Komentar tidak ditemukan')));

    // Creating instance of use case
    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action & Assert
    await expect(addCommentUseCase.execute(useCasePayload)).rejects.toThrow('Komentar tidak ditemukan');
  });
});
