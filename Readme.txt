sudo docker-compose -p symfony -f docker-compose.yml up -d --build

docker exec -it {ID} /bin/bash

composer install

php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate
composer require encore
yarn add --dev @symfony/webpack-encore
yarn install
npm install
npm install @symfony/webpack-encore --save-dev
yarn encore dev
yarn add @babel/preset-react@^7.9.0 --dev
yarn add @babel/preset-react --dev
yarn add react-router-dom

yarn config set ignore-engines true

yarn add @babel/preset-react --dev
yarn add --dev react react-dom prop-types axios
yarn add @babel/plugin-proposal-class-properties @babel/plugin-transform-runtime
yarn add @babel/core
npm link webpack
npm i webpack webpack-cli @webpack-cli/generators -D
npm install --save-dev @babel/preset-env
yarn add webpack-notifier@^1.15.0 --dev
npm i core-js@latest


