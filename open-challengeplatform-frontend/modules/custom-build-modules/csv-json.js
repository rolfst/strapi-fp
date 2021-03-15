const fs = require('fs');
const papa = require('papaparse');

const englishJson = {};
const nlJson = {};

const f = fs.readFileSync(__dirname + '/translation.csv', 'utf8');
papa.parse(f, {
  config: {
    delimiter: ','
  },
  step: function (row) {
    const [title, en, nl] = row.data;
    englishJson[title] = en;
    nlJson[title] = nl;
  },
  complete: function () {
    fs.writeFileSync('./locales/en.json', JSON.stringify(englishJson));
    fs.writeFileSync('./locales/nl.json', JSON.stringify(nlJson));
  }
});
