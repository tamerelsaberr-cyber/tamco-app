# 🔐 لوحة تحكم Tamco Clean (Admin Dashboard)

تطبيق ويب متطور لإدارة وبوابة توثيق مدفوعات تطبيق **Tamco Clean**، مبني باستخدام بيئة **Next.js**.

## 🚀 التقنيات المستخدمة (Tech Stack)
* **Framework:** Next.js (App Router)
* **Styling:** Tailwind CSS / Inline Styles
* **Package Manager:** npm / pnpm
* **Deployment:** Vercel & GitHub

## 📂 الهيكل التنظيمي للمشروع (Project Structure)
تم تنظيم الملفات لتعمل بشكل صحيح ومتوافق مع سيرفر Next.js كالتالي:
`pi-app/` (المجلد الرئيسي للتشغيل والحزم)
└── `app/` (مجلد الصفحات النشطة)
    ├── `page.tsx` (الصفحة الرئيسية لبوابة توثيق تطبيق Pi)
    └── `admin/` (مجلد لوحة التحكم)
        └── `page.tsx` (كود صفحة الأدمن المحدثة)

## 💻 طريقة التشغيل المحلي والتطوير (Local Development)

1. تثبيت الحزم والمحركات الأساسية:
```bash
npm install
```

2. تشغيل السيرفر المحلي للمشاركة على الشبكة الداخلية (اللاب توب والهاتف):
```bash
npx next dev --hostname 0.0.0.0
```
* **رابط اللاب توب المحلي:** `http://localhost:3000/admin`

## 🌐 النشر والتشغيل السحابي (Production)
المشروع مضبوط للرفع والنشر التلقائي (CI/CD):
* يتم رفع التعديلات مباشرة إلى مستودع **GitHub**.
* تقوم منصة **Vercel** بتحديث الموقع تلقائياً فور النشر.