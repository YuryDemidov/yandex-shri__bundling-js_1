# Unused Files Webpack Plugin

Домашнее задание ШРИ Яндекса по теме "Сборка"

### Полезные команды для разработки и тестирования плагина:

В корне проекта:

```shell script
# Установка зависимостей
npm i

# Запуск сборки:
npm run build

# Запуск тестов: 
npm run test
```

### Команды для работы с примером использования плагина:

```shell script
# Переход в директорию с примером:
cd example

# Установка зависимостей:
npm i

# Запуск сборки для разработки:
npm run build:dev

# Запуск сборки для продакшна:
npm run build:prod
```

## Использование плагина

Установку плагина можно сэмулировать, импортировав его из `dist/index.js` (после сборки кода плагина)

### Для конфигов вебпака с синтаксисом ES модулей (`webpack.config.babel.js`)

```js
import { UnusedFilesWebpackPlugin } from 'unused-files-webpack-plugin'; // from 'dist/'

export default {
  // ...
  plugins: [
    new UnusedFilesWebpackPlugin(options),
  ]
  // ...
};
```

### Для конфигов вебпака с синтаксисом CommonJS модулей (`webpack.config.js`)

```js
const { UnusedFilesWebpackPlugin } = require('unused-files-webpack-plugin'); // require('dist/')

module.exports = {
  // ...
  plugins: [
    new UnusedFilesWebpackPlugin(options),
  ]
  // ...
};
```

### Параметры плагина

#### excludePaths

Массив строк - пути, которые не будут рассматриваться как файлы проекта. Файлы из них не будут выведены в отчёте

По умолчанию игнорируются `node_modules`, `dist`, `build`.

Пример:

```js
new UnusedFilesWebpackPlugin({
  excludePaths: [`log`]
})
```

#### excludePatterns

Массив регулярных выражений - паттерны для файлов, которые не будут рассматриваться как файлы проекта и не будут выведены в отчёте

По умолчанию игнорируются следующие паттерны: 
- `/^package(-lock)?.json$/`
- `/^yarn.*\..*/`
- `/^\..*/`
- `/^webpack.config/`

Пример:

```js
new UnusedFilesWebpackPlugin({
  excludePatterns: [/.*\.css$/] // Exclude all css files
})
```

#### failOnUnused

Булево значение, определяющее нужно ли выбрасывать ошибку при обнаружении неиспользуемых файлов.

По умолчанию `false` - будет выводиться warning.

Пример:

```js
new UnusedFilesWebpackPlugin({
  failOnUnused: true
})
```

### Пример использования плагина

В директории `/example` смоделирован пример использования плагина.

В конфиге вебпака плагин используется следующим образом:

```js
new UnusedFilesWebpackPlugin({
  excludePaths: [`log`],
  excludePatterns: [/.*excluded-by-pattern.*/],
  failOnUnused: true
})
```

В данном примере в сборке вебпака не используются следующие модули:

- `components/component3/index.js` (будет включён в отчёт о неиспользуемых модулях)
- `log/log.json` (не будет включён в отчёт из-за игнорирования пути `log` в параметре excludePaths)
- `unused-excluded-by-pattern.js` (не будет включён в отчёт из-за игнорирования паттерна `/.*excluded-by-pattern.*/` в параметре excludePatterns)
- `react` указан в `devDependencies`, но не используется (не будет включён в отчёт из-за того, что модули из `node_modules` игнорируются)

Из-за того, что параметр `failOnUnused` установлен как `true`, при сборке вебпак выведет ошибку о неиспользуемых модулях
