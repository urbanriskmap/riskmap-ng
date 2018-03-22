const gulp = require('gulp');
const typedoc = require('gulp-typedoc');

gulp.task('typedoc', () => {

  return gulp
  .src(["../src/app/**/*.ts"])
  .pipe(typedoc({
    module: "commonjs",
    exclude: "**/*.spec.ts",
    experimentalDecorators: true,
    target: "es6",
    out: "../docs/",
    name: "RiskMap documentation"
  }));
});

gulp.task('default', ['typedoc']);
