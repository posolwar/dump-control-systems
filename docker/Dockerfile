# Использование официального образа Node.js
FROM node:18

# Установка рабочей директории
WORKDIR /app

# Установка переменной окружения
ENV NODE_ENV=development

# Копирование package.json и package-lock.json
COPY package.json ./

# Установка зависимостей
RUN npm install

# Копирование исходного кода
COPY . .

# Сборка Vue-приложения
RUN npm run build

# Установка сервера для обслуживания собранного приложения
RUN npm install -g serve

# Команда по умолчанию для запуска приложения
CMD ["npm", "run", "dev"]