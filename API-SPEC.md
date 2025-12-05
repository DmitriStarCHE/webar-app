# API Спецификация WebAR Backend

## Base URL
```
Development: http://localhost:3000/api
Production: https://api.yourdomain.com/api
```

## Аутентификация

API использует JWT токены для аутентификации.

### Получение токена:
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Использование токена:
```http
Authorization: Bearer <access_token>
```

---

## Endpoints

### 🔐 Authentication

#### POST /auth/register
Регистрация нового пользователя

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:** `201 Created`
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "USER",
    "createdAt": "2025-12-05T10:00:00Z"
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1...",
    "refreshToken": "eyJhbGciOiJIUzI1..."
  }
}
```

#### POST /auth/login
Вход в систему

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:** `200 OK`
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "USER"
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1...",
    "refreshToken": "eyJhbGciOiJIUzI1..."
  }
}
```

#### POST /auth/refresh
Обновление access токена

**Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1..."
}
```

**Response:** `200 OK`
```json
{
  "accessToken": "eyJhbGciOiJIUzI1...",
  "refreshToken": "eyJhbGciOiJIUzI1..."
}
```

#### POST /auth/logout
Выход из системы (invalidate refresh token)

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "message": "Logged out successfully"
}
```

---

### 📁 Projects

#### GET /projects
Получить список всех проектов пользователя

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (optional): номер страницы (default: 1)
- `limit` (optional): элементов на странице (default: 10)

**Response:** `200 OK`
```json
{
  "projects": [
    {
      "id": "uuid",
      "name": "My AR Project",
      "description": "Description text",
      "createdAt": "2025-12-05T10:00:00Z",
      "updatedAt": "2025-12-05T10:00:00Z",
      "scenesCount": 3
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

#### POST /projects
Создать новый проект

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "name": "My AR Project",
  "description": "Optional description"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "name": "My AR Project",
  "description": "Optional description",
  "userId": "uuid",
  "createdAt": "2025-12-05T10:00:00Z",
  "updatedAt": "2025-12-05T10:00:00Z"
}
```

#### GET /projects/:id
Получить детали проекта

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "name": "My AR Project",
  "description": "Description",
  "userId": "uuid",
  "createdAt": "2025-12-05T10:00:00Z",
  "updatedAt": "2025-12-05T10:00:00Z",
  "scenes": [
    {
      "id": "uuid",
      "name": "Scene 1",
      "isActive": true,
      "viewCount": 42
    }
  ]
}
```

#### PUT /projects/:id
Обновить проект

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "name": "Updated name",
  "description": "Updated description"
}
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "name": "Updated name",
  "description": "Updated description",
  "updatedAt": "2025-12-05T11:00:00Z"
}
```

#### DELETE /projects/:id
Удалить проект (каскадно удаляет все сцены и контент)

**Headers:** `Authorization: Bearer <token>`

**Response:** `204 No Content`

---

### 🎬 AR Scenes

#### GET /projects/:projectId/scenes
Получить все сцены проекта

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "scenes": [
    {
      "id": "uuid",
      "projectId": "uuid",
      "name": "Scene 1",
      "triggerImageUrl": "https://cdn.example.com/trigger.jpg",
      "triggerCompiled": true,
      "isActive": true,
      "viewCount": 42,
      "createdAt": "2025-12-05T10:00:00Z",
      "contentCount": 3
    }
  ]
}
```

#### POST /projects/:projectId/scenes
Создать новую AR сцену

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "name": "My AR Scene"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "projectId": "uuid",
  "name": "My AR Scene",
  "isActive": true,
  "viewCount": 0,
  "createdAt": "2025-12-05T10:00:00Z"
}
```

