# ❌ Ejemplos de Malas Prácticas en POO

Este directorio contiene ejemplos **intencionalmente mal diseñados** para demostrar anti-patrones comunes en Programación Orientada a Objetos.

## 🎯 Propósito Educativo

Estos ejemplos muestran código que **funciona** pero tiene problemas graves de diseño que afectan:

- Mantenibilidad
- Testabilidad
- Escalabilidad
- Seguridad

## 📁 Archivos

### `AuthServiceBad.ts`

**Problema Principal**: Clase "God Object" que viola múltiples principios de POO.

#### Anti-patrones identificados:

| Anti-patrón                     | Descripción                           | Consecuencia                                           |
| ------------------------------- | ------------------------------------- | ------------------------------------------------------ |
| **Estado Público**              | `public currentUser`, `public token`  | Cualquier código puede modificar el estado sin control |
| **Alto Acoplamiento**           | Dependencia directa de `localStorage` | Imposible hacer unit testing                           |
| **Responsabilidades Mezcladas** | Login + Sesión + Storage en una clase | Cambios tienen efectos cascada                         |
| **Sin Abstracción**             | No hay interfaces                     | Imposible sustituir implementación                     |
| **Singleton Global**            | `export const authService`            | Estado compartido, dependencias ocultas                |

#### Código problemático:

```typescript
// ❌ Estado público - violación de encapsulamiento
public currentUser: User | null = null;
public isAuthenticated: boolean = false;
public token: string = '';

// ❌ Dependencia directa - imposible testear
localStorage.setItem('user', JSON.stringify(this.currentUser));
```

---

### `UserManagerBad.ts`

**Problema Principal**: Herencia incorrecta y acoplamiento fuerte.

#### Anti-patrones identificados:

| Anti-patrón             | Descripción                             | Consecuencia                         |
| ----------------------- | --------------------------------------- | ------------------------------------ |
| **Herencia Incorrecta** | `UserManagerBad extends AuthServiceBad` | No hay relación "es-un" real         |
| **Estado Duplicado**    | Propiedades que replican al padre       | Desincronización de datos            |
| **Override Peligroso**  | Modifica comportamiento del padre       | Bugs sutiles y difíciles de rastrear |
| **Violación de Liskov** | No es sustituible por el padre          | Polimorfismo roto                    |

#### Código problemático:

```typescript
// ❌ Herencia sin relación semántica
export class UserManagerBad extends AuthServiceBad {
  // ❌ Estado adicional que puede desincronizarse
  public userPreferences: Record<string, unknown> = {};

  // ❌ Override que añade efectos secundarios ocultos
  async login(email: string, password: string): Promise<boolean> {
    const success = await super.login(email, password);
    // ... lógica adicional que el padre no conoce
  }
}
```

---

## 🔍 Preguntas de Entrevista

### Sobre Encapsulamiento

> **P**: ¿Por qué es problemático tener `public token: string`?

**R**: Cualquier parte del código puede modificar el token directamente, saltándose validaciones. Esto puede causar estados inconsistentes donde `isAuthenticated = true` pero el token es inválido.

### Sobre Acoplamiento

> **P**: ¿Por qué el acceso directo a `localStorage` es un problema?

**R**:

1. No se puede testear sin mockear globals
2. Si cambiamos a sessionStorage o IndexedDB, hay que modificar la clase
3. En SSR (Next.js), localStorage no existe y el código falla

### Sobre Herencia

> **P**: ¿Cuándo está mal usar herencia?

**R**: Cuando no existe una relación "es-un" clara. `UserManager` no ES un `AuthService`, lo USA. Debería ser composición.

### Sobre Responsabilidad Única

> **P**: ¿Cuántas responsabilidades tiene `AuthServiceBad`?

**R**: Al menos 5:

1. Validación de credenciales
2. Comunicación con API (simulada)
3. Gestión de sesión
4. Persistencia en localStorage
5. Historial de logins

---

## 🚫 Consecuencias en Producción

### Testing

```typescript
// ❌ IMPOSIBLE: No hay forma de inyectar mocks
const service = new AuthServiceBad();
await service.login("test@test.com", "123456"); // Usa localStorage real
```

### Mantenimiento

```typescript
// ❌ Si cambio el formato de User, debo buscar en TODA la clase
// y en TODOS los lugares que acceden a currentUser
```

### Escalabilidad

```typescript
// ❌ Para añadir refresh token, debo modificar:
// - login()
// - logout()
// - restoreSession()
// - Potencialmente UserManagerBad también
```

---

## ✅ Solución

Ver el directorio `../good/` para la implementación correcta usando:

- Interfaces para abstracción
- Inyección de dependencias
- Composición sobre herencia
- Estado privado con getters controlados

---

## 📚 Principios Violados

- **SRP** (Single Responsibility Principle): Una clase, múltiples razones para cambiar
- **OCP** (Open/Closed Principle): Para extender, hay que modificar
- **LSP** (Liskov Substitution Principle): UserManager no sustituye a AuthService
- **DIP** (Dependency Inversion Principle): Depende de implementaciones, no abstracciones
- **Encapsulamiento**: Estado expuesto públicamente
- **Bajo Acoplamiento**: Dependencias directas y hardcodeadas
