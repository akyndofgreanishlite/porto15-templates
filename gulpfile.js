var gulp = require('gulp');
var sass = require('gulp-sass');
var notify = require('gulp-notify');
var livereload = require('gulp-livereload');
var removeEmptyLines = require('gulp-remove-empty-lines');
var duration = require('gulp-duration')
var nodeStatic = require('node-static');
var http = require('http');
// static server
var file = new nodeStatic.Server('./', {
    cache: 3600,
    gzip: true
});
http.createServer(function (request, response){
  request.addListener('end', function(){
    file.serve(request, response);
  }).resume();
}).listen(3000);

var errorHandler = function(err) {
  return notify({
    title: "SASS Compile Error",
    wait: false
  }).write({message: err.message, wait: false});
}

gulp.task('css', function(){
  gulp.src('assets/scss/main.scss')
    .pipe(sass({
        outputStyle: 'nested'
      }).on('error', errorHandler))
    .pipe(duration('SCSS Compiled'))
    .pipe(removeEmptyLines())
    .pipe(gulp.dest('assets/css'))
    .pipe(livereload({ auto: false }));
});

gulp.task('watch', function(){
  livereload.listen();
  gulp.watch([ 'assets/scss/**/*.scss' ], ['css']);
});

gulp.task('default', ['css', 'watch']);
