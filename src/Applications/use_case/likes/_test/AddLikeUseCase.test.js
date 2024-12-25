const AddLike = require('../../../../Domains/likes/entities/AddLike');
const LikeRepository = require('../../../../Domains/likes/LikeRepository');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const AddLikeUseCase = require('../AddLikeUseCase');

const InvariantError = require('../../../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../../../Commons/exceptions/NotFoundError');

describe('AddLikeUseCase', () => {
  it('should orchestrating the add like action correctly', async () => {
    // Arrange
    const useCasePayload = {
      userId: 'user-123',
      commentId: 'comment-123',
      threadId: 'thread-123',
    };

    // Use case dependency
    const mockLikeRepository = new LikeRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    // Mocking needed function
    mockThreadRepository.isThreadExist = jest.fn()
      .mockImplementation(() => Promise.resolve(true));

    mockCommentRepository.isCommentExist = jest.fn()
      .mockImplementation(() => Promise.resolve(true));

    mockLikeRepository.isLikeExist = jest.fn()
      .mockImplementation(() => Promise.resolve(false));

    mockLikeRepository.deleteLike = jest.fn()
      .mockImplementation(() => Promise.resolve(
        'like-123',
      ));

    mockLikeRepository.addLike = jest.fn()
      .mockImplementation(() => Promise.resolve(
        'like-123',
      ));

    // Creating instance of use case
    const addLikeUseCase = new AddLikeUseCase({
      likeRepository: mockLikeRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const likeId = await addLikeUseCase.execute(useCasePayload);

    // Assert
    expect(likeId).toEqual('like-123');
    expect(mockThreadRepository.isThreadExist).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.isCommentExist).toHaveBeenCalledWith(useCasePayload.commentId);
    expect(mockLikeRepository.isLikeExist).toHaveBeenCalledWith(useCasePayload.userId, useCasePayload.commentId);
    expect(mockLikeRepository.addLike).toHaveBeenCalledWith(new AddLike(useCasePayload));
    expect(mockLikeRepository.deleteLike).not.toHaveBeenCalled();
  });

  it('should delete like if already exist', async () => {
    // Arrange
    const useCasePayload = {
      userId: 'user-123',
      commentId: 'comment-123',
      threadId: 'thread-123',
    };

    // Use case dependency
    const mockLikeRepository = new LikeRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    // Mocking needed function
    mockThreadRepository.isThreadExist = jest.fn()
      .mockImplementation(() => Promise.resolve(true));

    mockCommentRepository.isCommentExist = jest.fn()
      .mockImplementation(() => Promise.resolve(true));

    mockLikeRepository.isLikeExist = jest.fn()
      .mockImplementation(() => Promise.resolve(true));

    mockLikeRepository.deleteLike = jest.fn()
      .mockImplementation(() => Promise.resolve(
        'like-123',
      ));

    mockLikeRepository.addLike = jest.fn()
      .mockImplementation(() => Promise.resolve(
        'like-123',
      ));

    // Creating instance of use case
    const addLikeUseCase = new AddLikeUseCase({
      likeRepository: mockLikeRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const likeId = await addLikeUseCase.execute(useCasePayload);

    // Assert
    expect(likeId).toEqual('like-123');
    expect(mockThreadRepository.isThreadExist).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.isCommentExist).toHaveBeenCalledWith(useCasePayload.commentId);
    expect(mockLikeRepository.isLikeExist).toHaveBeenCalledWith(useCasePayload.userId, useCasePayload.commentId);
    expect(mockLikeRepository.deleteLike).toHaveBeenCalledWith(useCasePayload.userId, useCasePayload.commentId);
    expect(mockLikeRepository.addLike).not.toHaveBeenCalled();
  });

  it('should throw error when comment not found', async () => {
    // Arrange
    const useCasePayload = {
      userId: 'user-123',
      commentId: 'comment-123',
      threadId: 'thread-123',
    };

    // Use case dependency
    const mockLikeRepository = new LikeRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    // Mocking needed function
    mockThreadRepository.isThreadExist = jest.fn()
      .mockImplementation(() => Promise.resolve(true));

    mockCommentRepository.isCommentExist = jest.fn()
      .mockImplementation(() => Promise.reject(new NotFoundError('Komentar tidak ditemukan')));

    mockLikeRepository.isLikeExist = jest.fn()
      .mockImplementation(() => Promise.resolve(false));

    mockLikeRepository.deleteLike = jest.fn()
      .mockImplementation(() => Promise.resolve(
        'like-123',
      ));

    mockLikeRepository.addLike = jest.fn()
      .mockImplementation(() => Promise.resolve(
        'like-123',
      ));

    // Creating instance of use case
    const addLikeUseCase = new AddLikeUseCase({
      likeRepository: mockLikeRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action & Assert
    await expect(addLikeUseCase.execute(useCasePayload)).rejects.toThrow(NotFoundError);
    expect(mockThreadRepository.isThreadExist).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.isCommentExist).toHaveBeenCalledWith(useCasePayload.commentId);
    expect(mockLikeRepository.isLikeExist).not.toHaveBeenCalled();
    expect(mockLikeRepository.addLike).not.toHaveBeenCalled();
    expect(mockLikeRepository.deleteLike).not.toHaveBeenCalled();
  });
});
