const nanoid = require('nanoid');

const shortenUrl = (db, url) => {
  const shortUrls = db.collection('shortUrls');
  return shortUrls.findOne({ originalUrl: url })
    .then(doc => {
      if (doc === null) {
        return shortUrls.insertOne({
            originalUrl: url,
            shortUrl: nanoid(7),
          })
          .then(response => response.ops[0]);
      }

      return doc;
    });
};

const checkIfShortUrlCodeExists = (db, code) => db.collection('shortUrls')
  .findOne({ shortUrl: code })
  .then(doc => {
    if (doc === null) throw Error('URL could not be found');

    return doc;
  });
