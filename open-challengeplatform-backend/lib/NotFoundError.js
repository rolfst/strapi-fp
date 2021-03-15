class NotFoundError extends Error {
  constructor(mess) {
    super(mess)
  }
}

module.exports = NotFoundError
