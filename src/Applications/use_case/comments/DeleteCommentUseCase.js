const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

class DeleteCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(id, userId) {
    // Verify comment owner
    const comment = await this._commentRepository.getCommentById(id);
    if (comment.userId !== userId) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }

    await this._commentRepository.deleteCommentById(id);
  }
}

module.exports = DeleteCommentUseCase;
