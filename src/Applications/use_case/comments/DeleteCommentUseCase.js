class DeleteCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(id, userId) {
    // Verify comment owner
    const comment = await this._commentRepository.getCommentById(id);
    if (comment.userId !== userId) {
      throw new Error('DELETE_COMMENT_USE_CASE.NOT_THE_COMMENT_OWNER');
    }

    await this._commentRepository.deleteCommentById(id);
  }
}

module.exports = DeleteCommentUseCase;
