FROM node:18-alpine

WORKDIR /app

# نسخ package files
COPY package*.json ./

# تثبيت dependencies
RUN npm install

# نسخ بقية الملفات
COPY . .

# فتح البورت
EXPOSE 5000

# تشغيل السيرفر
CMD ["npm", "start"]
