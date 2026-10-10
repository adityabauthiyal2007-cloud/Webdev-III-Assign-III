function notFound(req, res, next) {
  res.status(404);
  next(new Error(`Route not found: ${req.method} ${req.originalUrl}`));
}

function errorHandler(error, req, res, next) {
  let status = res.statusCode >= 400 ? res.statusCode : 500;
  let message = error.message || "Server error";

  if (error.name === "ValidationError") { status = 400; }
  if (error.code === 11000) { status = 409; message = "A product with this SKU already exists"; }
  if (error.name === "CastError") { status = 400; message = "Invalid ID or value"; }

  res.status(status).json({ message });
}

module.exports = { notFound, errorHandler };
