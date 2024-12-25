class GetThreadUseCase {
  constructor({
    threadRepository, userRepository, commentRepository, likeRepository,
  }) {
    this._threadRepository = threadRepository;
    this._userRepository = userRepository;
    this._commentRepository = commentRepository;
    this._likeRepository = likeRepository;
  }

  async execute(id) {
    const thread = await this._threadRepository.getThreadById(id);
    const user = await this._userRepository.getUserById(thread.userId);
    const comments = await this._commentRepository.getCommentsByThreadId(id);

    const commentsFormatted = await Promise.all(comments.map(async (c) => {
      const u = await this._userRepository.getUserById(c.userId);
      const likeCount = await this._likeRepository.getLikeCountByCommentId(c.id);

      const commentFormatted = {
        ...c,
        username: u.username,
        likeCount,
      };

      if (c.isDeleted) {
        if (c.replyTo) {
          return {
            ...commentFormatted,
            content: '**balasan telah dihapus**',
          };
        }

        return {
          ...commentFormatted,
          content: '**komentar telah dihapus**',
        };
      }

      return commentFormatted;
    }));

    return {
      id: thread.id,
      title: thread.title,
      body: thread.body,
      date: thread.createdAt,
      username: user.username,
      comments: commentsFormatted
        .filter((comment) => comment.replyTo === null)
        .map((comment) => ({
          id: comment.id,
          username: comment.username,
          date: comment.createdAt,
          content: comment.content,
          likeCount: comment.likeCount,
          replies: commentsFormatted
            .filter((reply) => reply.replyTo === comment.id)
            .map((reply) => ({
              id: reply.id,
              username: reply.username,
              date: reply.createdAt,
              content: reply.content,
              likeCount: reply.likeCount,
            })),
        })),
    };
  }
}

module.exports = GetThreadUseCase;
