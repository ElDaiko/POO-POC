# 🎓 POO & SOLID Explorer

> Repositorio educativo interactivo para aprender Programación Orientada a Objetos y principios SOLID en TypeScript.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)

## 🎯 ¿Para qué sirve este proyecto?

Este repositorio está diseñado para:

- ✅ **Preparar exámenes técnicos** - Ejemplos claros que puedes ejecutar y modificar
- ✅ **Entrevistas frontend/fullstack** - Frases y conceptos listos para defender
- ✅ **Aprender haciendo** - Código interactivo, no solo teoría

## 🚀 Quick Start

```bash
# Clonar el repositorio
git clone <tu-repo>
cd POO-POC

# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo
npm run dev
```

Abre **http://localhost:5173** y explora los ejemplos interactivos.

---

## 📦 ¿Qué vas a aprender?

### POO Básico

| Principio              | Concepto clave                         | Ejemplo                          |
| ---------------------- | -------------------------------------- | -------------------------------- |
| 🔒 **Encapsulamiento** | Estado privado, acceso controlado      | `private _balance` + getters     |
| 🎭 **Abstracción**     | Interfaces definen QUÉ, no CÓMO        | `NotificationService` interfaz   |
| 🌳 **Herencia**        | Solo cuando hay relación ES-UN         | `Duck extends Animal` ✓          |
| 🔄 **Polimorfismo**    | Mismo método, diferente comportamiento | `payment.process()`              |
| 🧩 **Composición**     | TIENE-UN en lugar de ES-UN             | Robot tiene `cleaner`, `speaker` |

### SOLID

| Principio | Descripción                    | Anti-patrón                             |
| --------- | ------------------------------ | --------------------------------------- |
| **S**RP   | Una clase, una responsabilidad | Clase que valida, guarda y envía emails |
| **O**CP   | Extender sin modificar         | Agregar tipo = modificar switch         |
| **L**SP   | Subtipos sustituibles          | Square hereda de Rectangle              |
| **I**SP   | Interfaces pequeñas            | Interface con 10 métodos                |
| **D**IP   | Depender de abstracciones      | `new MySQLDatabase()` dentro de clase   |

---

## 🖥️ Capturas

La aplicación incluye:

- **Tabs para navegar** entre POO y SOLID
- **Código fuente visible** junto a cada ejemplo
- **Botón "Ejecutar"** para ver el resultado en tiempo real
- **Tips para entrevistas** en cada principio

---

## 📁 Estructura del Proyecto

```
src/
├── components/
│   └── POOExplorer.tsx      # 🖥️ Componente principal interactivo
│
└── poo/
    ├── principles/          # 📦 POO Básico
    │   ├── encapsulation/   #   🔒 bad.ts + good.ts
    │   ├── abstraction/     #   🎭 bad.ts + good.ts
    │   ├── inheritance/     #   🌳 bad.ts + good.ts
    │   ├── polymorphism/    #   🔄 bad.ts + good.ts
    │   └── composition/     #   🧩 bad.ts + good.ts
    │
    ├── solid/               # 🏛️ Principios SOLID
    │   ├── srp/             #   1️⃣ Single Responsibility
    │   ├── ocp/             #   🚪 Open/Closed
    │   ├── lsp/             #   🔄 Liskov Substitution
    │   ├── isp/             #   ✂️ Interface Segregation
    │   └── dip/             #   ⬆️ Dependency Inversion
    │
    └── README.md            # 📚 Guía detallada con frases para entrevistas
```

Cada carpeta contiene:

- `bad.ts` - ❌ Anti-patrón con comentarios explicando el problema
- `good.ts` - ✅ Solución correcta con explicación

---

## 💡 Frases para tu entrevista

### Pregunta: "¿Por qué usar interfaces?"

> "Para desacoplar el código. Así dependo del contrato, no de la implementación. Esto facilita testing con mocks y permite cambiar implementaciones sin afectar el resto del sistema."

### Pregunta: "¿Cuándo usar herencia vs composición?"

> "Herencia solo cuando hay relación ES-UN verdadera. Un Pato ES un Animal. Pero un Robot de limpieza NO ES un Robot que habla, entonces uso composición: el robot TIENE un módulo de limpieza."

### Pregunta: "¿Qué es el principio Open/Closed?"

> "Que el código esté abierto a extensión pero cerrado a modificación. Si para agregar un nuevo tipo de pago tengo que modificar un switch existente, estoy violando OCP. La solución es polimorfismo."

### Frase ganadora general:

> "Aplico POO y SOLID para reducir acoplamiento y mejorar mantenibilidad. Uso composición sobre herencia, abstracciones para desacoplar, y cada clase tiene una sola responsabilidad."

---

## 🧪 Cómo estudiar con este repo

1. **Abre la app** (`npm run dev`)
2. **Selecciona un principio** (ej: Encapsulamiento)
3. **Lee el código malo** - entiende qué está mal
4. **Lee el código bueno** - entiende la solución
5. **Ejecuta ambos** - observa la diferencia en el resultado
6. **Lee el tip de entrevista** - practica explicarlo en voz alta
7. **Modifica el código** - experimenta para entender mejor

---

## 📚 Recursos adicionales

- [src/poo/README.md](src/poo/README.md) - Guía completa con más ejemplos de código
- Cada archivo `.ts` tiene comentarios detallados explicando el "por qué"

---

## 🤝 Contribuir

¿Encontraste un error o quieres agregar más ejemplos? ¡Los PRs son bienvenidos!

---

## 📄 Licencia

MIT - Usa este código como quieras para aprender y enseñar.
