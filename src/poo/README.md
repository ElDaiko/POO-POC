# 🎓 POO & SOLID en TypeScript - Guía Completa

Este repositorio demuestra cómo aplicar correctamente los principios de **Programación Orientada a Objetos** y **SOLID** en TypeScript, con un enfoque práctico orientado a:

- ✅ Exámenes técnicos
- ✅ Entrevistas frontend/fullstack
- ✅ Buenas prácticas reales

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Abre http://localhost:5173 para explorar los ejemplos interactivos.

---

## 📦 POO Básico

### 🔒 Encapsulamiento

**Definición:** Ocultar el estado interno y exponer solo métodos controlados.

| Malo                | Bueno                              |
| ------------------- | ---------------------------------- |
| `public balance`    | `private _balance` + getter        |
| Cualquiera modifica | Solo métodos controlados modifican |

**Frase para entrevista:**

> "El encapsulamiento protege la integridad del estado. Sin él, cualquier parte del código puede corromper los datos del objeto."

---

### 🎭 Abstracción

**Definición:** Exponer QUÉ hace un objeto, ocultando CÓMO lo hace.

| Malo                      | Bueno                                |
| ------------------------- | ------------------------------------ |
| Cliente conoce SMTP       | Cliente conoce `NotificationService` |
| Acoplado a implementación | Acoplado a interfaz                  |

**Frase para entrevista:**

> "La abstracción permite trabajar con conceptos de alto nivel sin preocuparse por detalles de implementación."

---

### 🌳 Herencia

**Definición:** Crear clases basadas en otras. **Solo usar cuando hay relación ES-UN.**

| Malo                    | Bueno                 |
| ----------------------- | --------------------- |
| `Duck extends Airplane` | `Duck extends Animal` |
| Duck NO ES un Airplane  | Duck SÍ ES un Animal  |

**Frase para entrevista:**

> "La herencia es la relación más fuerte entre clases. Usarla incorrectamente crea acoplamiento difícil de romper."

---

### 🔄 Polimorfismo

**Definición:** Objetos de diferentes tipos responden al mismo mensaje de forma diferente.

| Malo                            | Bueno                      |
| ------------------------------- | -------------------------- |
| `switch(type)`                  | `payment.process()`        |
| Agregar tipo = modificar switch | Agregar tipo = nueva clase |

**Frase para entrevista:**

> "Si ves un switch que evalúa tipos, probablemente debería ser polimorfismo."

---

### 🧩 Composición > Herencia

**Definición:** Construir objetos combinando otros objetos (TIENE-UN vs ES-UN).

| Malo                                    | Bueno                           |
| --------------------------------------- | ------------------------------- |
| `CleaningRobot extends Robot`           | `CleaningRobot` tiene `cleaner` |
| Hereda todo, incluso lo que no necesita | Solo tiene lo que necesita      |

**Frase para entrevista:**

> "Favorezco composición sobre herencia porque es más flexible y evita los problemas de herencia múltiple."

---

## 🏛️ SOLID

### 1️⃣ Single Responsibility (SRP)

**Una clase = una razón para cambiar.**

```typescript
// ❌ UserService hace validación, persistencia Y envío de emails
// ✅ UserValidator, UserRepository, EmailService (separados)
```

---

### 🚪 Open/Closed (OCP)

**Abierto a extensión, cerrado a modificación.**

```typescript
// ❌ Agregar descuento = modificar switch existente
// ✅ Agregar descuento = crear nueva clase DiscountStrategy
```

---

### 🔄 Liskov Substitution (LSP)

**Subtipos deben ser sustituibles por sus tipos base.**

```typescript
// ❌ Square extends Rectangle (rompe expectativas)
// ✅ Square implements Shape (ambos son shapes)
```

---

### ✂️ Interface Segregation (ISP)

**Interfaces pequeñas y específicas.**

```typescript
// ❌ interface Worker { work(), eat(), sleep(), fly() }
// ✅ interface Workable, Eatable, Sleepable, Flyable (separadas)
```

---

### ⬆️ Dependency Inversion (DIP)

**Depender de abstracciones, no de implementaciones.**

```typescript
// ❌ class OrderService { db = new MySQLDatabase() }
// ✅ class OrderService { constructor(db: Database) }
```

---

## 🎯 Cómo defender esto en entrevista

### Frase ganadora:

> "Aplico principios de POO y SOLID para reducir acoplamiento y mejorar mantenibilidad. Uso composición sobre herencia, abstracciones para desacoplar, y cada clase tiene una sola responsabilidad."

### Preguntas comunes:

**¿Por qué usar interfaces?**

