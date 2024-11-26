const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const AddedComment = require('../../../../Domains/comments/entities/AddedComment');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      id: 'comment-123',
      userId: 'user-123',
    };

    // Use case dependency
    const mockCommentRepository = new CommentRepository();

    // Mocking needed function
    mockCommentRepository.getCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve(
        new AddedComment({
          id: useCasePayload.id,
          userId: useCasePayload.userId,
          threadId: 'thread-123',
          replyTo: null,
          content: 'comment',
          createdAt: '2021-08-08T07:22:33.555Z',
        }),
      ));
    mockCommentRepository.deleteCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    // Creating instance of use case
    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    await deleteCommentUseCase.execute(useCasePayload.id, useCasePayload.userId);

    // Assert
    expect(mockCommentRepository.getCommentById)
      .toHaveBeenCalledWith(useCasePayload.id);
    expect(mockCommentRepository.deleteCommentById)
      .toHaveBeenCalledWith(useCasePayload.id);
  });
  it('should throw error when user not comment owner', async () => {
    // Arrange
    const useCasePayload = {
      id: 'comment-123',
      userId: 'user-123',
    };

    // Use case dependency
    const mockCommentRepository = new CommentRepository();

    // Mocking needed function
    mockCommentRepository.getCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve(
        new AddedComment({
          id: useCasePayload.id,
          userId: 'user-321',
          threadId: 'thread-123',
          replyTo: null,
          content: 'comment',
          createdAt: '2021-08-08T07:22:33.555Z',
        }),
      ));
    mockCommentRepository.deleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    // Creating instance of use case
    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action & Assert
    await expect(deleteCommentUseCase.execute(useCasePayload.id, useCasePayload.userId))
      .rejects
      .toThrow('Anda tidak berhak mengakses resource ini');
  });
  it('should throw error when comment not found', async () => {
    // Arrange
    const useCasePayload = {
      id: 'comment-123',
      userId: 'user-123',
    };

    // Use case dependency
    const mockCommentRepository = new CommentRepository();

    // Mocking needed function
    mockCommentRepository.getCommentById = jest.fn()
      .mockImplementation(() => Promise.reject(new Error('NOT_FOUND_ERROR')));

    // Creating instance of use case
    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action & Assert
    await expect(deleteCommentUseCase.execute(useCasePayload.id, useCasePayload.userId))
      .rejects
      .toThrow('NOT_FOUND_ERROR');
  });
});
