# Домашнее задание ШРИ 2019 Node.js

## Описание

API сервера позволяет получать информацию и работать с git репозиториями в указанной при запуске папке.

## Запуск

```bash
npm start <directory_absolute_path>
```

или

```bash
node app.js <directory_absolute_path>
```

При невалидном пути выдаст ошибку.

## API

### GET /api/repos

Возвращает массив репозиториев, которые имеются в папке.

### GET /api/repos/:repositoryId/commits/:commitHash

Возвращает массив коммитов в данной ветке (или хэше коммита) вместе с датами их создания и названием.

> **Бонус:** добавлена пагинация. По умолчанию `/api/repos/:repositoryId/commits/:commitHash` без query-параметров отдает массив всех коммитов. При добавлении одного из query-параметров или сразу обоих (`display`, `page`), список коммитов отображается, основываясь на переданных параметрах. Если передан хотя бы один параметр, то по умолчанию незаданные значения будут равны `display = 10` и `page = 1`.

Примеры:

- `/api/repos/cool-timer/commits/cool-branch` -> выведет массив всех коммитов
- `/api/repos/cool-timer/commits/cool-branch?page=1` -> выведет первую страницу коммитов (первые 10 элементов исходного массива, так как по умолчанию `display = 10`)
- `/api/repos/cool-timer/commits/cool-branch?page=3` -> выведет третью страницу коммитов (с 21 по 30 коммит)
- `/api/repos/cool-timer/commits/cool-branch?display=50` -> выведет 50 первых коммитов в исходном массиве
- `/api/repos/cool-timer/commits/cool-branch?display=50&page=2` -> выведет с 51 по 100 коммит

При неверном параметре `page` или `display` и возвращен 404 с ответом `{"message":"wrong query parameter"}`.

### GET /api/repos/:repositoryId/commits/:commitHash/diff

Возвращает diff коммита в виде строки.

### GET /api/repos/:repositoryId(/tree/:commitHash/:path)

Возвращает содержимое репозитория по названию ветки (или хэшу комита). Параметр repositoryId - название репозитория (оно же - имя папки репозитория). То, что в скобках - опционально, если отсутствует и branchName, и path - отдать актуальное содержимое в корне в главной ветке репозитория.
Примеры:

- `/api/repos/cool-timer`
- `/api/repos/cool-timer/tree/cool-branch/src/components`
- `/api/repos/cool-timer/tree/master/src/components`
- `/api/repos/cool-timer/tree/e1r2r32b321bdad2e1knbh231/src/components`

### GET /api/repos/:repositoryId/blob/:commitHash/:pathToFile

Возвращает содержимое конкретного файла, находящегося по пути pathToFile в ветке (или по хэшу коммита) branchName. С используемой памятью должно быть все в порядке.
Примеры:

- `/api/repos/cool-timer/blob/cool-branch/src/components/Header/index.tsx`

UPD: Сделал изменение, которое сразу отдает чанк из Stream'а и не хранит его в переменной, что улучшает производительность по памяти. Также отображает картинки, используя `mime-types`.

### DELETE /api/repos/:repositoryId

Безвозвратно удаляет репозиторий

### POST /api/repos + { url: ‘repo-url’ }

Добавляет репозиторий в список, скачивает его по переданной в теле запроса ссылке и добавляет в папку со всеми репозиториями.

> **Важно:** В теле запроса необходимо передать URL удаленного репозитория, а также прописать заголовок `Content-Type: application/json`.

## Тесты

### Запуск тестов

```bash
npm install # устанавливаем зависимости
npm run test
```

### Описание тестов

Логические блоки системы и сценарии:

- [RepoHandler](https://github.com/VladislavYeremeyev/yndx-shri2019-nodejs-hw/blob/master/src/RepoHandler/RepoHandler.js)
  - Блок с методами, вызывающими git-команды
- [Server](https://github.com/VladislavYeremeyev/yndx-shri2019-nodejs-hw/blob/master/src/Server/Server.js)
  - Блок с описанием роутингов и диспетчеризаций запросов и ответов

Если абстрагироваться ещё на уровень ниже, то можно выделить такие элементы системы:

- класс RepoHandler, используемый в конструкторе сервера и принимающий входным параметром путь до папки с репозиториями
- Список репозиториев в указанной папке
- Список коммитов по указанному хэшу или названию ветки
- Diff коммита
- Список файлов в указанной ветке и по указанному пути
- Содержимое файла

В них можно провести тестирование возвращаемого значения, вариаций ответов при изменении динамических параметров эндпоинтов (например, при указании не существующего репозитория или ветки), код ответа сервера, обработку ошибок при запуске сервера.

Исходный код тестов находится в директории `test`. Внутри этой директории лежит также архив `testFolder` - mock папки с репозиториями, в котором лежат простые репозитории с текстовыми файлами, необходимыми для тестов. При запуске тестов архив распаковывается, а по завершении прогонки тестов распакованная папка удаляется. Чтобы не дублировать проверки при тестировании по отдельности возвращаемых git-командами данных и ответов сервера на запросы, я сразу тестирую запросы к API, запуская тестовый инстанс сервера, соединение с которым прерывается после прогонки тестов.

### Что использовано

- [Mocha](https://github.com/mochajs/mocha)
- [Chai](https://github.com/chaijs/chai)
- [Supertest](https://github.com/visionmedia/supertest#readme)
- [uuid](https://github.com/kelektiv/node-uuid)
- [AdmZip](https://github.com/cthackers/adm-zip)
- [rimraf](https://github.com/isaacs/rimraf)

## Миграция на TypeScript

Перевёл JS файлы на TypeScript.
Запуск почти аналогичен приведенному выше:
