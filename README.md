<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Gestor de Gastos API [NESTJS]

API REST robusta diseñada para el control de gastos personales, construida con el ecosistema de **NestJS**. Esta aplicación implementa un sistema de multitenancy lógico donde cada usuario gestiona de forma segura su propia información financiera.

[![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![TypeORM](https://img.shields.io/badge/TypeORM-FE0803?style=for-the-badge)](https://typeorm.io/)

---

## 🚀 Características

- **Autenticación segura:** Implementación de Passport JWT.
- **Gestión de Gastos:** CRUD completo con relaciones de usuario.
- **Privacidad de Datos:** Los usuarios solo pueden interactuar con sus propios registros.
- **Validación de Datos:** Uso estricto de `class-validator` y `class-transformer`.
- **Infraestructura:** Contenedores con Docker para un despliegue rápido.

## 🛠️ Instalación y Configuración

Sigue estos pasos para poner en marcha el proyecto en tu entorno local:

### 1. Clonar el repositorio

```bash
git clone [https://github.com/benjasx/gestor-de-gastos-nestjs.git](https://github.com/benjasx/gestor-de-gastos-nestjs.git)
cd gestor-de-gastos-nestjs
```

### 2. Instalar dependencias

Este proyecto utiliza Yarn como gestor de paquetes.

```
yarn install
```

### 3. Configurar variables de entorno

Copia el archivo de ejemplo y configura tus credenciales:

```
cp .env.template .env
```

Nota: Asegúrate de que DB_PASSWORD y BD_NAME coincidan con lo que planeas usar en Docker.

### 4. Levantar la base de datos

Inicia el contenedor de PostgreSQL utilizando Docker Compose:

```
docker-compose up -d
```

### 5. Iniciar la aplicación

Ejecuta el servidor en modo desarrollo:

```
yarn start:dev
```

La API estará disponible en: http://localhost:3000/api

🐳 Docker Stack
El proyecto utiliza una imagen oficial de PostgreSQL 14.3. Los datos se persisten localmente en la carpeta ./postgres_data (configurada en tu .gitignore).

👨‍💻 Autor
Benja - Desarrollador de Software y Técnico en Electrónica - benjasx
