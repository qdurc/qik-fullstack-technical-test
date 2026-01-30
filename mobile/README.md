# Mobile (React Native)

## Requisitos
- Node.js + npm
- Android Studio (para Android)
- Xcode (para iOS)

## Instalar dependencias
```bash
npm install
```

## Cómo correr iOS
```bash
npm run ios
```

## Cómo correr Android
```bash
npm run android
```

> Si usas emulador Android, asegúrate de tener `adb` en el PATH y un AVD encendido.

## Apuntar al backend local
La app usa estos endpoints (configurados en `src/api/apolloClient.ts`):

- iOS: `http://localhost:3000/graphql`
- Android emulador: `http://10.0.2.2:3000/graphql`

Si tu backend corre en otro puerto o IP, actualiza `GRAPHQL_BASE_URL` en:
```
mobile/src/api/apolloClient.ts
```

## Token demo / Login
Tienes dos formas:

### 1) Botón "Crear cuenta nueva" en Login
- En la pantalla de Login, pulsa **Crear cuenta nueva**.
- Esto llama a la mutation `createDemoUser` del backend y te autentica automáticamente.

### 2) Generar token manual desde backend
```bash
cd ../backend
npm run token:dev -- <userId>
```
Luego copia el token y pégalo en el login de la app.

---

Si tienes problemas con conexión:
- Verifica que el backend esté corriendo.
- En Android, **nunca** uses `localhost`, usa `10.0.2.2`.
