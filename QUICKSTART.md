# Быстрый старт WebAR приложения

## Шаг 1: Требования

Убедитесь, что установлены:
- **Node.js** 20.x или выше
- **pnpm** 8.x или выше
- **PostgreSQL** 15.x или выше
- **Git**

Установка pnpm (если не установлен):
```bash
npm install -g pnpm
```

---

## Шаг 2: Клонирование и установка зависимостей

```bash
# Перейдите в директорию проекта
cd C:\WEBAR

# Установите все зависимости
pnpm install
```

---

## Шаг 3: Настройка переменных окружения

```bash
# Скопируйте пример файла окружения
cp .env.example .env

# Отредактируйте .env и заполните настройки:
# - DATABASE_URL (строка подключения к PostgreSQL)
# - JWT_SECRET (случайная строка для JWT)
# - R2_* (настройки Cloudflare R2)
```

### Пример DATABASE_URL:
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/webar_db?schema=public"
```

### Создание базы данных:
```bash
# Создайте базу данных PostgreSQL
createdb webar_db

# Или через psql:
psql -U postgres
CREATE DATABASE webar_db;
\q
```

---

## Шаг 4: Настройка базы данных

```bash
# Сгенерировать Prisma Client
pnpm db:generate

# Применить миграции
pnpm db:migrate
```

---

## Шаг 5: Настройка Cloudflare R2 (хранилище файлов)

### Вариант 1: Cloudflare R2 (рекомендуется)

1. Зарегистрируйтесь на [Cloudflare](https://dash.cloudflare.com/)
2. Перейдите в **R2 Object Storage**
3. Создайте новый bucket (например, `webar-assets`)
4. Создайте API токен в **R2 API Tokens**
5. Добавьте credentials в `.env`:

```env
R2_ACCOUNT_ID="your-account-id"
R2_ACCESS_KEY_ID="your-access-key"
R2_SECRET_ACCESS_KEY="your-secret-key"
R2_BUCKET_NAME="webar-assets"
R2_PUBLIC_URL="https://webar-assets.your-account.r2.dev"
```

### Вариант 2: Локальное хранилище (для разработки)

Для тестирования можно использовать локальное хранилище файлов. В этом случае просто оставьте R2 настройки пустыми в `.env`, и файлы будут сохраняться в `apps/api/uploads/`.

---

## Шаг 6: Запуск приложения

### Запуск всех сервисов одновременно:
```bash
pnpm dev
```

Это запустит:
- **Admin Panel**: http://localhost:5173
- **AR Viewer**: http://localhost:5174
- **Backend API**: http://localhost:3000

### Запуск отдельных сервисов:

```bash
# Backend API
pnpm --filter api dev

# Admin Panel
pnpm --filter admin dev

# AR Viewer
pnpm --filter viewer dev
```

---

## Шаг 7: Первый запуск и тестирование

1. Откройте браузер и перейдите на http://localhost:5173 (Admin Panel)
2. Зарегистрируйте нового пользователя
3. Создайте новый проект
4. Загрузите триггер-изображение (JPG/PNG)
5. Загрузите 3D модель (GLB/GLTF)
6. Настройте позицию и масштаб
7. Сгенерируйте ссылку для AR Viewer
8. Откройте ссылку на смартфоне
9. Наведите камеру на триггер-изображение

---

## Полезные команды

```bash
# Установка зависимостей
pnpm install

# Запуск в режиме разработки
pnpm dev

# Сборка для production
pnpm build

# Проверка типов TypeScript
pnpm type-check

# Линтинг кода
pnpm lint

# Форматирование кода
pnpm format

# Просмотр базы данных (Prisma Studio)
pnpm db:studio

# Очистка node_modules и dist
pnpm clean
```

---

## Структура проекта после установки

```
C:\WEBAR\
├── apps/
│   ├── admin/              # React админка
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── hooks/
│   │   │   ├── store/
│   │   │   └── main.tsx
│   │   └── package.json
│   ├── viewer/             # AR viewer
│   │   ├── src/
│   │   │   ├── ar/
│   │   │   ├── components/
│   │   │   └── main.ts
│   │   └── package.json
│   └── api/                # Backend
│       ├── src/
│       │   ├── routes/
│       │   ├── services/
│       │   ├── middlewares/
│       │   └── index.ts
│       └── package.json
├── packages/
│   ├── database/           # Prisma
│   │   └── schema.prisma
│   ├── types/              # Общие типы
│   └── ui/                 # UI компоненты
├── .env                    # Переменные окружения
├── PLAN.md                 # Детальный план
├── README.md               # Документация
└── package.json            # Root package
```

---

## Устранение неполадок

### Ошибка подключения к базе данных

```bash
# Проверьте, что PostgreSQL запущен
pg_ctl status

# Проверьте DATABASE_URL в .env
# Убедитесь, что база данных создана
```

### Ошибка при установке зависимостей

```bash
# Очистите кеш и переустановите
pnpm store prune
rm -rf node_modules
pnpm install
```

### Порты заняты

Если порты 3000, 5173 или 5174 заняты, измените их:

```bash
# В apps/api/.env
API_PORT=3001

# В apps/admin/package.json - измените скрипт dev
"dev": "vite --port 5175"

# В apps/viewer/package.json - измените скрипт dev
"dev": "vite --port 5176"
```

---

## Следующие шаги

После успешного запуска:

1. Изучите [PLAN.md](./PLAN.md) для понимания архитектуры
2. Начните разработку с Фазы 2: Backend API
3. Следуйте roadmap из плана разработки

---

## Поддержка

При возникновении проблем:
1. Проверьте логи в консоли
2. Убедитесь, что все переменные окружения настроены
3. Проверьте, что PostgreSQL и все сервисы запущены
4. Создайте Issue в репозитории проекта

---

**Готово к разработке!**
