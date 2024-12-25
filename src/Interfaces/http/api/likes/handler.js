const AddLikeUseCase = require('../../../../Applications/use_case/likes/AddLikeUseCase');

class LikesHandler {
  constructor(container) {
    this._container = container;

    this.postLikeHandler = this.putLikeHandler.bind(this);
  }

  async putLikeHandler(request, h) {
    const addLikeUseCase = this._container.getInstance(AddLikeUseCase.name);

    const { id: credentialId } = request.auth.credentials;
    const { commentId, threadId } = request.params;

    const likeId = await addLikeUseCase.execute({
      userId: credentialId,
      commentId,
      threadId,
    });

    const response = h.response({
      status: 'success',

    });
    response.code(200);
    return response;
  }
}

module.exports = LikesHandler;
