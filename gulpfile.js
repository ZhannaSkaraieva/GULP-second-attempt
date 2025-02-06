const gulp = require('gulp');

// Модуль для компиляции SASS в CSS
const sass = require('gulp-sass')(require('sass'));

//const prefixer = require('gulp-autoprefixer');

const autoprefixer = require('autoprefixer')

const postcss = require('gulp-postcss');

// Модуль для минификации CSS
const cleanCSS = require('gulp-clean-css');

// Модуль для минификации JavaScript
const terser = require('gulp-terser');

// Модуль для объединения (конкатенации) файлов
const concat = require('gulp-concat');

const sourcemaps = require('gulp-sourcemaps');

// Модуль для запуска локального сервера и синхронизации с браузером
const browserSync = require('browser-sync').create();    

const paths = {
    styles: {
        src: 'src/scss/**/*.scss', // Исходные файлы SASS
        dest: 'dist/css/'          // Папка для скомпилированных CSS
    },
    scripts: {
        src: 'src/js/**/*.js',     // Исходные JavaScript файлы
        dest: 'dist/js/'           // Папка для минифицированных JS
    },
    html: {
        src: 'src/*.html',         // Исходные HTML файлы
        dest: 'dist/'              // Папка для копируемых HTML
    }
};



function styles() {
    return gulp.src(paths.styles.src) // Берем все SASS файлы
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError)) // Компилируем SASS в CSS 
        // выводит ошибки в консоль, если они возникают, но не останавливает процесс сборки.
        .pipe(cleanCSS()) // Минифицируем CSS
        .pipe(postcss([ autoprefixer() ]))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.styles.dest)) // Сохраняем в папку назначения
        .pipe(browserSync.stream()); // Обновляем браузер при изменениях
}
 
function scripts() { 
    return gulp.src(paths.scripts.src)
        .pipe(concat('main.js')) // Объединяем их в один файл main.js
        .pipe(terser()) // Минифицируем JS
        .pipe(gulp.dest(paths.scripts.dest)) // Сохраняем в папку назначения
        .pipe(browserSync.stream()); // Обновляем браузер при изменениях
}

function html() { 
    return gulp.src(paths.html.src)
        .pipe(gulp.dest(paths.html.dest)) // Сохраняем в папку назначения
        .pipe(browserSync.stream()); // Обновляем браузер при изменениях
}

// Наблюдение за изменениями файлов
function watch() {
    browserSync.init({ // Инициализируем локальный сервер
        server: {
            baseDir: '/dist' // Базовая директория сервера
        }
    });
    gulp.watch(paths.styles.src, styles); // Следим за изменениями SASS файлов
    gulp.watch(paths.scripts.src, scripts); // Следим за изменениями JS файлов
    gulp.watch(paths.html.src, html); // Следим за изменениями HTML файлов

}

// Экспортируем функции для использования в Gulp
// Это позволяет вызывать их отдельно, если нужно
exports.styles = styles; // Компиляция стилей
exports.scripts = scripts; // Минификация скриптов
exports.html = html; // Копирование HTML
exports.watch = watch; // Наблюдение за файлами

// Стандартное задание по умолчанию
// Выполняет компиляцию, минификацию и запуск сервера
exports.default = gulp.series(
    gulp.parallel(styles, scripts, html), // Параллельно выполняем все задачи
    watch // После выполнения запускаем слежение за файлами
);