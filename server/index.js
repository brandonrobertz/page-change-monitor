const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const crypto = require('crypto');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.static('build'))
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', (req, res) => {
  res.send({
    hello: 'The pagemon server is running!'
  });
});

const clean = (val) => {
  const txt = val.replace(/[\n\r]/g, "").replace(/\s+/g, " ")
  return txt;
};

const compareEls = (prevEls, newEls, $_prev, $_new) => {
  let changed = false;
  prevEls.each((ix, prevNode) => {
    const newNode = newEls[ix.toString()];
    const newOuter = clean($_new.html(newNode));
    const prevOuter = clean($_prev.html(prevNode));
    if (newOuter !== prevOuter) changed = true;
  });
  return changed;
};

const performChangeChecks = (checks, prevData, newData) => {
  let changed = false;
  const $_prev = cheerio.load(prevData);
  const $_new = cheerio.load(newData);
  checks.forEach((check) => {
    if (check === "strictEq") {
      if (prevData !== newData) changed = true;
    } else if (check === "pageText") {
      if (clean($_prev.text()) !== clean($_new.text())) changed = true;
    } else {
      const prevEls = $_prev(check) || [];
      const newEls = $_new(check) || [];
      if (prevEls.length !== newEls.length) {
        changed = true;
        return
      }
      changed = compareEls(prevEls, newEls, $_prev, $_new);
    }
  });
  return changed;
};

app.post('/check-page', (req, res) => {
  // URL to check
  const url = req.body.url;
  console.log(`Checking ${url}`);
  // whether or not this is our initial load (just return page data)
  const isInit = req.body.isInit === undefined ? false : req.body.isInit;
  // last known page HTML/response body data
  const pageData = req.body.pageData;
  // list of checks to perform. array of strings, can
  // be one or more of: "strictEq", "pageText", cssSelector
  const checks = req.body.checks || ["strictEq"];

  axios.get(req.body.url)
    .then((response) => {
      const hash = crypto.createHash('md5').update(response.data).digest('hex');
      if (isInit) {
        res.send({
          result: "success",
          changed: false, 
          pageData: response.data,
          pageHash: hash,
        });
      } else {
        const changed = performChangeChecks(checks, pageData, response.data);
        res.send({
          result: "success",
          changed: changed, 
          pageData: response.data,
          pageHash: hash,
        });
      }
    })
    .catch((error) => {
      console.error("error", error);
      res.send({
        result: "failure",
        // don't mark failures as changed
        changed: false, 
        error: error.message,
      });
    });

});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