> "Para desacoplar. El código depende del contrato, no de la implementación. Esto facilita testing y permite cambiar implementaciones sin afectar el resto del código."

**¿Cuándo usar herencia?**

> "Solo cuando hay una relación ES-UN verdadera. Un Pato ES un Animal, entonces puede heredar. Un UserManager NO ES un AuthService, entonces debe usar composición."

**¿Qué es inyección de dependencias?**

> "Pasar las dependencias al constructor en lugar de crearlas internamente. Esto cumple DIP y facilita el testing con mocks."

---

## 📁 Estructura

```
src/poo/
├── principles/          # POO básico
│   ├── encapsulation/   # 🔒 Estado privado vs público
│   ├── abstraction/     # 🎭 Interfaces vs implementaciones
│   ├── inheritance/     # 🌳 Cuándo usar herencia
│   ├── polymorphism/    # 🔄 Eliminar switches
│   └── composition/     # 🧩 Componer vs heredar
│
├── solid/               # Principios SOLID
│   ├── srp/             # 1️⃣ Single Responsibility
│   ├── ocp/             # 🚪 Open/Closed
│   ├── lsp/             # 🔄 Liskov Substitution
│   ├── isp/             # ✂️ Interface Segregation
│   └── dip/             # ⬆️ Dependency Inversion
│
└── README.md            # Esta guía
```

Cada carpeta contiene `bad.ts` y `good.ts` con ejemplos ejecutables.
// ✅ Fácil de testear - dependencias inyectables
test("login", async () => {
const mockAuth = new MockAuthService(true);
const mockStorage = new InMemoryStorageService();
const sessionManager = new SessionManager(mockStorage);

const useCase = new LoginUserUseCase(mockAuth, sessionManager);
const result = await useCase.execute("test@test.com", "123456");

expect(result.success).toBe(true);
expect(sessionManager.isActive()).toBe(true);
});

```

---

## 💬 Cómo Defender Este Repo en Entrevista

### Frase Ganadora

> "Aquí muestro cómo aplicar principios de POO para **reducir acoplamiento** y **mejorar mantenibilidad**, usando **composición** y **abstracción** en lugar de herencia innecesaria."

### Puntos Clave

1. **Encapsulamiento**: "El estado privado previene modificaciones accidentales y permite validación"

2. **Abstracción**: "Las interfaces permiten cambiar implementaciones sin afectar consumidores"

3. **Bajo Acoplamiento**: "La inyección de dependencias permite testing y flexibilidad"

4. **Composición**: "LoginUserUseCase TIENE un AuthService, no ES un AuthService"

### Preguntas Típicas

**P**: ¿Por qué tantas clases para un simple login?

**R**: Cada clase tiene una responsabilidad única:

- `AuthService`: autenticar (validar credenciales)
- `SessionManager`: mantener sesión (estado)
- `StorageService`: persistir (localStorage)
- `LoginUserUseCase`: coordinar (flujo)

Esto permite testear, modificar y reutilizar cada pieza independientemente.

---

**P**: ¿Esto no es over-engineering para un proyecto pequeño?

**R**: Es educativo. En un proyecto real, la complejidad justifica la separación cuando:

- Hay múltiples formas de autenticar (OAuth, JWT, etc.)
- El storage puede cambiar (localStorage, cookies, backend)
- Se necesitan tests unitarios
- Múltiples desarrolladores trabajan en el código

---

**P**: ¿Por qué interfaces si TypeScript tiene duck typing?

**R**: Las interfaces:

1. Documentan el contrato explícitamente
2. Permiten autocomplete en IDEs
3. Fuerzan implementación correcta en compile-time
4. Facilitan búsqueda de implementaciones

---

## 📚 Recursos Adicionales

- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Composition over Inheritance](https://en.wikipedia.org/wiki/Composition_over_inheritance)
- [Dependency Injection](https://en.wikipedia.org/wiki/Dependency_injection)

---

## ✅ Checklist de Revisión

Antes de tu entrevista, verifica:

### Diseño

- [ ] ¿La UI solo consume resultados?
- [ ] ¿La lógica está fuera de React?
- [ ] ¿Se entiende claramente bad vs good?

### POO

- [ ] ¿Hay encapsulamiento real (private)?
- [ ] ¿Las interfaces desacoplan?
- [ ] ¿Se usa composición donde corresponde?
- [ ] ¿Herencia solo cuando tiene sentido?

### Documentación

- [ ] ¿Puedo explicarlo sin leer código?
- [ ] ¿Sirve para justificar decisiones?

---

_Creado para demostrar principios de POO en entrevistas técnicas._
```
