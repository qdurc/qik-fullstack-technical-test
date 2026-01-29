# Prueba Técnica – Full Stack
## Qik Banco Digital

Este repositorio contiene la implementación de la prueba técnica solicitada por **Qik Banco Digital**, correspondiente al desarrollo de un **Accounts & Ledger Service** utilizando el stack tecnológico indicado.

El objetivo del proyecto es demostrar dominio en desarrollo backend y frontend, buenas prácticas de arquitectura, manejo de datos, seguridad básica y documentación técnica, dentro de un contexto bancario.

---

## 🧱 Stack Tecnológico

**Backend**
- NestJS (TypeScript)
- GraphQL (Apollo)
- PostgreSQL (TypeORM)
- Redis
- JWT
- Docker Compose

**Frontend**
- React Native + TypeScript

---

## 📂 Estructura del Proyecto

- `/backend`: API y lógica de negocio
- `/frontend`: Aplicación móvil
- `docker-compose.yml`: Servicios de base de datos y cache
- `.env.example`: Variables de entorno de referencia

---

## 🔧 Backend bootstrap

- GraphQL está configurado en modo **code-first** y genera el esquema en `backend/src/schema.gql`.
- Cache global con Redis usando `CacheModule`.
- Cliente Redis disponible vía `REDIS_CLIENT` (ioredis).
- Validación global con `class-validator`/`class-transformer`.

> ⚠️ **Nota de seguridad**  
> Este repositorio no contiene credenciales reales ni datos sensibles.  
> Las variables de entorno reales se manejan localmente y no se versionan.
