var gulp = require('gulp');
var babel = require('gulp-babel');
var rimraf = require('rimraf');

const dirs = {
  src: 'app',
  dest: 'dist',
};

gulp.task('make', () => gulp.src(`${dirs.src}/**/*.js`)
  .pipe(babel())
  .pipe(gulp.dest(dirs.dest)));

gulp.task('copy', () => gulp.src([dirs.src + '/protos/*.proto'])
.pipe(gulp.dest(dirs.dest + '/models')));

gulp.task('clean', (cb) => {
  rimraf(dirs.dest + '/**/*.*', cb);
});

// gulp.task('build', ['clean', 'make', 'copy']);
