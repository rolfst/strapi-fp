class NotAllowedError extends Error {
  constructor(mess) {
    super(mess)
  }
}

module.exports = NotAllowedError