#### GET /scenes/:id
Получить детали сцены

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "projectId": "uuid",
  "name": "My AR Scene",
  "triggerImageUrl": "https://cdn.example.com/trigger.jpg",
  "triggerMindFile": "https://cdn.example.com/trigger.mind",
  "triggerCompiled": true,
  "isActive": true,
  "viewCount": 42,
  "createdAt": "2025-12-05T10:00:00Z",
  "content": [
    {
      "id": "uuid",
      "contentType": "MODEL_3D",
      "fileUrl": "https://cdn.example.com/model.glb",
      "fileName": "model.glb",
      "positionX": 0,
      "positionY": 0,
      "positionZ": -1,
      "scale": 1
    }
  ]
}
```

#### PUT /scenes/:id
Обновить сцену

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "name": "Updated Scene Name",
  "isActive": false
}
```

**Response:** `200 OK`

#### DELETE /scenes/:id
Удалить сцену

**Headers:** `Authorization: Bearer <token>`

**Response:** `204 No Content`

#### POST /scenes/:id/trigger
Загрузить триггер-изображение

**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Request:**
```
Form Data:
- trigger: File (image/jpeg or image/png, max 5MB)
```

**Response:** `200 OK`
```json
{
  "triggerImageUrl": "https://cdn.example.com/trigger.jpg",
  "triggerImageKey": "triggers/uuid/image.jpg",
  "message": "Trigger uploaded successfully. Compilation started."
}
```

---

### 🎨 AR Content

#### GET /scenes/:sceneId/content
Получить весь контент сцены

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "content": [
    {
      "id": "uuid",
      "sceneId": "uuid",
      "contentType": "MODEL_3D",
      "fileUrl": "https://cdn.example.com/model.glb",
      "fileName": "model.glb",
      "fileSize": 2048576,
      "positionX": 0,
      "positionY": 0,
      "positionZ": -1,
      "rotationX": 0,
      "rotationY": 0,
      "rotationZ": 0,
      "scale": 1,
      "config": {},
      "createdAt": "2025-12-05T10:00:00Z"
    }
  ]
}
```

#### POST /scenes/:sceneId/content
Добавить контент к сцене

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "contentType": "TEXT",
  "textContent": "Hello AR World!",
  "positionX": 0,
  "positionY": 0.5,
  "positionZ": -1,
  "scale": 1,
  "config": {
    "fontSize": 24,
    "color": "#FFFFFF"
  }
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "sceneId": "uuid",
  "contentType": "TEXT",
  "textContent": "Hello AR World!",
  "positionX": 0,
  "positionY": 0.5,
  "positionZ": -1,
  "scale": 1,
  "config": {
    "fontSize": 24,
    "color": "#FFFFFF"
  },
  "createdAt": "2025-12-05T10:00:00Z"
}
```

#### PUT /content/:id
Обновить контент

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "positionX": 0.5,
  "positionY": 0.2,
  "scale": 1.5,
  "config": {
    "animation": "rotate"
  }
}
```

**Response:** `200 OK`

#### DELETE /content/:id
Удалить контент

**Headers:** `Authorization: Bearer <token>`

**Response:** `204 No Content`

#### POST /content/:id/upload
Загрузить файл для контента (3D модель, аудио, изображение)

**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Request:**
```
Form Data:
- file: File
- contentType: "MODEL_3D" | "AUDIO" | "IMAGE" | "VIDEO"
```

**Limits:**
- 3D Models (GLB/GLTF): max 50MB
- Audio (MP3/WAV): max 10MB
- Images (JPG/PNG): max 5MB

**Response:** `200 OK`
```json
{
  "fileUrl": "https://cdn.example.com/content/model.glb",
  "fileKey": "content/uuid/model.glb",
  "fileName": "model.glb",
  "fileSize": 2048576,
  "contentType": "MODEL_3D"
}
```

---

### 🌐 Public API (для AR Viewer)

#### GET /public/scenes/:id
Получить публичные данные сцены для AR Viewer

**No authentication required**

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "name": "My AR Scene",
  "triggerImageUrl": "https://cdn.example.com/trigger.jpg",
  "triggerMindFile": "https://cdn.example.com/trigger.mind",
  "content": [
    {
      "id": "uuid",
      "contentType": "MODEL_3D",
      "fileUrl": "https://cdn.example.com/model.glb",
      "positionX": 0,
      "positionY": 0,
      "positionZ": -1,
      "rotationX": 0,
      "rotationY": 0,
      "rotationZ": 0,
      "scale": 1,
      "config": {}
    },
    {
      "id": "uuid",
      "contentType": "AUDIO",
      "fileUrl": "https://cdn.example.com/audio.mp3",
      "config": {
        "autoplay": true,
        "loop": false
      }
    }
  ]
}
```

