# Backend для приложения Movie-App

В этом проекте реализован REST API для работы с фильмами, актерами и героями фильмов. Проект написан на express.js. [Frontend](https://github.com/khanov26/movie-app-frontend) написан на React.

В качестве базы данных и хранилища используются Firebase Cloud Firestore и Firebase Cloud Storage.

Авторизация реализована через JWT.

## Демо

Демо версия приложения доступна по [ссылке](https://movie-app-frontend-sigma.vercel.app/).

В системе доступны 3 пользователя:
1. email: `user1@user.com` пароль: `user1` роль: `менеджер`
2. email: `user2@user.com` пароль: `user2` роль: `пользователь`
3. email: `user3@user.com` пароль: `user3` роль: `пользователь`


## Запуск
Чтобы локально запустить сервер, в корне проекта выполните:
1. Создайте файл `.env` со следующим содержимым:

   `FIREBASE_PROJECT_ID="***ваш id проекта в firebase***"`
   
   `JWT_SECRET="***ваш jwt секрет***"`
   
   `JWT_EXPIRES_IN="1h"`
2. `npm install` - команда установит все зависимости
3. `npm run build` - запустится компиляция файлов
4. `npm start` - запуститься сервер по адресу [http://localhost:5000](http://localhost:5000). Порт можно изменить, установив переменную окрежения PORT
