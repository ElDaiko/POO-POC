# ✅ Ejemplos de Buenas Prácticas en POO

Este directorio contiene implementaciones que demuestran cómo aplicar correctamente los principios de Programación Orientada a Objetos en TypeScript.

## 🎯 Principios Aplicados

### 1. Encapsulamiento

**Definición**: Ocultar el estado interno y exponer solo métodos controlados.

```typescript
// ❌ MALO: Estado público
class AuthServiceBad {
  public currentUser: User | null = null; // Cualquiera puede modificar
  public token: string = ""; // Token expuesto
}

// ✅ BUENO: Estado privado con getters controlados
class SessionManager {
  private currentSession: SessionState | null = null; // Solo accesible internamente

  getSession(): { user: User; token: string } | null {
    return this.currentSession
      ? { ...this.currentSession } // Retorna COPIA, no referencia
      : null;
  }
}
```

**Beneficios**:

- Previene modificaciones accidentales
- Permite validación antes de cambios
- Facilita refactoring interno

---

### 2. Abstracción

**Definición**: Definir contratos (interfaces) que ocultan detalles de implementación.

```typescript
// ✅ Interface define QUÉ, no CÓMO
interface AuthService {
  authenticate(email: string, password: string): Promise<AuthResult>;
  validateToken(token: string): Promise<boolean>;
}

// ✅ Implementación define CÓMO
class AuthServiceImpl implements AuthService {
  async authenticate(email: string, password: string): Promise<AuthResult> {
    // Detalles de implementación ocultos
  }
}
```

**Beneficios**:

- Los consumidores no dependen de implementaciones
- Permite múltiples implementaciones (producción, testing, mock)
- Documenta el contrato explícitamente

---

### 3. Bajo Acoplamiento

**Definición**: Minimizar las dependencias directas entre módulos.

```typescript
// ❌ MALO: Dependencia directa
class AuthServiceBad {
  login() {
    localStorage.setItem("user", JSON.stringify(user)); // Acoplado a localStorage
  }
}

// ✅ BUENO: Dependencia inyectada
class SessionManager {
  constructor(private storage: StorageService) {} // Inyección de dependencia

  startSession(user: User, token: string) {
    this.storage.set("session", { user, token }); // Usa abstracción
  }
}
```

**Beneficios**:

- Facilita testing (inyectar mocks)
- Permite cambiar implementaciones sin modificar clases
- Reduce efectos cascada en cambios

---

### 4. Composición sobre Herencia

**Definición**: Preferir "tiene-un" sobre "es-un" para reutilizar código.

```typescript
// ❌ MALO: Herencia incorrecta
class UserManagerBad extends AuthServiceBad {
  // UserManager NO ES un AuthService
  // Solo quiere USAR sus funcionalidades
}

// ✅ BUENO: Composición
class LoginUserUseCase {
  constructor(
    private authService: AuthService, // TIENE un AuthService
    private sessionService: SessionService // TIENE un SessionService
  ) {}

  async execute(email: string, password: string) {
    const result = await this.authService.authenticate(email, password);
    if (result.success) {
      this.sessionService.startSession(result.user, result.token);
    }
    return result;
  }
}
```

**Beneficios**:

- Más flexible que herencia
- Evita acoplamiento fuerte padre-hijo
- Permite combinar comportamientos libremente

---

## 📁 Estructura de Archivos

```
good/
├── interfaces/
│   └── AuthService.ts      # Contratos/interfaces
│
├── services/
│   ├── AuthServiceImpl.ts   # Implementación de autenticación
│   └── StorageServiceImpl.ts # Implementación de storage
│
├── session/
│   └── SessionManager.ts    # Gestión de sesión (composición)
│
├── use-cases/
│   └── LoginUserUseCase.ts  # Orquestación del flujo de login
│
└── README.md
```

---

## 🔄 Flujo de Login

```
┌─────────────┐     ┌───────────────────┐     ┌─────────────────┐
│     UI      │────▶│  LoginUserUseCase │────▶│   AuthService   │
│ (React)     │     │   (Orquestador)   │     │ (Autenticación) │
└─────────────┘     └───────────────────┘     └─────────────────┘
                            │
                            ▼
                    ┌───────────────────┐     ┌─────────────────┐
                    │  SessionManager   │────▶│  StorageService │
                    │     (Sesión)      │     │  (Persistencia) │
                    └───────────────────┘     └─────────────────┘
```

**Responsabilidades**:

- **UI (React)**: Solo renderiza y llama al caso de uso
- **LoginUserUseCase**: Coordina el flujo, no implementa lógica
- **AuthService**: Valida credenciales
- **SessionManager**: Mantiene estado de sesión
- **StorageService**: Persiste datos

---

## 🧪 Testing

### Sin buenas prácticas (difícil)

```typescript
// ❌ Imposible mockear localStorage
test("login should work", async () => {
  const service = new AuthServiceBad();
  await service.login("test@test.com", "123456");
  // ¿Cómo verificar? Depende de localStorage real
});
```

### Con buenas prácticas (fácil)

```typescript
// ✅ Fácil con mocks
test("login should work", async () => {
  const mockAuth: AuthService = {
    authenticate: jest.fn().mockResolvedValue({
      success: true,
      user: mockUser,
      token: "token",
    }),
    validateToken: jest.fn(),
    refreshToken: jest.fn(),
  };

  const mockSession: SessionService = {
    startSession: jest.fn(),
    getSession: jest.fn(),
    endSession: jest.fn(),
    isActive: jest.fn(),
  };

  const useCase = new LoginUserUseCase(mockAuth, mockSession);
  const result = await useCase.execute("test@test.com", "123456");

  expect(result.success).toBe(true);
  expect(mockSession.startSession).toHaveBeenCalled();
});
```

---

## 💬 Preguntas de Entrevista

### Sobre Encapsulamiento

> **P**: ¿Por qué `SessionManager` retorna copias en lugar de referencias directas?

**R**: Para mantener el encapsulamiento. Si retornamos la referencia directa, el consumidor podría modificar el objeto y cambiar el estado interno sin pasar por los métodos de la clase. Retornar copias (`{ ...object }`) garantiza inmutabilidad desde la perspectiva externa.

### Sobre Inyección de Dependencias

> **P**: ¿Por qué inyectar `StorageService` en lugar de usar `localStorage` directamente?

**R**: Por tres razones:

1. **Testing**: Podemos inyectar `InMemoryStorageService` en tests
2. **Flexibilidad**: Cambiar a `sessionStorage` o `IndexedDB` sin modificar `SessionManager`
3. **SSR**: En Next.js, `localStorage` no existe en el servidor

### Sobre Casos de Uso

> **P**: ¿Por qué tener un `LoginUserUseCase` si podría llamar a los servicios directamente?

**R**: El caso de uso:

1. **Orquesta** el flujo completo (auth + session)
2. **Encapsula** la secuencia de operaciones
3. **Centraliza** el manejo de errores
4. **Simplifica** la UI (una llamada vs múltiples)
5. **Documenta** la intención del negocio

---

## 📋 Checklist de Buenas Prácticas

- [ ] Estado privado con `private`
- [ ] Interfaces para dependencias externas
- [ ] Inyección de dependencias por constructor
- [ ] Composición en lugar de herencia
- [ ] Métodos que retornan resultados tipados
- [ ] Separación de responsabilidades clara
- [ ] Código testeable sin mocks complejos
