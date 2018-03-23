const gulp = require('gulp');
const changedInPlace = require('gulp-changed-in-place');
const parseArgs = require('minimist');

// Parse deployment key from cli
const args = parseArgs(process.argv.slice(2));
const dep = args.dep;

const deploymentMap = {
  id: 'Indonesia, petabencana.id',
  in: 'India, riskmap.in',
  us: 'USA, riskmap.us'
};

if (dep === 'id' || dep === 'in' || dep === 'us') {
  console.log('Specified deployment is ' + deploymentMap[dep]);
} else {
  throw 'No deployment specified, prefix dep=id|in|us to command';
}


gulp.task('fetchAssets', () => {
  return gulp
  .src([`../deployments/${dep}/assets/**/*`])
  .pipe(changedInPlace({firstPass: true}))
  .pipe(gulp.dest('../src/assets/'));
});

gulp.task('fetchResources', () => {
  return gulp
  .src([`../deployments/${dep}/resources/**/*`])
  .pipe(changedInPlace({firstPass: true}))
  .pipe(gulp.dest('../src/resources/'));
});

gulp.task('default', ['fetchAssets', 'fetchResources']);
