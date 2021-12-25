const _ = require('lodash');
const bookFields = ['title', 'description', 'authors', 'favourite'];
const bookFileFields = ['fileCover', 'fileName', 'fileBook'];

function parseBookDataFromReq(req) {
  const res = _.pick(req.body, bookFields);

  // In form data "authors" field is a JSON string, it is not automatically parsed
  if ('authors' in res && typeof res.authors === 'string') {
    try {
      res.authors = JSON.parse(res.authors);
    } catch (e) {
      res.authors = [res.authors];
    }
  }

  if (req.files) {
    bookFileFields.forEach(field => {
      if (req.files[field]) {
        res[field] = req.files[field][0].filename;
      }
    });
  }

  return res;
}

module.exports = { parseBookDataFromReq, bookFileFields };
