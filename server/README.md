# Sandy Macrame Backend API

Backend API للموقع الإلكتروني الخاص بساندي مكرمية - لعرض أعمال المكرمية والبراويز.

## المتطلبات

- Node.js (v16 أو أحدث)
- MySQL (v8 أو أحدث)
- npm أو yarn

## التثبيت

1. **استنساخ المشروع:**
```bash
git clone <repository-url>
cd sandy-macrame-server
```

2. **تثبيت المتطلبات:**
```bash
npm install
```

3. **إعداد متغيرات البيئة:**
```bash
cp .env.example .env
```
قم بتعديل `.env` وإضافة البيانات المطلوبة.

4. **إنشاء قاعدة البيانات:**
```sql
CREATE DATABASE sandy_macrame CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

5. **تشغيل المهاجرات (Migrations):**
```bash
npm run migrate
```

6. **إضافة البيانات الأولية (Seeds):**
```bash
npm run seed
```

## تشغيل المشروع

**وضع التطوير:**
```bash
npm run dev
```

**وضع الإنتاج:**
```bash
npm start
```

## الهيكل التنظيمي

```
src/
├── db/                     # إعدادات قاعدة البيانات
│   ├── knex.js            # اتصال Knex
│   ├── migrations/        # ملفات المهاجرات
│   └── seeds/            # ملفات البيانات الأولية
├── middlewares/          # البرمجيات الوسطية
│   ├── authGuard.js      # حماية المصادقة
│   ├── errorHandler.js   # معالجة الأخطاء
│   ├── rateLimiter.js    # تحديد المعدل
│   └── validate.js       # التحقق من البيانات
├── modules/              # وحدات التطبيق
│   ├── auth/            # المصادقة
│   ├── albums/          # الألبومات
│   ├── media/           # الوسائط
│   ├── inquiries/       # الاستعلامات
│   ├── reviews/         # المراجعات
│   └── settings/        # الإعدادات
├── utils/               # الأدوات المساعدة
│   ├── upload.js        # رفع الملفات
│   ├── whatsapp.js      # واتساب
│   └── logger.js        # السجلات
├── app.js              # إعداد التطبيق
└── server.js           # خادم التطبيق
```

## API Endpoints

### المصادقة (Auth)
- `POST /api/auth/login` - تسجيل الدخول للإدارة
- `GET /api/auth/profile` - الملف الشخصي
- `POST /api/auth/change-password` - تغيير كلمة المرور
- `POST /api/auth/create-admin` - إنشاء حساب إدارة جديد

### الألبومات (Albums)
**العامة:**
- `GET /api/albums` - جلب الألبومات العامة
- `GET /api/albums/featured` - الألبومات المميزة
- `GET /api/albums/slug/:slug` - ألبوم حسب الرابط

**الإدارة:**
- `GET /api/albums/admin` - جلب جميع الألبومات
- `GET /api/albums/admin/stats` - إحصائيات الألبومات
- `POST /api/albums/admin` - إنشاء ألبوم جديد
- `PUT /api/albums/admin/:id` - تحديث ألبوم
- `DELETE /api/albums/admin/:id` - حذف ألبوم

### الوسائط (Media)
- `POST /api/media/album/:albumId` - رفع صور للألبوم
- `GET /api/media/album/:albumId` - جلب صور الألبوم
- `PUT /api/media/:id` - تحديث صورة
- `DELETE /api/media/:id` - حذف صورة
- `POST /api/media/album/:albumId/reorder` - إعادة ترتيب الصور

### الاستعلامات (Inquiries)
**العامة:**
- `POST /api/inquiries` - إرسال استعلام جديد

**الإدارة:**
- `GET /api/inquiries/admin` - جلب الاستعلامات
- `GET /api/inquiries/admin/stats` - إحصائيات الاستعلامات
- `PUT /api/inquiries/admin/:id/status` - تحديث حالة الاستعلام
- `GET /api/inquiries/admin/:id/whatsapp` - رابط واتساب للاستعلام

### المراجعات (Reviews)
**العامة:**
- `GET /api/reviews` - جلب المراجعات المنشورة
- `GET /api/reviews/featured` - المراجعات المميزة
- `POST /api/reviews` - إرسال مراجعة جديدة

**الإدارة:**
- `GET /api/reviews/admin` - جلب جميع المراجعات
- `GET /api/reviews/admin/stats` - إحصائيات المراجعات
- `PUT /api/reviews/admin/:id/status` - تغيير حالة المراجعة

### الإعدادات (Settings)
**العامة:**
- `GET /api/settings/public` - الإعدادات العامة

**الإدارة:**
- `GET /api/settings/admin` - جميع الإعدادات
- `PUT /api/settings/admin/whatsapp/owner` - تحديث رقم واتساب
- `PUT /api/settings/admin/social/links` - تحديث روابط السوشال
- `PUT /api/settings/admin/site/meta` - تحديث معلومات الموقع
- `PUT /api/settings/admin/home/slider` - تحديث سلايدر الرئيسية

## متغيرات البيئة

```env
# إعدادات الخادم
PORT=4000
NODE_ENV=development

# إعدادات قاعدة البيانات
DATABASE_URL=mysql://username:password@localhost:3306/sandy_macrame
DB_HOST=localhost
DB_PORT=3306
DB_USER=username
DB_PASSWORD=password
DB_NAME=sandy_macrame

# إعدادات JWT
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d

# إعدادات CORS
CORS_ORIGIN=http://localhost:5173

# إعدادات واتساب
WHATSAPP_OWNER=970599123456

# إعدادات رفع الملفات
UPLOAD_STORAGE=local
MAX_FILE_SIZE=10485760

# إعدادات Cloudinary (اختياري)
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
```

## الأمان

- مصادقة JWT للوصول للإدارة
- تشفير كلمات المرور باستخدام bcrypt
- معدل محدود للطلبات
- التحقق من البيانات المدخلة
- حماية من XSS و CORS

## البيانات الافتراضية

**حساب الإدارة الافتراضي:**
- البريد الإلكتروني: `admin@sandy.com`
- كلمة المرور: `Sandy@123456`

**يرجى تغيير كلمة المرور فور تسجيل الدخول!**

## أوامر npm

- `npm run dev` - تشغيل وضع التطوير
- `npm start` - تشغيل الخادم
- `npm run migrate` - تشغيل المهاجرات
- `npm run seed` - إضافة البيانات الأولية
- `npm run rollback` - التراجع عن آخر مهاجرة
- `npm run make:migration <name>` - إنشاء مهاجرة جديدة
- `npm run make:seed <name>` - إنشاء ملف بيانات أولية

## المساهمة

1. Fork المشروع
2. إنشاء فرع للميزة الجديدة
3. Commit التغييرات
4. Push للفرع
5. إنشاء Pull Request

## الرخصة

MIT License