# Backend (Accounts & Ledger)

## ✅ Requisitos
- Node.js 18+
- Docker / Docker Compose

---

## ▶️ Levantar con Docker Compose

En la raíz del repo:

```bash
docker compose up -d postgres redis
```

Luego en backend:

```bash
cd backend
npm install
npm run start:dev
```

---

## 🔧 Migraciones (si aplica)

Actualmente `synchronize` está en `false`, por lo que necesitas migraciones para crear tablas.

Si activas `synchronize: true` en `src/database/typeorm.config.ts`, se crean tablas automáticamente (solo recomendado para dev).

---

## 🔐 Auth JWT (simple)

El backend espera un header:

```
Authorization: Bearer <token>
```

Generar token de prueba:

```bash
cd backend
JWT_SECRET=local_secret npm run token:dev -- <userId>
```

---

## 🔎 GraphQL Queries / Mutations

### Health
```graphql
query {
  health
}
```

### Create Account
```graphql
mutation {
  createAccount(input: { userId: "c2a3f1c2-6e7d-4c2f-9a1c-111111111111", currency: "USD" }) {
    id
    userId
    currency
    createdAt
  }
}
```

### List Accounts (por userId del token)
```graphql
query {
  accounts(pagination: { page: 1, limit: 10 }) {
    total
    page
    limit
    items {
      id
      userId
      currency
      createdAt
    }
  }
}
```

### Post Credit
```graphql
mutation {
  postCredit(input: { accountId: "UUID", amount: "100.00", description: "Deposito" }) {
    id
    accountId
    type
    amount
    createdAt
  }
}
```

### Post Debit
```graphql
mutation {
  postDebit(input: { accountId: "UUID", amount: "25.00", description: "Compra" }) {
    id
    accountId
    type
    amount
    createdAt
  }
}
```

### List Transactions
```graphql
query {
  transactions(accountId: "UUID", pagination: { page: 1, limit: 10 }) {
    total
    page
    limit
    items {
      id
      type
      amount
      description
      createdAt
    }
  }
}
```

### Balance Summary
```graphql
query {
  balanceSummary(accountId: "UUID") {
    accountId
    credits
    debits
    balance
  }
}
```

---

## ⚠️ Errores esperados

Ejemplo de error (GraphQL):
```json
{
  "errors": [
    {
      "message": "Invalid amount",
      "extensions": {
        "code": "INVALID_AMOUNT"
      }
    }
  ]
}
```

### Códigos posibles
- `ACCOUNT_NOT_FOUND`
- `INSUFFICIENT_FUNDS`
- `INVALID_AMOUNT`
- `UNAUTHORIZED`

