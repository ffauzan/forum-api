const AddCommentUseCase = require('../../../../Applications/use_case/comments/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/comments/DeleteCommentUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);

    const { id: credentialId } = request.auth.credentials;

    const addedComment = await addCommentUseCase.execute({
      userId: credentialId,
      threadId: request.params.threadId,
      content: request.payload.content,
      replyTo: null,
    });

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentHandler(request, h) {
    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);

    const { id: credentialId } = request.auth.credentials;
    const { commentId } = request.params;

    await deleteCommentUseCase.execute(commentId, credentialId);

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }

  async postCommentReplyHandler(request, h) {
    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);

    const { id: credentialId } = request.auth.credentials;

    const addedReply = await addCommentUseCase.execute({
      userId: credentialId,
      threadId: request.params.threadId,
      content: request.payload.content,
      replyTo: request.params.commentId,
    });

    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentReplyHandler(request, h) {
    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);

    const { id: credentialId } = request.auth.credentials;
    const { replyId } = request.params;

    await deleteCommentUseCase.execute(replyId, credentialId);

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = CommentsHandler;
