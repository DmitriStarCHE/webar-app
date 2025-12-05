# WebAR Application

Приложение для создания и просмотра AR-контента с использованием изображений-триггеров.

## Описание

WebAR приложение состоит из двух основных компонентов:

1. **Admin Panel** - административная панель для загрузки и управления AR-контентом (изображения, 3D модели, аудио, текст)
2. **AR Viewer** - клиентское приложение для просмотра AR-контента при наведении камеры смартфона на изображения-триггеры

## Технологии

- **Frontend**: React 18 + TypeScript + Vite
- **AR Engine**: MindAR + Three.js
- **Backend**: Node.js + Fastify + TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Storage**: Cloudflare R2
- **UI**: Tailwind CSS + shadcn/ui

## Структура проекта

```
/
├── apps/
│   ├── admin/          # Административная панель (React)
│   ├── viewer/         # AR viewer (Three.js + MindAR)
│   └── api/            # Backend API (Fastify)
├── packages/
│   ├── database/       # Prisma схема и миграции
│   ├── types/          # Общие TypeScript типы
│   └── ui/             # Общие UI компоненты
├── PLAN.md             # Детальный план разработки
└── package.json        # Root package.json (monorepo)
```

## Требования

- Node.js 20+
- pnpm 8+
- PostgreSQL 15+
- Cloudflare R2 аккаунт (или AWS S3)

## Установка

```bash
# Установка зависимостей
pnpm install

# Настройка переменных окружения
cp .env.example .env

# Создание базы данных
pnpm db:migrate

# Запуск в режиме разработки
pnpm dev
```

## Разработка

```bash
# Запуск админки
pnpm --filter admin dev

# Запуск AR viewer
pnpm --filter viewer dev

# Запуск backend API
pnpm --filter api dev

# Запуск всех сервисов
pnpm dev
```

## Деплой

См. раздел "Деплой и документация" в [PLAN.md](./PLAN.md)

## Документация

Детальный план разработки и технические спецификации доступны в файле [PLAN.md](./PLAN.md)

## MVP Функциональность

### Админка
- ✅ Авторизация (email/password)
- ✅ Создание проектов
- ✅ Загрузка триггер-изображений
- ✅ Загрузка 3D моделей (GLB/GLTF)
- ✅ Настройка позиции/масштаба объектов
- ✅ Генерация публичных ссылок для AR viewer

### AR Viewer
- ✅ Доступ к камере устройства
- ✅ Детекция изображений-триггеров
- ✅ Отображение 3D моделей в AR
- ✅ Адаптивный UI с инструкциями

## Лицензия

MIT

## Контакты

Для вопросов и предложений создавайте Issue в репозитории.
