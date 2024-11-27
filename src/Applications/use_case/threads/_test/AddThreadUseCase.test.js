const AddedThread = require('../../../../Domains/threads/entities/AddedThread');
const AddThread = require('../../../../Domains/threads/entities/AddThread');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      userId: 'user-123',
      title: 'abc',
      body: 'abc',
    };

    // Use case dependency
    const mockThreadRepository = new ThreadRepository();

    // Mocking needed function
    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(
        new AddedThread({
          id: 'thread-123',
          userId: useCasePayload.userId,
          title: useCasePayload.title,
          body: useCasePayload.body,
          createdAt: '2021-08-08T07:22:13.017Z',
        }),
      ));

    // Creating instance of use case
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedThread = await addThreadUseCase.execute(useCasePayload);

    // Assert
    expect(addedThread).toStrictEqual({
      id: 'thread-123',
      title: 'abc',
      owner: 'user-123',
    });
    expect(mockThreadRepository.addThread).toHaveBeenCalledWith(new AddThread(useCasePayload));
  });
});
