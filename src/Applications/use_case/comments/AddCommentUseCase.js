const AddComment = require('../../../Domains/comments/entities/AddComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    // Check if thread exists
    await this._threadRepository.isThreadExist(useCasePayload.threadId);

    // Check if this is a reply, and if so, check if the replyTo comment exists
    if (useCasePayload.replyTo) {
      await this._commentRepository.getCommentById(useCasePayload.replyTo);
    }

    const addComment = new AddComment(useCasePayload);
    const addedComment = await this._commentRepository.addComment(addComment);

    return ({
      id: addedComment.id,
      content: addedComment.content,
      owner: addedComment.userId,
    });
  }
}

module.exports = AddCommentUseCase;
