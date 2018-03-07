Краткая инструкция по установке/настройке markup для нового проекта.

#### Что используется:

*   [npm](https://docs.npmjs.com/getting-started/what-is-npm)
*   [Gulp](http://gulpjs.com/)
*   [Bower](http://bower.io/)
*   [SASS](http://sass-lang.com/) (с синтаксисом SCSS) + [bourbon](http://bourbon.io/)
*   [Pug](https://pugjs.org/) язык разметки + шаблонизатор

Markup находится в _git_ репозитории [тут](http://git.ddm-studio.com:8080/scm/git/markup-template).

#### Начало:

Клонируем его, заходим в папку нового проекта, удаляем файлы _git_ и создаём новые, поскольку у нашего нового проекта будет "своя история":

``` shell
$ git clone http://git.ddm-studio.com:8080/scm/git/markup-template <имя нового проекта>
$ cd <имя нового проекта>
$ rm -rf .git && git init
```

Для сборки проекта понадобится _npm_. Следуем [инструкции по установке _nodejs_](https://nodejs.org/en/download/package-manager/), поскольку _npm_ является частью _nodejs_. И устанавливаем с помощью _npm_ всё что нам необходимо для сборки:

``` shell
$ cd markup
$ npm install
$ bower install # (`$ npm run bower -- install`, если bower не установлен в системе глобально)
```

#### Конфигурация:

Конфигурационные файлы находятся в папке **markup**:

*   [package.json](https://docs.npmjs.com/files/package.json) - список инструментов для сборки проекта и информация о проекте
*   [.babelrc](http://babeljs.io/docs/usage/options/) - конфигурационный файл JS-трансплитера _Babel_
*   [gulpfile.babel.js](https://github.com/gulpjs/gulp/blob/master/docs/API.md) - конфигурационный файл сборщика _gulp_
*   [.eslintrc.json](http://eslint.org/docs/user-guide/configuring) - конфигурационный файл линтера _ESLint_
*   [.editorconfig](http://editorconfig.org/) - конфигурационный файл для редакторов/IDE _EditorConfig_
*   [bower.json](https://github.com/bower/spec/blob/master/json.md) - список инструментов для сборки проекта и информация о проекте
*   [.gitignore](https://git-scm.com/docs/gitignore) - список файлов/папок которые _git_ не должен добавлять в репозиторий

Все исходники хранятся в папке **markup/src** и компилируются с помощью _gulp_ в папку **markup/build**. Файлы для подключения css/js плагинов:

*   **markup/src/scss/application.scss**, по законам импорта [SASS](http://sass-lang.com/documentation/file.SASS_REFERENCE.html#import)
*   **markup/src/js/app/application.js**, по законам импорта [gulp-file-include](https://github.com/coderhaoxin/gulp-file-include)
*   **markup/src/js/vendor/vendor.js**, по законам импорта [gulp-file-include](https://github.com/coderhaoxin/gulp-file-include)

#### Рабочий процесс:

Список команд сборщику _gulp_ (пути указаны относительно папки **markup**, и если _gulp_ не установлен глобально в системе,- используйте `npm run gulp -- <опции для gulp>`):

*   `gulp build:vendor` - копирует содержимое папок js/css плагинов из **src/vendor** в **build/vendor** файлы с расширениями **css,jpg,jpeg,png,ico,gif,svg,eot,ttf,woff,woff2** (можно перенастроить в _gulpfile.babel.js_).
*   `gulp build:html` - собирает с помощью _Pug_ \*.html файлы в папку **build**.
*   `gulp lint` - проверяет JS на соответствие [код-стайлу](http://google.github.io/styleguide/javascriptguide.xml) с помощью [ESLint](http://eslint.org/docs/rules/) ([by Google](https://github.com/google/eslint-config-google/blob/master/index.js) + немного своего в _.eslintrc.json_) в **src/js/app/\*\*/\*.js**.
*   `gulp build:js:app` - собирает с помощью _gulp-file-include_ \*.js файлы перечисленные в **src/js/app/application.js** в файлы **build/js/application.js**.
*   `gulp build:js:vendor` - собирает с помощью _gulp-file-include_ \*.js файлы перечисленные в **src/js/vendor/vendor.js** в файлы **build/js/vendor.js**.
*   `gulp build:js` - объединяет в себе все вышеперечисленные команды `gulp build:js:<something>`.
*   `gulp build:styles` - собирает с помощью _SASS_ \*.scss(\*.css) файлы перечисленные в **src/scss/application.scss** в файл **build/css/application.css**.
*   `gulp build:img` - копирует с обработкой через [_imagemin_](https://www.npmjs.com/package/gulp-imagemin) содержимое папки статичных рисунков/иконок из **src/img** в **build/img**.
*   `gulp build:pic` - копирует содержимое папки временных рисунков-заглушек из **src/pic** в **build/pic**.
*   `gulp build:fonts` - копирует содержимое папки **src/fonts** в **build/fonts**.
*   `gulp build` - объединяет в себе все вышеперечисленные команды `gulp build:<something>`.
*   `gulp clean:build` - удаляет содержимое папки **build**.
*   `gulp clean:cache` - удаляет cache команды `build:img` (необходимо выполнять, если заменяете какой-либо из рисунков в **build/img**, т.е. имя файла осталось прежним, но содержимое файла изменилось).
*   `gulp clean` - объединяет в себе все вышеперечисленные команды `gulp clean:<something>`.
*   `gulp watch` - следит за изменениями в исходных файлах папок **src** и проводит сборку изменённых частей проекта (исключая папку **src/vendor**, для них есть `gulp build:vendor`).
*   `gulp serve` - запускает стрим веб-сервер [_browserSync_](https://www.browsersync.io/) по адресу [http://&lt;IP вашего компьютера или 127.0.0.1 или localhost&gt;:9000/](http://127.0.0.1:9000/) используя папку **build**.
*   `gulp` - выполняет `gulp build`, `gulp serve`, `gulp watch`. (основная команда)

Список команд _bower_ (необходимо запускать из папки **markup** проекта, и если _bower_ не установлен глобально в системе,- используйте `npm run bower -- <опции для bower>`):

*   `bower search <название js/css библиотеки>` - поиск нужного js/css плагина по имени.
*   `bower install <название js/css библиотеки> --save` - установка нужного js/css плагина.
