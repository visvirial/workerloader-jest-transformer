'use strict';

const fs = require('fs');
const tmp = require('tmp');
const wrapper = require('./utils/wrapper');

module.exports = {
  process(src, filename, config, options) {
    let lang
    let transformer
    if (/^.+\.[t]sx?$/.test(filename)) {
      lang = 'ts'
      transformer = require('ts-jest')
    } else {
      lang = 'js'
      transformer = require('babel-jest')
    }
    tmp.setGracefulCleanup();
    const tmpObj = tmp.fileSync({ postfix: '.js' });
    const source = transformer
      .createTransformer()
      .process(wrapper.wrapSource(src, lang, 'child'), filename, config, { ...options, instrument: false });
    fs.writeSync(tmpObj.fd, typeof source === 'string' ? source : source.code);
    const wrappedSrc = wrapper.wrapSource(src, lang).replace('/* {% WORKER_FILENAME %} */', tmpObj.name);
    return transformer.createTransformer().process(wrappedSrc, filename, config, { ...options, instrument: false });
  },
};
