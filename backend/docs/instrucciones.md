# 🚀 Cómo ejecutar el proyecto HabiGo

## 🧱 1. Requisitos

* Node.js instalado
* PostgreSQL instalado

---

## 🗄️ 2. Crear base de datos

En PostgreSQL ejecutar:

CREATE DATABASE habigo;

---

## 🧩 3. Crear tablas

Ejecutar el archivo:

docs/database.sql

---

## ⚙️ 4. Configurar conexión

Ir a:

backend/src/config/db.js

Cambiar:

password: 'TU_PASSWORD'

por su contraseña de PostgreSQL

---

## 📦 5. Instalar dependencias

Ir a la carpeta backend:

cd backend
npm install

---

## ▶️ 6. Ejecutar servidor

cd src
node app.js

---

## 🧪 7. Probar API

Endpoints disponibles:

POST /api/users/register
POST /api/users/login
GET /api/users/perfil (requiere token)
POST /api/properties (requiere token)
GET /api/properties
