const AddComment = require('../../../Domains/comments/entities/AddComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    // Check if thread exists
    await this._threadRepository.getThreadById(useCasePayload.threadId);

    // Check if this is a reply, and if so, check if the replyTo comment exists
    if (useCasePayload.replyTo) {
      await this._commentRepository.getCommentById(useCasePayload.replyTo);
    }

    const addComment = new AddComment(useCasePayload);
    return this._commentRepository.addComment(addComment);
  }
}

module.exports = AddCommentUseCase;