#### GET /public/viewer/:sceneId
Получить данные для AR viewer с увеличением счетчика просмотров

**No authentication required**

**Response:** `200 OK`
```json
{
  "scene": {
    "id": "uuid",
    "name": "My AR Scene",
    "triggerMindFile": "https://cdn.example.com/trigger.mind",
    "content": [...]
  },
  "viewerUrl": "https://viewer.yourdomain.com?scene=uuid"
}
```

#### POST /public/scenes/:id/view
Увеличить счетчик просмотров сцены

**No authentication required**

**Response:** `200 OK`
```json
{
  "viewCount": 43
}
```

---

## Коды ошибок

### 400 Bad Request
Неверные данные в запросе
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### 401 Unauthorized
Не авторизован или токен невалиден
```json
{
  "error": "Unauthorized",
  "message": "Invalid or expired token"
}
```

### 403 Forbidden
Доступ запрещен
```json
{
  "error": "Forbidden",
  "message": "You don't have permission to access this resource"
}
```

### 404 Not Found
Ресурс не найден
```json
{
  "error": "Not Found",
  "message": "Resource with id 'uuid' not found"
}
```

### 413 Payload Too Large
Файл слишком большой
```json
{
  "error": "File too large",
  "message": "Maximum file size is 50MB"
}
```

### 429 Too Many Requests
Превышен лимит запросов
```json
{
  "error": "Rate limit exceeded",
  "message": "Too many requests. Please try again later."
}
```

### 500 Internal Server Error
Внутренняя ошибка сервера
```json
{
  "error": "Internal Server Error",
  "message": "Something went wrong"
}
```

---

## Rate Limiting

- **Аутентифицированные запросы**: 100 запросов в 15 минут
- **Публичные запросы**: 50 запросов в 15 минут
- **Загрузка файлов**: 20 запросов в час

---

## CORS

Allowed origins настраиваются через переменную окружения `ALLOWED_ORIGINS`.

Default для разработки:
```
http://localhost:5173
http://localhost:5174
```

---

## Примеры использования

### Полный цикл создания AR сцены:

```javascript
// 1. Логин
const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'user@example.com', password: 'pass123' })
});
const { tokens } = await loginResponse.json();

// 2. Создать проект
const projectResponse = await fetch('http://localhost:3000/api/projects', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${tokens.accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ name: 'My Project' })
});
const project = await projectResponse.json();

// 3. Создать сцену
const sceneResponse = await fetch(`http://localhost:3000/api/projects/${project.id}/scenes`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${tokens.accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ name: 'Scene 1' })
});
const scene = await sceneResponse.json();

// 4. Загрузить триггер
const triggerForm = new FormData();
triggerForm.append('trigger', triggerImageFile);
await fetch(`http://localhost:3000/api/scenes/${scene.id}/trigger`, {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${tokens.accessToken}` },
  body: triggerForm
});

// 5. Добавить 3D модель
const contentResponse = await fetch(`http://localhost:3000/api/scenes/${scene.id}/content`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${tokens.accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    contentType: 'MODEL_3D',
    positionZ: -1,
    scale: 1
  })
});
const content = await contentResponse.json();

// 6. Загрузить файл модели
const modelForm = new FormData();
modelForm.append('file', modelFile);
modelForm.append('contentType', 'MODEL_3D');
await fetch(`http://localhost:3000/api/content/${content.id}/upload`, {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${tokens.accessToken}` },
  body: modelForm
});

// 7. Получить ссылку для AR viewer
const viewerUrl = `http://localhost:5174?scene=${scene.id}`;
console.log('AR Viewer URL:', viewerUrl);
```

---

**Документ обновлен**: 2025-12-05
