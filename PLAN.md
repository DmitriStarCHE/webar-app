# План разработки WebAR приложения (MVP)

## 1. Обзор проекта

### Цель
Создать WebAR приложение для отображения AR-контента (3D модели, аудио, текст) при наведении камеры смартфона на изображения-триггеры.

### Компоненты системы
1. **Административная панель** - загрузка и управление контентом
2. **AR Viewer** - клиентское приложение для просмотра AR
3. **Backend API** - обработка данных и хранение
4. **Облачное хранилище** - медиафайлы и 3D модели

---

## 2. Технологический стек

### Frontend (Admin Panel)
- **Framework**: React 18+ с TypeScript
- **UI Library**: shadcn/ui + Tailwind CSS (современный, бесплатный)
- **State Management**: Zustand (легковесный) или React Query
- **Form Validation**: React Hook Form + Zod
- **File Upload**: React Dropzone

### Frontend (AR Viewer)
- **AR Engine**:
  - **MindAR** (https://github.com/hiukim/mind-ar-js) - бесплатный, хорошо поддерживается
  - Альтернатива: **AR.js** (более старый, но стабильный)
- **3D Rendering**: Three.js + @react-three/fiber
- **Model Loading**: GLTFLoader, FBXLoader
- **Audio**: Web Audio API / Howler.js
- **Bundler**: Vite (быстрая сборка)

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Fastify (быстрее Express) или Express
- **Language**: TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **File Upload**: Multer / Busboy
- **Authentication**: JWT + bcrypt
- **Validation**: Zod

### Облачное хранилище (рекомендации)
**Лучший вариант для долговечности и цены:**
1. **Cloudflare R2** - $0.015/GB (дешевле S3, без платы за выгрузку данных)
2. **AWS S3** - стандарт индустрии, $0.023/GB
3. **Backblaze B2** - $0.005/GB (самый дешевый)
4. **Google Cloud Storage** - $0.020/GB

**Рекомендация**: **Cloudflare R2** - оптимальный баланс цены, скорости и надежности.

### DevOps
- **Hosting Backend**: Railway / Render (бесплатный tier) или VPS (DigitalOcean)
- **Hosting Frontend**: Vercel / Netlify (бесплатный tier)
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry (бесплатный tier)

---

## 3. Архитектура системы

```
┌─────────────────┐         ┌─────────────────┐
│  Admin Panel    │────────▶│   Backend API   │
│   (React SPA)   │  HTTPS  │   (Node.js)     │
└─────────────────┘         └────────┬────────┘
                                     │
                            ┌────────┴────────┐
                            │                 │
                      ┌─────▼─────┐    ┌─────▼──────┐
                      │ PostgreSQL │    │ Cloudflare │
                      │  Database  │    │     R2     │
                      └────────────┘    └─────┬──────┘
                                              │
┌─────────────────┐                           │
│   AR Viewer     │───────────────────────────┘
│  (Three.js +    │        Load Assets
│    MindAR)      │
└─────────────────┘
```

---

## 4. Структура базы данных

### Таблицы (PostgreSQL)

#### users
- id (UUID, PK)
- email (String, unique)
- password_hash (String)
- role (enum: admin, user)
- created_at (DateTime)

#### projects
- id (UUID, PK)
- user_id (UUID, FK)
- name (String)
- description (Text)
- created_at (DateTime)
- updated_at (DateTime)

#### ar_scenes
- id (UUID, PK)
- project_id (UUID, FK)
- name (String)
- trigger_image_url (String) - URL триггера
- trigger_image_key (String) - ключ в R2
- is_active (Boolean)
- created_at (DateTime)

#### ar_content
- id (UUID, PK)
- scene_id (UUID, FK)
- content_type (enum: model_3d, audio, text, image)
- file_url (String) - URL файла
- file_key (String) - ключ в R2
- position_x, position_y, position_z (Float)
- rotation_x, rotation_y, rotation_z (Float)
- scale (Float)
- text_content (Text, nullable)
- config (JSONB) - доп. настройки
- created_at (DateTime)

---

## 5. API Endpoints (REST)

### Authentication
- POST `/api/auth/register` - регистрация
- POST `/api/auth/login` - вход
- POST `/api/auth/refresh` - обновление токена

### Projects
- GET `/api/projects` - список проектов
- POST `/api/projects` - создать проект
- GET `/api/projects/:id` - детали проекта
- PUT `/api/projects/:id` - обновить проект
- DELETE `/api/projects/:id` - удалить проект

### AR Scenes
- GET `/api/projects/:projectId/scenes` - сцены проекта
- POST `/api/projects/:projectId/scenes` - создать сцену
- GET `/api/scenes/:id` - детали сцены
- PUT `/api/scenes/:id` - обновить сцену
- DELETE `/api/scenes/:id` - удалить сцену
- POST `/api/scenes/:id/trigger` - загрузить триггер-изображение

### AR Content
- GET `/api/scenes/:sceneId/content` - контент сцены
- POST `/api/scenes/:sceneId/content` - добавить контент
- PUT `/api/content/:id` - обновить контент
- DELETE `/api/content/:id` - удалить контент
- POST `/api/content/:id/upload` - загрузить файл (3D/аудио)

### Public API (для AR Viewer)
- GET `/api/public/scenes/:id` - публичные данные сцены
- GET `/api/public/viewer/:sceneId` - данные для AR просмотра

---

## 6. Этапы разработки MVP

### Фаза 1: Настройка проекта (1-2 дня)
- [ ] Создать monorepo структуру (pnpm workspaces)
  ```
  /
  ├── apps/
  │   ├── admin/          # React админка
  │   ├── viewer/         # AR viewer
  │   └── api/            # Backend
  ├── packages/
  │   ├── database/       # Prisma схема
  │   ├── types/          # Общие типы
  │   └── ui/             # Общие компоненты
  └── package.json
  ```
- [ ] Настроить TypeScript конфигурацию
- [ ] Настроить ESLint + Prettier
- [ ] Инициализировать Git репозиторий
- [ ] Создать .env.example файлы

### Фаза 2: Backend разработка (3-5 дней)
- [ ] Настроить Fastify/Express сервер
- [ ] Настроить Prisma + PostgreSQL
- [ ] Создать миграции БД
- [ ] Реализовать JWT аутентификацию
- [ ] Настроить Cloudflare R2 SDK
- [ ] Реализовать загрузку файлов (multer)
- [ ] Создать CRUD API для проектов
- [ ] Создать CRUD API для AR сцен
- [ ] Создать CRUD API для AR контента
- [ ] Реализовать Public API для viewer
- [ ] Добавить валидацию (Zod)
- [ ] Обработка ошибок и логирование

### Фаза 3: Admin Panel (4-6 дней)
- [ ] Создать React + Vite проект
- [ ] Настроить Tailwind CSS + shadcn/ui
- [ ] Реализовать страницу Login/Register
- [ ] Создать защищенные роуты (Private Routes)
- [ ] Страница списка проектов
- [ ] Страница создания/редактирования проекта
- [ ] Страница управления AR сценами
- [ ] Компонент загрузки триггер-изображения
- [ ] Компонент загрузки 3D моделей (drag-n-drop)
- [ ] Компонент загрузки аудио файлов
- [ ] Форма добавления текстового контента
- [ ] Настройка позиции/поворота/масштаба для объектов
- [ ] Превью 3D модели (Three.js)
- [ ] Генератор ссылок для AR viewer
- [ ] QR код генератор для ссылок

### Фаза 4: AR Viewer (5-7 дней)
- [ ] Создать Vite + Three.js проект
- [ ] Интегрировать MindAR.js
- [ ] Настроить WebRTC доступ к камере
- [ ] Реализовать загрузку данных сцены по ID
- [ ] Компилировать триггер-изображения (MindAR Compiler)
- [ ] Инициализация AR сессии
- [ ] Детекция и трекинг триггеров
- [ ] Загрузка и рендеринг 3D моделей (GLTF)
- [ ] Позиционирование контента относительно триггера
- [ ] Воспроизведение аудио при детекции
- [ ] Отображение текстового контента (CSS3D или Sprite)
- [ ] UI элементы (loading, errors, instructions)
- [ ] Оптимизация для мобильных устройств
- [ ] Адаптивность (portrait/landscape)

### Фаза 5: Интеграция и тестирование (2-3 дня)
- [ ] End-to-end тестирование потока:
  - Загрузка контента в админке
  - Генерация ссылки
  - Открытие в AR viewer
  - Детекция триггера
  - Отображение контента
- [ ] Тестирование на разных устройствах (iOS, Android)
- [ ] Тестирование разных браузеров (Chrome, Safari)
- [ ] Оптимизация загрузки ассетов
- [ ] Обработка edge cases (потеря трекинга, медленный интернет)

### Фаза 6: Деплой и документация (1-2 дня)
- [ ] Создать Docker образы (опционально)
- [ ] Деплой Backend на Railway/Render
- [ ] Деплой Admin на Vercel
- [ ] Деплой Viewer на Vercel
- [ ] Настроить Cloudflare R2 bucket
- [ ] Настроить CORS и security headers
- [ ] Написать README.md
- [ ] Создать пользовательскую документацию
- [ ] Настроить мониторинг (Sentry)

---

## 7. MVP функциональность

### Админка (минимум)
✅ Авторизация (email/password)
✅ Создание проекта
✅ Загрузка 1 триггер-изображения на сцену
✅ Загрузка 1 3D модели (GLB/GLTF)
✅ Настройка позиции/масштаба модели
✅ Генерация публичной ссылки
✅ Простой список проектов

### AR Viewer (минимум)
✅ Доступ к камере
✅ Детекция триггера
✅ Отображение 3D модели
✅ Базовая UI (инструкции, загрузка)

### Что НЕ входит в MVP
❌ Мультипользовательский доступ (роли)
❌ Множественные триггеры в одной сцене
❌ Анимации моделей
❌ Интерактивность (клики по объектам)
❌ Аналитика просмотров
❌ Версионирование контента

---

## 8. Библиотеки и инструменты

### Обязательные
```json
{
  "dependencies": {
    // Admin
    "react": "^18.3.0",
    "react-router-dom": "^6.22.0",
    "zustand": "^4.5.0",
    "@tanstack/react-query": "^5.28.0",
    "react-hook-form": "^7.51.0",
    "zod": "^3.22.4",
    "react-dropzone": "^14.2.3",

    // AR Viewer
    "three": "^0.162.0",
    "@react-three/fiber": "^8.15.0",
    "@react-three/drei": "^9.99.0",
    "mindar-image-three": "^1.6.1",

    // Backend
    "fastify": "^4.26.0",
    "@fastify/jwt": "^8.0.0",
    "@fastify/multipart": "^8.1.0",
    "@prisma/client": "^5.11.0",
    "@aws-sdk/client-s3": "^3.540.0",
    "bcrypt": "^5.1.1",

    // Общие
    "typescript": "^5.4.0"
  }
}
```

### Дополнительные (улучшения)
- **react-qr-code** - генерация QR кодов
- **sharp** - обработка изображений
- **pino** - логирование
- **helmet** - безопасность
- **@sentry/react** - мониторинг ошибок
- **clsx** + **tailwind-merge** - условные классы
- **date-fns** - работа с датами

---

## 9. Рекомендации по хостингу

### Бесплатный вариант (для старта)
- **Backend**: Railway (500 часов/месяц бесплатно) или Render
- **Frontend**: Vercel (unlimited deployments)
- **Database**: Railway PostgreSQL или Supabase (500MB бесплатно)
- **Storage**: Cloudflare R2 (10GB бесплатно)

### Платный вариант (для продакшена)
- **Backend**: DigitalOcean Droplet ($6/месяц) или AWS EC2
- **Database**: Managed PostgreSQL (от $15/месяц)
- **Storage**: Cloudflare R2 (~$1-5/месяц для 100GB)
- **CDN**: Cloudflare (бесплатный tier)

**Долговечность**: Cloudflare R2 имеет 99.999999999% durability (11 девяток), как AWS S3.

---

## 10. Безопасность

### Обязательные меры для MVP
- [ ] HTTPS для всех соединений
- [ ] JWT токены с коротким expiration (15 мин access, 7 дней refresh)
- [ ] Валидация файлов (тип, размер, content-type)
- [ ] Rate limiting на API (для защиты от DDoS)
- [ ] CORS настройка (whitelist доменов)
- [ ] Sanitization пользовательского ввода
- [ ] Хеширование паролей (bcrypt, cost 12)

### Ограничения загрузки
- Триггер-изображения: до 5MB, JPG/PNG
- 3D модели: до 50MB, GLB/GLTF
- Аудио: до 10MB, MP3/WAV
- Общее хранилище на пользователя: 500MB (MVP)

---

## 11. Производительность

### Оптимизации для AR Viewer
- [ ] Lazy loading 3D моделей
- [ ] Сжатие текстур (Draco compression для GLTF)
- [ ] Progressive loading для больших моделей
- [ ] Caching ассетов (Service Worker)
- [ ] Оптимизация размера триггеров (рекомендация 480x640px)
- [ ] Throttling рендера (60 FPS cap)

### Метрики
- Время загрузки AR viewer: < 3 сек
- Время инициализации камеры: < 2 сек
- FPS на средних устройствах: > 30 FPS
- Размер bundle viewer: < 2MB (gzipped)

---

## 12. План тестирования

### Устройства для тестирования
- iPhone 12+ (Safari)
- Android Samsung Galaxy S21+ (Chrome)
- iPad (Safari)

### Критические сценарии
1. Загрузка и детекция триггера
2. Рендеринг 3D модели при разных освещениях
3. Стабильность трекинга при движении камеры
4. Работа на медленном интернете (3G)
5. Работа в портретной и ландшафтной ориентации

---

## 13. Roadmap после MVP

### Версия 1.1
- Множественные объекты на одном триггере
- Простые анимации моделей
- Базовая аналитика (количество просмотров)

### Версия 1.2
- Интерактивность (клики по объектам)
- Видео контент поверх триггера
- Шаринг в социальные сети

### Версия 2.0
- Markerless AR (plane detection)
- WebXR для VR очков
- Collaboration (мультипользовательский AR)

---

## 14. Ресурсы и документация

### MindAR
- Docs: https://hiukim.github.io/mind-ar-js-doc/
- GitHub: https://github.com/hiukim/mind-ar-js
- Examples: https://hiukim.github.io/mind-ar-js-doc/examples/summary

### Three.js
- Docs: https://threejs.org/docs/
- Examples: https://threejs.org/examples/

### Cloudflare R2
- Docs: https://developers.cloudflare.com/r2/
- S3 API compatibility: https://developers.cloudflare.com/r2/api/s3/

---

## 15. Временные оценки

**Общее время разработки MVP: 16-25 дней**

- Настройка проекта: 1-2 дня
- Backend: 3-5 дней
- Admin Panel: 4-6 дней
- AR Viewer: 5-7 дней
- Интеграция и тестирование: 2-3 дня
- Деплой: 1-2 дня

**Для команды из 2 разработчиков**: 2-3 недели
**Для 1 разработчика**: 3-4 недели

---

## 16. Следующие шаги

1. ✅ Создать репозиторий на GitHub
2. ✅ Настроить monorepo структуру
3. ✅ Инициализировать проекты (admin, viewer, api)
4. ✅ Настроить базу данных (PostgreSQL + Prisma)
5. ✅ Создать первый AR прототип (viewer)
6. ✅ Разработать базовую админку
7. ✅ Интегрировать Cloudflare R2
8. ✅ Деплой и тестирование

---

**Создан**: 2025-12-05
**Версия**: 1.0
**Статус**: Ready for development
