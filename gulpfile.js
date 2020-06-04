const gulp = require('gulp');
const shell = require('gulp-shell');

gulp.task(
  'createDocs',
  shell.task(['rm -rf out', './node_modules/.bin/jsdoc -c conf.json'])
);
