#! /usr/bin/env node

const _ = require('lodash');
const chalk = require('chalk');
const debug = require('debug');
const fs = require('fs');
const Handlebars = require('handlebars');
const P = require('bluebird');
const path = require('path');
const program = require('commander');

const dlog = debug('interpolate');

Handlebars.registerHelper('Capitalize', s => _.capitalize(s));
Handlebars.registerHelper('snake_case', s => _.snakeCase(s));
Handlebars.registerHelper('lowerCase', s => _.lowerCase(s));
Handlebars.registerHelper('upperCase', s => _.toUpper(s));

program
  .option('-j, --json [path]', 'JSON file with input data')
  .option('-t, --template [path]', 'Handlebars template to interpolate')
  .option('-n, --noEscape', 'Don\'t do HTML escaping')
  .on('--help', function() {
    console.log('If the JSON file is a package.json, read-package-json is used to read the file.')
    console.log('Note that read-package-json normalizes some fields.')
    console.log(chalk.bold('  `--json [path]` and `--tempate [path]` are REQUIRED.'));
  })
  .parse(process.argv);

const opts = program.opts();

if (_.isUndefined(opts.json) || _.isUndefined(opts.template)) {
  program.help();
}

const readTextP = P.promisify(fs.readFile, fs);

function writeP(text) {
  return new P((resolve, reject) => {
    process.stdout.write(text, 'utf8', err => {
      if (err) return reject(err);
      return resolve();
    });
  });
}

function readPackageJsonP(jsonPath) {
  const readJson = require('read-package-json');
  return new P((resolve, reject) => {
    readJson(jsonPath, console.error, false, (err, data) => {
      if (err) return reject(err);
      return resolve(data);
    });
  });
}

if (path.basename(opts.json) === 'package.json') {
  readJsonP = readPackageJsonP;
} else {
  const jsonfile = require('jsonfile');
  readJsonP = P.promisify(jsonfile.readFile, jsonfile);
}

P.join(
    readJsonP(opts.json),
    readTextP(opts.template, { encoding: 'utf8' }),
    (json, templateText) => {
      const template = Handlebars.compile(templateText, { noEscape: program.opts().noEscape });
      const result = template(json);
      return result;
    })
  .then(text => writeP(text));
