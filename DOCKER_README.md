# Docker Deployment Guide для XTeam.Pro

## Обзор

Этот проект настроен для развертывания с помощью Docker и Docker Compose. Включает:
- **Frontend**: React/TypeScript приложение с Nginx
- **Backend**: Python FastAPI приложение
- **Database**: SQLite с persistent volumes

## Быстрый старт

### 1. Подготовка окружения

```bash
# Скопируйте файл переменных окружения
cp .env.docker .env

# Отредактируйте .env файл с вашими настройками
nano .env
```

### 2. Запуск в production режиме

```bash
# Сборка и запуск всех сервисов
docker-compose up -d

# Проверка статуса
docker-compose ps

# Просмотр логов
docker-compose logs -f
```

### 3. Запуск в development режиме

```bash
# Запуск с hot reload (автоматически использует docker-compose.override.yml)
docker-compose up -d

# Для принудительной пересборки
docker-compose up -d --build
```

## Доступ к приложению

- **Frontend**: http://localhost:3000 (production) или http://localhost:5173 (development)
- **Backend API**: http://localhost:8000
- **Backend Docs**: http://localhost:8000/docs

## Управление сервисами

```bash
# Остановка всех сервисов
docker-compose down

# Остановка с удалением volumes (ОСТОРОЖНО: удалит данные!)
docker-compose down -v

# Перезапуск конкретного сервиса
docker-compose restart backend

# Просмотр логов конкретного сервиса
docker-compose logs -f frontend

# Выполнение команд в контейнере
docker-compose exec backend bash
docker-compose exec frontend sh
```

## Структура файлов

```
.
├── docker-compose.yml          # Основная конфигурация
├── docker-compose.override.yml # Настройки для разработки
├── Dockerfile                  # Frontend Dockerfile
├── nginx.conf                  # Nginx конфигурация
├── backend/
│   └── Dockerfile             # Backend Dockerfile
├── .env.docker               # Шаблон переменных окружения
└── .env                      # Ваши переменные окружения
```

## Переменные окружения

### Обязательные переменные

- `SECRET_KEY` - Секретный ключ для backend
- `OPENAI_API_KEY` - API ключ OpenAI
- `SMTP_USERNAME` - Email для SMTP
- `SMTP_PASSWORD` - Пароль для SMTP

### Опциональные переменные

- `DEFAULT_ADMIN_EMAIL` - Email администратора
- `DEFAULT_ADMIN_PASSWORD` - Пароль администратора
- `VITE_GOOGLE_ANALYTICS_ID` - Google Analytics ID
- `VITE_CALENDLY_URL` - Calendly URL

## Volumes и данные

### Persistent volumes:
- `backend_data` - База данных SQLite
- `backend_uploads` - Загруженные файлы
- `backend_reports` - Отчеты
- `backend_logs` - Логи приложения

### Backup данных

```bash
# Создание backup базы данных
docker-compose exec backend cp xteam_pro.db /tmp/backup.db
docker cp $(docker-compose ps -q backend):/tmp/backup.db ./backup.db

# Восстановление из backup
docker cp ./backup.db $(docker-compose ps -q backend):/app/xteam_pro.db
docker-compose restart backend
```

## Мониторинг и отладка

### Health checks

```bash
# Проверка здоровья сервисов
docker-compose ps

# Ручная проверка health endpoints
curl http://localhost:8000/health  # Backend
curl http://localhost:3000/health  # Frontend
```

### Отладка проблем

```bash
# Просмотр детальных логов
docker-compose logs --details backend
docker-compose logs --details frontend

# Проверка сетевого подключения
docker-compose exec frontend ping backend
docker-compose exec backend ping frontend

# Проверка переменных окружения
docker-compose exec backend env
docker-compose exec frontend env
```

## Production deployment

### Рекомендации для production:

1. **Безопасность**:
   - Измените все пароли по умолчанию
   - Используйте сильный `SECRET_KEY`
   - Настройте HTTPS с reverse proxy (nginx/traefik)

2. **Мониторинг**:
   - Настройте логирование в внешнюю систему
   - Используйте мониторинг контейнеров
   - Настройте алерты на health checks

3. **Backup**:
   - Автоматизируйте backup базы данных
   - Настройте backup volumes
   - Тестируйте процедуры восстановления

### Пример production docker-compose:

```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  backend:
    restart: always
    environment:
      - ENVIRONMENT=production
      - DEBUG=false
  frontend:
    restart: always
    environment:
      - VITE_DEV_MODE=false
```

```bash
# Запуск в production
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## Troubleshooting

### Частые проблемы:

1. **Порты заняты**:
   ```bash
   # Проверить занятые порты
   netstat -tulpn | grep :3000
   netstat -tulpn | grep :8000
   ```

2. **Проблемы с permissions**:
   ```bash
   # Исправить права на volumes
   docker-compose exec backend chown -R app:app /app
   ```

3. **Проблемы с сетью**:
   ```bash
   # Пересоздать сеть
   docker-compose down
   docker network prune
   docker-compose up -d
   ```

4. **Очистка системы**:
   ```bash
   # Очистить неиспользуемые ресурсы
   docker system prune -a
   docker volume prune
   ```