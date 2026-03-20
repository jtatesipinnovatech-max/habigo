# 📡 Endpoints - HabiGo API

## 🔐 Usuarios

### Registro

POST /api/users/register

Body:
{
"email": "[test@test.com](mailto:test@test.com)",
"password": "123456"
}

---

### Login

POST /api/users/login

---

### Perfil (protegido)

GET /api/users/perfil

Header:
Authorization: Bearer TOKEN

---

## 🏠 Propiedades

### Crear propiedad (protegido)

POST /api/properties

Body:
{
"title": "Apartamento",
"description": "Bonito lugar",
"price": 200000
}

---

### Listar propiedades

GET /api/properties
