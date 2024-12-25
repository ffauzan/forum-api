const AddLike = require('../../../Domains/likes/entities/AddLike');

class AddLikeUseCase {
  constructor({ likeRepository, threadRepository, commentRepository }) {
    this._likeRepository = likeRepository;
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const addLike = new AddLike(useCasePayload);
    const { userId, threadId, commentId } = addLike;

    // Check if thread exist
    await this._threadRepository.isThreadExist(threadId);

    // Check if comment exist
    await this._commentRepository.isCommentExist(commentId);

    // Check if like already exist
    const isLikeExist = await this._likeRepository.isLikeExist(userId, commentId);
    if (isLikeExist) {
      // Delete like if already exist
      const likeId = await this._likeRepository.deleteLike(userId, commentId);
      return likeId;
    }
    // Add like if not exist
    const likeId = await this._likeRepository.addLike(addLike);
    return likeId;
  }
}

module.exports = AddLikeUseCase;
