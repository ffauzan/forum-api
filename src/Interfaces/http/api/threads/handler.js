const AddThreadUseCase = require('../../../../Applications/use_case/threads/AddThreadUseCase');
const GetThreadUseCase = require('../../../../Applications/use_case/threads/GetThreadUseCase');

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
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async getThreadHandler(request, h) {
    const getThreadUseCase = this._container.getInstance(GetThreadUseCase.name);

    const thread = await getThreadUseCase.execute(request.params.threadId);

    return {
      status: 'success',
      data: {
        thread,
      },
    };
  }
}

module.exports = ThreadsHandler;
