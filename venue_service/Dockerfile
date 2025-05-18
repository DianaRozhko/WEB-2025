# Базовий образ Node.js
FROM node:22

# Встановлюємо робочу директорію
WORKDIR /app

# Копіюємо файли package.json та package-lock.json
COPY package*.json ./

# Встановлюємо залежності
RUN npm install
RUN npm install -g @nestjs/cli

# Копіюємо весь вихідний код у контейнер
COPY . .

# Компілюємо TypeScript у JavaScript
RUN npm run build

# Виставляємо порт 
EXPOSE 3003

# Запускаємо застосунок
CMD ["npm", "run", "start:prod"]
