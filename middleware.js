const upload = require('./multer');
const { bookFileFields } = require('./utils');

const uploadBookFileFields = upload.fields(bookFileFields.map(field => ({ name: field, maxCount: 1 })));

module.exports = { uploadBookFileFields };
