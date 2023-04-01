const {
  ValidationError,
  DatabaseError,
  BaseError,
  QueryError,
  EmptyResultError,
  AggregateError,
  UnknownConstraintError,
  UniqueConstraintError,
  ConnectionError,
  ConnectionAcquireTimeoutError,
  ConnectionRefusedError,
  ConnectionTimedOutError,
  InvalidConnectionError,
} = require('sequelize');

function logErrors(err, req, res, next) {
  console.error(err);
  next(err);
}

function errorHandler(err, req, res, next) {
  let { status } = err;

  return res.status(status || 500).json({
    message: err.message,
    errorName: err.name,

    /* Auxiliar Info -example in schemas compare*/
    details: err.details,
  });
}

function handlerAuthError(err, req, res, next) {
  if (err.status === 401 || err.status === 403) {
    return res.status(err.status).json({
      errorName: err.name,
      message: err.message,
      errors: err.errors,
    });
  }

  //   if (err.name === "CustomName")
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      errorName: err.name,
      message: err.message,
      errors: err.errors,
      // stack: err.stack,
    });
  }

  if (err.name === 'Error Testing') {
    return res.status(401).json({
      errorName: err.name,
      message: err.message,
      errors: err.errors,
      // stack: err.stack,
    });
  }

  next(err);
}

function ormErrorHandler(err, req, res, next) {
  if (
    err instanceof ConnectionError ||
    err instanceof ConnectionAcquireTimeoutError ||
    err instanceof ConnectionRefusedError ||
    err instanceof ConnectionTimedOutError ||
    err instanceof InvalidConnectionError
  ) {
    console.log('----ESTE ES EL ERROR',err.message)
    return res.status(409).json({
      statusCode: 409,
      name: err.name,
      message: 'Database Connection Error',
    });
  }

  if (err instanceof ValidationError) {
    console.log('----ESTE ES EL ERROR',err.message)
    return res.status(409).json({
      statusCode: 409,
      name: err.name,
      message: err.message,
      errors: err.errors,
    });
  }

  if (err instanceof QueryError ||
      err instanceof UnknownConstraintError ||
      err instanceof  AggregateError ||
      err instanceof UniqueConstraintError) {
    console.log('----ESTE ES EL ERROR',err.message)
    return res.status(409).json({
      statusCode: 409,
      name: err.name,
      message: err.message,
      errors: err.errors,
    });
  }

  if (err instanceof EmptyResultError) {
    console.log('----ESTE ES EL ERROR',err.message)
    return res.status(409).json({
      statusCode: 409,
      name: err.name,
      message: err.message,
      errors: err.errors,
    });
  }

  if (err instanceof DatabaseError) {
    console.log('----ESTE ES EL ERROR',err.message)
    return res.status(409).json({
      statusCode: err.status,
      name: err.name,
      message: err.message,
      errors: err.errors,
      parametros: err.parameters,
      // errorOriginal: err['original'],
      // sql: err['sql'],
      // stack: err.stack,
    });
  }

  if (err instanceof BaseError) {
    console.log('----ESTE ES EL ERROR', err.message)
    return res.status(409).json({
      statusCode: err.status,
      name: err.name,
      message: err.message,
      errors: err.errors,
      parametros: err.parameters,
      // errorOriginal: err['original'],
      // sql: err['sql'],
    //   stack: err.stack,
    });
  }

  next(err);
}

module.exports = { logErrors, handlerAuthError, errorHandler, ormErrorHandler };
