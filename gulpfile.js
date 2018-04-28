var gulp = require("gulp");
var ts = require("gulp-typescript");
var gulpSequence = require('gulp-sequence');
var tsProject = ts.createProject("./tsconfig.json");
var del = require("del");


gulp.task("clean", function () {
    del(['bin']);
    var filter = function(extension) {
        return function (file) {
            return file.replace(/.ts$/, '.'+extension);
        };
    };
    return gulp.src("src/**/*.ts",function (err,files) {
        del(files.map(filter("js")));
        del(files.map(filter("js.map")));
    })
});

gulp.task("build", function () {
    var tsResult = tsProject.src() // or tsProject.src()
        .pipe(tsProject());

    return tsResult.on('error', function () {
        process.exit(1)
    })
        .js.pipe(gulp.dest("bin"))

});

gulp.task('default', gulpSequence('clean', 'build'));