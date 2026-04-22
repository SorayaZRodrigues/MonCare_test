// Global error handler to standardize unexpected errors.
function errorHandler(err, req, res, next) {
  console.error('Unexpected error:', err);
  return res.status(500).json({ message: 'Internal server error' });
}

module.exports = { errorHandler };
