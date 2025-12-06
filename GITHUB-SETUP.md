# Инструкция по загрузке проекта на GitHub

Git репозиторий инициализирован и первый коммит создан локально. Теперь нужно создать репозиторий на GitHub и загрузить туда код.

## Вариант 1: Через веб-интерфейс GitHub (рекомендуется)

### Шаг 1: Создайте репозиторий на GitHub

1. Откройте https://github.com/new
2. Заполните форму:
   - **Repository name**: `webar-app` (или любое другое имя)
   - **Description**: "WebAR application with admin panel and AR viewer using MindAR and Three.js"
   - **Visibility**: Public или Private (на ваш выбор)
   - **НЕ инициализируйте** README, .gitignore или license (они уже созданы локально)
3. Нажмите **"Create repository"**

### Шаг 2: Подключите локальный репозиторий к GitHub

После создания репозитория GitHub покажет инструкции. Выполните следующие команды:

```bash
# Добавьте удаленный репозиторий (замените YOUR_USERNAME на ваше имя пользователя GitHub)
git remote add origin https://github.com/YOUR_USERNAME/webar-app.git

# Переименуйте ветку в main (опционально, но рекомендуется)
git branch -M main

# Загрузите код на GitHub
git push -u origin main
```

**Пример:**
```bash
git remote add origin https://github.com/john-doe/webar-app.git
git branch -M main
git push -u origin main
```

При первом push вам может потребоваться авторизация:
- **Имя пользователя**: ваш GitHub username
- **Пароль**: Personal Access Token (не обычный пароль!)

### Как получить Personal Access Token:

1. Перейдите: https://github.com/settings/tokens
2. Нажмите **"Generate new token (classic)"**
3. Выберите срок действия и права доступа (минимум: `repo`)
4. Скопируйте токен и используйте его вместо пароля

---

## Вариант 2: Через GitHub CLI (быстрее)

### Установка GitHub CLI

**Windows:**
```bash
# Через winget
winget install --id GitHub.cli

# Или через Chocolatey
choco install gh

# Или через Scoop
scoop install gh
```

**macOS:**
```bash
brew install gh
```

**Linux:**
```bash
# Debian/Ubuntu
sudo apt install gh

# Fedora
sudo dnf install gh

# Arch
sudo pacman -S github-cli
```

### Использование GitHub CLI

```bash
# Авторизуйтесь на GitHub
gh auth login

# Создайте репозиторий и загрузите код одной командой
gh repo create webar-app --public --source=. --remote=origin --push
```

Опции:
- `--public` - публичный репозиторий (замените на `--private` для приватного)
- `--source=.` - текущая директория
- `--remote=origin` - имя удаленного репозитория
- `--push` - сразу загрузить код

---

## Вариант 3: Использование Git GUI клиентов

### GitHub Desktop

1. Скачайте: https://desktop.github.com/
2. Установите и авторизуйтесь
3. File → Add Local Repository → выберите `C:\WEBAR`
4. Publish Repository → выберите настройки и загрузите

### GitKraken

1. Скачайте: https://www.gitkraken.com/
2. Установите и авторизуйтесь через GitHub
3. Откройте репозиторий `C:\WEBAR`
4. Push → Create remote repository

---

## После загрузки на GitHub

### Настройте защиту ветки main

1. Перейдите: Settings → Branches
2. Add branch protection rule
3. Укажите pattern: `main`
4. Включите:
   - ✅ Require pull request reviews before merging
   - ✅ Require status checks to pass

### Добавьте описание и теги

1. Перейдите на главную страницу репозитория
2. Нажмите на иконку шестеренки (Edit) рядом с About
3. Добавьте:
   - **Description**: "WebAR application with admin panel and AR viewer"
   - **Website**: (если есть)
   - **Topics**: `webAR`, `augmented-reality`, `threejs`, `mindar`, `react`, `typescript`

### Создайте первый Issue

Создайте Issue для трекинга разработки:

```markdown
**Title**: MVP Development Roadmap

**Description**:
Tracking progress for MVP development according to PLAN.md

Phase 1: Backend Development
- [ ] Setup Fastify server
- [ ] Configure Prisma and PostgreSQL
- [ ] Implement authentication (JWT)
- [ ] Create CRUD APIs for projects
- [ ] Create CRUD APIs for AR scenes
- [ ] Integrate Cloudflare R2

Phase 2: Admin Panel
- [ ] Setup React + Vite
- [ ] Authentication pages
- [ ] Projects management
- [ ] Scene management
- [ ] File upload components

Phase 3: AR Viewer
- [ ] Setup Three.js + MindAR
- [ ] Camera access
- [ ] Trigger detection
- [ ] 3D model rendering

Phase 4: Testing & Deploy
- [ ] End-to-end testing
- [ ] Mobile device testing
- [ ] Deploy to production
```

---

## Клонирование на другом устройстве

После загрузки на GitHub, вы можете клонировать проект на любом другом устройстве:

```bash
# Клонировать репозиторий
git clone https://github.com/YOUR_USERNAME/webar-app.git

# Перейти в директорию
cd webar-app

# Установить зависимости
pnpm install

# Настроить .env
cp .env.example .env
# Отредактировать .env с настройками для нового устройства

# Применить миграции базы данных
pnpm db:generate
pnpm db:migrate

# Запустить проект
pnpm dev
```

---

## Полезные Git команды для работы с проектом

```bash
# Проверить статус
git status

# Создать новую ветку для фичи
git checkout -b feature/admin-auth

# Добавить изменения
git add .

# Создать коммит
git commit -m "Add authentication to admin panel"

# Загрузить изменения
git push origin feature/admin-auth

# Переключиться на main
git checkout main

# Получить последние изменения
git pull origin main

# Слить ветку
git merge feature/admin-auth

# Посмотреть историю
git log --oneline --graph --all

# Откатить изменения в файле
git checkout -- filename

# Отменить последний коммит (но сохранить изменения)
git reset --soft HEAD~1
```

---

## GitHub Actions (CI/CD) - опционально

Позже можно добавить автоматическое тестирование и деплой.

Создайте файл `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v3
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm type-check
      - run: pnpm lint
      - run: pnpm build
```

---

**Готово!** Выберите удобный для вас вариант и загрузите проект на GitHub.

После загрузки, ссылка на репозиторий будет выглядеть так:
```
https://github.com/YOUR_USERNAME/webar-app
```
