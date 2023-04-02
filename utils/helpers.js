class CustomError extends Error {
  constructor(message, statusCode, name, object = null) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
    this.status = statusCode;

    if (object && object.details) {
      this.details = object.details
    }

    Error.captureStackTrace(this, this.constructor);
  }
}

/* Pagination Utils */
const getPagination = (page, size, defaultSize = '10') => {
  let pageStr = page;
  let sizeStr = size;

  if (pageStr && isNaN(pageStr)) {
    throw new Error(`page is NaN: ${page}`);
  }

  if (sizeStr && isNaN(sizeStr)) {
    throw new Error(`size is NaN: ${size}`);
  }

  let offset;
  let limit = size ? +size : defaultSize;
  if (page == '0' || page == '1') {
    offset = 0;
  } else {
    offset = page ? --page * limit : '0';
  }

  if (size) {
    limit = limit.toString();
  }

  if (page) {
    offset = offset.toString();
  }

  return { limit, offset };
};

const getPagingData = (data, page, limit) => {
  const { count, rows: results } = data;
  let currentPage = page ? +page : 0;
  if (currentPage <= 0) {
    currentPage = 1;
  }
  const totalPages = Math.ceil(count / limit);
  if (totalPages <= 0) {
    currentPage = 0;
  }
  return { count, totalPages, currentPage, results };
};


const setRawWhereOperatorCount = (
  query,
  operators = {
    get: '>=',
    gt: '>',
    lte: '<=',
    lt: '<',
    eq: '=',
  }
) => {
  let operator = query.split(',', 1).pop();
  let querySplited = query.split(',');

  if (!Array.isArray(querySplited))
    throw new CustomError(
      'Not Array!',
      500,
      'Not Array in Checker'
    );

  if (querySplited.length !== 2)
    throw new CustomError(
      'Only accepts two arguments!', 400,
      'Operator Query Format'
    );

  if (!(operator in operators))
    throw new CustomError(
      `Operator Not Allowed for this filter!: Allowed: ${Object.keys(
        operators
      )}`,
      400,
      'Bad Request'
    );

  if (!/^\d+$/.test(querySplited[1]))
    throw new CustomError(
      'Not a number for the value filter!',
      400,
      'Bad Request'
    );

  return [operators[operator], querySplited[1]];
};





module.exports = {
  CustomError,
  getPagination,
  getPagingData,
  setRawWhereOperatorCount
};