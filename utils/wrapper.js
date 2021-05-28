'use strict';

const fs = require('fs');
const path = require('path');
const stripper = require('./stripper');


module.exports = {
  wrapSource(src, lang='js', template='worker') {
    const worker = fs.readFileSync(
      path.resolve(__dirname, '..', 'templates', `${template}.${lang}`),
      {encoding:'utf8', flag:'r'}
    );
    const {code, imports} = stripper.stripImports(src)

    return worker
        .replace('/* {% WORKER_CODE %} */', code.replace(/\n/g, '\n    '))
        .replace('/* {% WORKER_IMPORTS %} */', imports.join('\n'))
  }
}
