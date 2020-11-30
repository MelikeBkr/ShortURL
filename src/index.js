const express = require('express');
const dns = require('dns');
const path = require('path');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const nanoid = require('nanoid');


const databaseUrl = 'mongodb://localhost:27017';

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')))


MongoClient.connect(databaseUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    app.locals.db = client.db('shortener');
  })
  .catch(() => console.error('Database connection error!'));

const shortenURL = (db, url) => {
  const shortURLs = db.collection('shortURLs');
  return shortURLs.findOneAndUpdate({ original_url: url },
    {
      $setOnInsert: {
        original_url: url,
        uniqueStringID: nanoid(7),
      },
    },
    {
      returnOriginal: false,
      upsert: true,
    }
  );
};

const isShortUrlExist = (db, code) => db.collection('shortURLs')
  .findOne({ uniqueStringID: code });

app.get('/', (req, res) => {
  const htmlPath = path.join(__dirname, 'public', 'index.html');
  res.sendFile(htmlPath);
})

app.post('/longUrl', (req, res) => {
  let originalUrl;
  try {
    originalUrl = new URL(req.body.url);
  } catch (err) {
    return res.status(400).send({error: 'invalid URL'});
  }

  dns.lookup(originalUrl.hostname, (err) => {
    if (err) {
      return res.status(404).send({error: 'Address not found!'});
    };

    const { db } = req.app.locals;
    shortenURL(db, originalUrl.href)
      .then(result => {
        const doc = result.value;
        res.json({
          original_url: doc.original_url,
          uniqueStringID: doc.uniqueStringID,
        });
      })
      .catch(console.error);
  });
});

app.get('/:uniqueStringID', (req, res) => {
  const shortId = req.params.uniqueStringID;

  const { db } = req.app.locals;
  isShortUrlExist(db, shortId)
    .then(doc => {
      if (doc === null) return res.send('URL could not be found');

      res.redirect(doc.original_url)
    })
    .catch(console.error);

});

app.set('port', 8080);
const server = app.listen(app.get('port'), () => {
  console.log(`Server is running → PORT ${server.address().port}`);
});
