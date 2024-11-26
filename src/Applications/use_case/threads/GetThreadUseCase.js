class GetThreadUseCase {
  constructor({ threadRepository, userRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._userRepository = userRepository;
    this._commentRepository = commentRepository;
  }

  async execute(id) {
    const thread = await this._threadRepository.getThreadById(id);
    const user = await this._userRepository.getUserById(thread.userId);
    const comments = await this._commentRepository.getCommentsByThreadId(id);

    const commentsWithUsername = await Promise.all(comments.map(async (c) => {
      const u = await this._userRepository.getUserById(c.userId);
      const commentWithUsername = { ...c, username: u.username };

      return commentWithUsername;
    }));

    return {
      id: thread.id,
      title: thread.title,
      body: thread.body,
      date: thread.createdAt,
      username: user.username,
      comments: commentsWithUsername
        .filter((comment) => typeof comment.replyTo !== 'string')
        .map((comment) => ({
          id: comment.id,
          username: comment.username,
          date: comment.createdAt,
          content: comment.content,
          replies: commentsWithUsername
            .filter((reply) => reply.replyTo === comment.id)
            .map((reply) => ({
              id: reply.id,
              username: reply.username,
              date: reply.createdAt,
              content: reply.content,
            })),
        })),
    };
  }
}

module.exports = GetThreadUseCase;
