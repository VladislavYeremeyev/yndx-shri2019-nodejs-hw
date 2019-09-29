# Домашнее задание ШРИ 2019 Адаптивная верстка

## Описание

> *Node version*: v12.7.0+

В данном репозитории представлена домашняя работа по лекции "Адаптивная верстка" ШРИ 2019 - верстка адаптивных страниц веб-сервиса совместной разработки IT-проектов **Яндекс Arcanum**.

## Запуск

```bash
# Установка зависимостей
npm install

# Запуск сервера разработки с HMR (по умолчанию http://localhost:1234)
npm start

# Сборка проекта в prod-режиме в директорию build/
npm run build
```

## Что сделано

- Сделаны **все** необходимые экраны
- Breakpoint на 640px
- Код клиентской части нужно было положить в тот же репозиторий, что и домашнее задание по [Node.js](https://github.com/VladislavYeremeyev/yndx-shri2019-nodejs-hw). Поэтому исходный код клиентской части находится в корневой папке `client` репозитория.
- Попытался добиться PixelPerfect, насколько это возможно. В макетах с дизайном встречаются неконсистентные по свойствам элементы, а также используется `YS Text`, которого не было в свободном доступе.
- Использовал *рекомендованную* [Nested](https://ru.bem.info/methodology/filestructure/#nested)-архитектуру файловой структуры блоков. Возможно, проверяющим она покажется излишней и неудобной, но такой подход позволяет точечно и быстро вносить изменения и масштабировать проект, а также переиспользовать отдельные части, что позволит быстро смапить файлы в React-компоненты. Аналогично этому был выбран стиль именования классов [React](https://ru.bem.info/methodology/naming-convention/#%D1%81%D1%82%D0%B8%D0%BB%D1%8C-react).
- Для сборки использовал [Parcel](https://parceljs.org/), так как отсутствует необходимость в конфигурации и есть много полезных функций "из коробки".
- Для оптимизации использования большого количества иконок использовал [parcel-plugin-svg-sprite](https://www.npmjs.com/package/parcel-plugin-svg-sprite). Он позволяет собрать используемые иконки в один спрайт. Плагин оказался довольно багованным, временами не прогружал иконки, делая тег svg безразмерным, пришлось костылить некоторые места, где требовались иконки.
- Использовал [Pug](https://pugjs.org/api/getting-started.html). Этот инструмент позволил быстрее генерировать разметку, а также разделять части веб-страницы на отедльные модули, которые в будущем могут быть переделаны в отдельные React-компоненты.
- Для контроля качества кода и форматирования использовал `ESLint` + `Prettier` + `Stylelint`. Были использованы плагины, позволяющие автоматически форматировать `css`, разделяя свойства по смыслу.

Команда для запуска линтинга и авто-фикса `css` файлов в директории `src`:

```bash
npm run lint-css
```

- Добавлена `js`-логика на интерактивные элементы, а также применены стили наведения мыши, неописанные в макетах дизайна. Дизайн таких элементов взят из других продуктов [Яндекса](https://yandex.ru).
- При запуске dev-сервера можно открыть страницу со списком ссылок на сверстанные страницы.
- Prod-собранные файлы собираются в папку `/build`, а Dev-собранные файлы в папку `/dist`.

>**Важно:** По макету в двух экранах с просмотром содержимого файла и патча коммита при длинных строках можно выбрать один из способов реализации - добавление горизонтального скролла или перенос слов на новые строки. По умолчанию в реализации стоит горизонтальный скролл, но можно добавить перенос слов, при добавлении на блок `СodeBlock` модификатора `CodeBlock_line-wrap_wrap`.

## Домашнее задание по лекции Архитектура

http://localhost:1234/directory_page_with_filter.html
