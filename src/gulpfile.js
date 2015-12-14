// Require necessary plugins
var gulp     = require('gulp')
	rename   = require('gulp-rename')
	plumber  = require('gulp-plumber')
	jade     = require('gulp-jade')
	less     = require('gulp-less')
	prefix   = require('gulp-autoprefixer')
	mincss   = require('gulp-csso')
	concat   = require('gulp-concat')
	uglify   = require('gulp-uglify')
	htmlhint = require('gulp-htmlhint')
	sync     = require('browser-sync');

// Jade template engine task
gulp.task('jade', function() {
	gulp.src('jade/*.jade')
		.pipe(plumber())
		.pipe(jade({
			pretty: true
		}))
		.pipe(gulp.dest('../public'));
});

// Less compiling and minify
gulp.task('css', function() {
	gulp.src('less/app.less')
		.pipe(plumber())
		.pipe(less())
		.pipe(prefix())
		.pipe(gulp.dest('../public/assets/css'))
		.pipe(rename({suffix: '.min'}))
		.pipe(mincss())
		.pipe(gulp.dest('../public/assets/css'))
});

// JS compiling and minify
gulp.task('js', function() {
	return gulp.src([
		'bower_components/jquery/dist/jquery.js',
		'js/*.js'
	])
		.pipe(plumber())
		.pipe(concat('app.js'))
		.pipe(gulp.dest('../public/assets/js'))
		.pipe(uglify())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('../public/assets/js'));
});

// HTML Validation
gulp.task('htmlhint', function() {
	return gulp.src('../public/*.html')
		.pipe(plumber())
		.pipe(htmlhint());
});

// Watch files and run tasks
gulp.task('watch', function() {
	gulp.watch('less/*.less', ['css']);
	gulp.watch('jade/*.jade', ['jade']);
	gulp.watch('../public/*.html', ['htmlhint']);
});

// Sync browser
gulp.task('sync', function() {
	var files = [
		'../public/**'
	];
	sync.init(files, {
		server: {
			baseDir: '../public'
		}
	});
});

gulp.task('copy', function() {
	gulp.src('./bower_components/font-awesome/fonts/**/*.{ttf,woff,eof,svg}')
		.pipe(plumber())
		.pipe(gulp.dest('../public/assets/fonts'));
	gulp.src('./images/**.*')
		.pipe(plumber())
		.pipe(gulp.dest('../public/assets/images'));
});

// Build Task
gulp.task('build', ['css', 'js', 'jade', 'copy', 'htmlhint']);
// Default Task
gulp.task('default', ['build', 'watch', 'sync']);
