const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);

    const { id: credentialId } = request.auth.credentials;

    const addedThread = await addThreadUseCase.execute({
      userId: credentialId,
      title: request.payload.title,
      body: request.payload.body,
    });

    const response = h.response({
      status: 'success',
      data: {
        addedThread: {
          id: addedThread.id,
          title: addedThread.title,
          owner: credentialId,
        },
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = ThreadsHandler;
