/**
 * POO Explorer - Componente interactivo con tabs para explorar principios
 */

import React, { useState } from "react";

// Importar demos de POO
import { demoBad as encapBad } from "../poo/principles/encapsulation/bad";
import { demoGood as encapGood } from "../poo/principles/encapsulation/good";
import { demoBad as absBad } from "../poo/principles/abstraction/bad";
import { demoGood as absGood } from "../poo/principles/abstraction/good";
import { demoBad as inhBad } from "../poo/principles/inheritance/bad";
import { demoGood as inhGood } from "../poo/principles/inheritance/good";
import { demoBad as polyBad } from "../poo/principles/polymorphism/bad";
import { demoGood as polyGood } from "../poo/principles/polymorphism/good";
import { demoBad as compBad } from "../poo/principles/composition/bad";
import { demoGood as compGood } from "../poo/principles/composition/good";

// Importar demos de SOLID
import { demoBad as srpBad } from "../poo/solid/srp/bad";
import { demoGood as srpGood } from "../poo/solid/srp/good";
import { demoBad as ocpBad } from "../poo/solid/ocp/bad";
import { demoGood as ocpGood } from "../poo/solid/ocp/good";
import { demoBad as lspBad } from "../poo/solid/lsp/bad";
import { demoGood as lspGood } from "../poo/solid/lsp/good";
import { demoBad as ispBad } from "../poo/solid/isp/bad";
import { demoGood as ispGood } from "../poo/solid/isp/good";
import { demoBad as dipBad } from "../poo/solid/dip/bad";
import { demoGood as dipGood } from "../poo/solid/dip/good";

// Tipos
interface CodeExample {
  title: string;
  code: string;
  explanation: string;
}

interface PrincipleInfo {
  id: string;
  name: string;
  shortName: string;
  emoji: string;
  description: string;
  badDemo: () => string[] | Promise<string[]>;
  goodDemo: () => string[] | Promise<string[]>;
  badCode: CodeExample;
  goodCode: CodeExample;
  keyPoints: string[];
  interviewTip: string;
}

// Datos de principios POO
const pooPrinciples: PrincipleInfo[] = [
  {
    id: "encapsulation",
    name: "Encapsulamiento",
    shortName: "Encap",
    emoji: "🔒",
    description:
      "Ocultar el estado interno y exponer solo métodos controlados para modificarlo.",
    badDemo: encapBad,
    goodDemo: encapGood,
    badCode: {
      title: "❌ Estado público - cualquiera puede modificarlo",
      code: `class BankAccountBad {
  // ❌ Propiedades públicas
  public balance: number = 0;
  public accountNumber: string = "";
}

// ❌ PROBLEMA: Modificación directa sin validación
const account = new BankAccountBad();
account.balance = 1000000;  // ¡Hackeado!
account.balance = -500;     // ¡Balance negativo!`,
      explanation:
        "Cualquier parte del código puede modificar el balance directamente, sin validación. Esto permite estados inválidos como balances negativos o modificaciones no autorizadas.",
    },
    goodCode: {
      title: "✅ Estado privado con métodos controlados",
      code: `class BankAccountGood {
  // ✅ Estado privado
  private _balance: number;

  // ✅ Getter de solo lectura
  get balance(): number {
    return this._balance;
  }

  // ✅ Método con validación
  withdraw(amount: number): Result {
    if (amount > this._balance) {
      return { success: false, message: "Fondos insuficientes" };
    }
    this._balance -= amount;
    return { success: true };
  }
}`,
      explanation:
        "El balance solo puede cambiar a través de métodos que validan la operación. Imposible hackear o crear estados inválidos.",
    },
    keyPoints: [
      "Estado privado (private)",
      "Getters para acceso controlado",
      "Métodos que validan antes de modificar",
      "Protección contra modificaciones externas",
    ],
    interviewTip:
      "El encapsulamiento protege la integridad de los datos. Sin él, cualquier parte del código puede corromper el estado de un objeto.",
  },
  {
    id: "abstraction",
    name: "Abstracción",
    shortName: "Abstr",
    emoji: "🎭",
    description: "Exponer QUÉ hace un objeto, ocultando CÓMO lo hace.",
    badDemo: absBad,
    goodDemo: absGood,
    badCode: {
      title: "❌ El cliente conoce TODOS los detalles",
      code: `class EmailSenderBad {
  public smtpServer = "smtp.gmail.com";
  public port = 587;
  
  connect(): void { /* ... */ }
  authenticate(): void { /* ... */ }
  formatMessage(to, subject, body): string { /* ... */ }
  sendRaw(message: string): void { /* ... */ }
  disconnect(): void { /* ... */ }
}

// ❌ El cliente hace TODO el trabajo
sender.connect();
sender.authenticate();
const msg = sender.formatMessage(to, subject, body);
sender.sendRaw(msg);
sender.disconnect();`,
      explanation:
        "El código cliente necesita conocer el protocolo SMTP completo. Si cambias a SendGrid, debes reescribir TODO el código que usa esta clase.",
    },
    goodCode: {
      title: "✅ Interfaz simple, detalles ocultos",
      code: `// ✅ Interfaz define QUÉ, no CÓMO
interface NotificationService {
  send(to: string, subject: string, message: string): Promise<Result>;
}

// ✅ Implementación oculta los detalles
class EmailService implements NotificationService {
  async send(to, subject, message) {
    // Toda la complejidad SMTP está OCULTA aquí
    return { success: true };
  }
}

// ✅ El cliente solo conoce la interfaz
const service: NotificationService = new EmailService();
await service.send("user@email.com", "Hola", "Mensaje");
// ¡Puedo cambiar a SMSService sin cambiar este código!`,
      explanation:
        "El cliente solo conoce el método 'send'. Puedes cambiar de Email a SMS o Push sin modificar el código que consume el servicio.",
    },
    keyPoints: [
      "Interfaces definen contratos",
      "Implementaciones ocultan detalles",
      "El cliente no conoce el 'cómo'",
      "Facilita cambiar implementaciones",
    ],
    interviewTip:
      "La abstracción permite trabajar con conceptos de alto nivel sin preocuparse por detalles de implementación.",
  },
  {
    id: "inheritance",
    name: "Herencia",
    shortName: "Heren",
    emoji: "🌳",
    description:
      "Crear nuevas clases basadas en clases existentes. Usar SOLO cuando hay relación 'es-un'.",
    badDemo: inhBad,
    goodDemo: inhGood,
    badCode: {
      title: "❌ Herencia sin relación 'ES-UN'",
      code: `// ❌ Clase base con comportamiento específico de aviones
class Airplane {
  fuel: number = 100;
  startEngine(): void { /* turbina */ }
  refuel(): void { /* combustible */ }
}

// ❌ MAL: Duck hereda de Airplane porque ambos "vuelan"
class Duck extends Airplane {
  quack() { return "Cuack!"; }
  
  // ❌ ¿Motor en un pato?
  startEngine() { return "Agitando alas..."; }
  
  // ❌ ¿Repostar un pato?
  refuel() { return "Comiendo pan...?"; }
}

// ❌ Un pato tiene "fuel" heredado - absurdo
const duck = new Duck();
console.log(duck.fuel); // 100 ¿?`,
      explanation:
        "Un Pato NO ES un Avión. Heredar solo porque ambos 'vuelan' fuerza al Pato a tener propiedades absurdas como combustible y motor.",
    },
    goodCode: {
      title: "✅ Herencia solo cuando ES-UN es verdadero",
      code: `// ✅ Interfaz para capacidad de volar
interface Flyable {
  fly(): string;
}

// ✅ Clase base correcta
abstract class Animal {
  abstract makeSound(): string;
  eat(food: string): void { /* ... */ }
}

// ✅ Duck ES un Animal (correcto)
class Duck extends Animal implements Flyable {
  makeSound() { return "Cuack!"; }
  fly() { return "Volando bajo sobre el estanque"; }
}

// ✅ Airplane NO hereda de Animal - es independiente
class Airplane implements Flyable {
  fly() { return "Volando a 10,000m"; }
  refuel() { /* solo aviones */ }
}`,
      explanation:
        "Duck ES un Animal (herencia correcta). Duck y Airplane PUEDEN volar (interfaz compartida), pero no tienen relación de herencia entre sí.",
    },
    keyPoints: [
      "Solo usar cuando hay relación ES-UN",
      "Un Pato ES un Animal ✓",
      "Un Pato NO ES un Avión ✗",
      "Preferir composición cuando no hay relación clara",
    ],
    interviewTip:
      "La herencia es la relación más fuerte entre clases. Usarla incorrectamente crea acoplamiento difícil de romper.",
  },
  {
    id: "polymorphism",
    name: "Polimorfismo",
    shortName: "Polim",
    emoji: "🔄",
    description:
      "Objetos de diferentes tipos responden al mismo mensaje de forma diferente.",
    badDemo: polyBad,
    goodDemo: polyGood,
    badCode: {
      title: "❌ Switch gigante por cada tipo",
      code: `class PaymentProcessor {
  process(type: string, amount: number) {
    // ❌ Switch que crece con cada nuevo tipo
    switch (type) {
      case "credit":
        return this.processCreditCard(amount);
      case "debit":
        return this.processDebitCard(amount);
      case "paypal":
        return this.processPayPal(amount);
      // ❌ Para agregar "crypto" hay que:
      // 1. Agregar otro case aquí
      // 2. Crear nuevo método privado
      // 3. Modificar TODOS los switch similares
    }
  }
}`,
      explanation:
        "Cada nuevo tipo de pago requiere modificar esta clase. Si hay 10 lugares con switch similares, debes modificar los 10.",
    },
    goodCode: {
      title: "✅ Cada tipo es una clase con el mismo contrato",
      code: `// ✅ Interfaz común
interface PaymentMethod {
  process(amount: number): string;
  calculateFee(amount: number): number;
}

// ✅ Cada tipo es una clase independiente
class CreditCard implements PaymentMethod {
  process(amount) { return \`Tarjeta: $\${amount}\`; }
  calculateFee(amount) { return amount * 0.03; }
}

class PayPal implements PaymentMethod {
  process(amount) { return \`PayPal: $\${amount}\`; }
  calculateFee(amount) { return amount * 0.04; }
}

// ✅ Agregar Crypto = solo crear nueva clase
class Crypto implements PaymentMethod {
  process(amount) { return \`Crypto: $\${amount}\`; }
  calculateFee(amount) { return amount * 0.01; }
}

// ✅ Código cliente NO cambia nunca
function checkout(method: PaymentMethod, amount: number) {
  return method.process(amount);
}`,
      explanation:
        "Agregar un nuevo tipo de pago = crear una nueva clase. El código existente NUNCA se modifica. Esto es Open/Closed Principle.",
    },
    keyPoints: [
      "Mismo método, diferentes comportamientos",
      "Elimina switch/if por tipos",
      "Agregar tipos = crear clases, no modificar",
      "Habilita Open/Closed Principle",
    ],
    interviewTip:
      "Si ves un switch que evalúa tipos de objetos, probablemente debería ser polimorfismo.",
  },
  {
    id: "composition",
    name: "Composición > Herencia",
    shortName: "Comp",
    emoji: "🧩",
    description:
      "Construir objetos combinando otros objetos en lugar de heredar.",
    badDemo: compBad,
    goodDemo: compGood,
    badCode: {
      title: "❌ Herencia para compartir código",
      code: `class Robot {
  battery = 100;
  move() { /* ... */ }
  speak() { /* ... */ }  // No todos los robots hablan
}

// ❌ Hereda TODO aunque solo necesita moverse
class CleaningRobot extends Robot {
  clean() { /* ... */ }
  // Hereda speak() pero no lo necesita
}

// ❌ ¿Robot que vuela Y limpia?
// No puedo heredar de dos clases
class FlyingRobot extends Robot { fly() {} }
// class FlyingCleaningRobot extends CleaningRobot, FlyingRobot {} 
// ❌ ERROR: TypeScript no permite herencia múltiple`,
      explanation:
        "La herencia crea jerarquías rígidas. No puedes combinar capacidades libremente y heredas métodos que no necesitas.",
    },
    goodCode: {
      title: "✅ Componer capacidades según necesidad",
      code: `// ✅ Capacidades como interfaces/clases pequeñas
interface CleaningCapability {
  clean(): string;
}
interface FlightCapability {
  fly(): string;
}

class VacuumCleaner implements CleaningCapability {
  clean() { return "Aspirando..."; }
}
class Propellers implements FlightCapability {
  fly() { return "Volando..."; }
}

// ✅ Robot compuesto con SOLO lo que necesita
class CleaningRobot {
  constructor(private cleaner: CleaningCapability) {}
  clean() { return this.cleaner.clean(); }
  // NO tiene fly() - correcto
}

// ✅ ¡Fácil combinar capacidades!
class FlyingCleaningRobot {
  constructor(
    private cleaner: CleaningCapability,
    private flyer: FlightCapability
  ) {}
  clean() { return this.cleaner.clean(); }
  fly() { return this.flyer.fly(); }
}`,
      explanation:
        "Cada robot tiene exactamente las capacidades que necesita. Puedes combinar cualquier conjunto de capacidades sin limitaciones de herencia.",
    },
    keyPoints: [
      "TIENE-UN en lugar de ES-UN",
      "Más flexible que herencia",
      "Combina capacidades libremente",
      "Evita jerarquías rígidas",
    ],
    interviewTip:
      "Favorece composición sobre herencia. Es más flexible y evita los problemas de herencia múltiple.",
  },
];

// Datos de principios SOLID
const solidPrinciples: PrincipleInfo[] = [
  {
    id: "srp",
    name: "Single Responsibility (SRP)",
    shortName: "SRP",
    emoji: "1️⃣",
    description: "Una clase debe tener una sola razón para cambiar.",
    badDemo: srpBad,
    goodDemo: srpGood,
    badCode: {
      title: "❌ Una clase hace TODO",
      code: `class UserService {
  async registerUser(email: string, password: string) {
    // ❌ Responsabilidad 1: Validación
    if (!email.includes("@")) throw new Error("Email inválido");
    
    // ❌ Responsabilidad 2: Persistencia
    await database.save({ email, password });
    
    // ❌ Responsabilidad 3: Envío de email
    await smtp.send(email, "Bienvenido!");
    
    // ❌ Responsabilidad 4: Logging
    logger.log(\`Usuario \${email} registrado\`);
    
    // ❌ Responsabilidad 5: Métricas
    analytics.track("user_registered");
  }
}
// Si cambia cómo se envían emails, hay que modificar UserService`,
      explanation:
        "Esta clase tiene 5 razones para cambiar. Si cambia la validación, el email, la BD, el logging o las métricas, hay que modificar esta clase.",
    },
    goodCode: {
      title: "✅ Cada clase hace UNA cosa",
      code: `// ✅ Cada clase tiene UNA responsabilidad
class UserValidator {
  validate(email: string, password: string): Result { /* solo valida */ }
}

class UserRepository {
  save(user: User): void { /* solo persiste */ }
}

class WelcomeEmailSender {
  send(email: string): void { /* solo envía emails */ }
}

// ✅ Servicio que COORDINA (no hace el trabajo)
class UserRegistrationService {
  constructor(
    private validator: UserValidator,
    private repository: UserRepository,
    private emailSender: WelcomeEmailSender
  ) {}
  
  async register(email: string, password: string) {
    this.validator.validate(email, password);
    await this.repository.save({ email, password });
    await this.emailSender.send(email);
  }
}`,
      explanation:
        "Si cambia cómo se envían emails, solo modificas WelcomeEmailSender. Las demás clases no se tocan.",
    },
    keyPoints: [
      "Una clase = una responsabilidad",
      "Separar validación, persistencia, notificación",
      "Clases pequeñas y enfocadas",
      "Fácil de testear y mantener",
    ],
    interviewTip:
      "Si describes una clase usando 'Y' (valida Y guarda Y envía email), probablemente viola SRP.",
  },
  {
    id: "ocp",
    name: "Open/Closed (OCP)",
    shortName: "OCP",
    emoji: "🚪",
    description: "Abierto para extensión, cerrado para modificación.",
    badDemo: ocpBad,
    goodDemo: ocpGood,
    badCode: {
      title: "❌ Modificar código existente para agregar tipos",
      code: `class DiscountCalculator {
  calculate(type: string, price: number): number {
    switch (type) {
      case "percentage":
        return price * 0.9;
      case "fixed":
        return price - 10;
      case "bogo":
        return price / 2;
      // ❌ Para agregar "seasonal":
      // 1. Abrir esta clase
      // 2. Agregar nuevo case
      // 3. Re-testear TODO
      // 4. Riesgo de romper casos existentes
    }
  }
}`,
      explanation:
        "Cada nuevo tipo de descuento requiere MODIFICAR esta clase. Riesgo de introducir bugs en código que ya funcionaba.",
    },
    goodCode: {
      title: "✅ Extender sin modificar",
      code: `// ✅ Interfaz para estrategias
interface DiscountStrategy {
  apply(price: number): number;
}

// ✅ Cada descuento es una clase
class PercentageDiscount implements DiscountStrategy {
  apply(price: number) { return price * 0.9; }
}

class FixedDiscount implements DiscountStrategy {
  apply(price: number) { return price - 10; }
}

// ✅ NUEVO descuento = NUEVA clase (no modificar nada)
class SeasonalDiscount implements DiscountStrategy {
  apply(price: number) { return price * 0.75; }
}

// ✅ Calculator NUNCA cambia
class DiscountCalculator {
  calculate(strategy: DiscountStrategy, price: number) {
    return strategy.apply(price);
  }
}`,
      explanation:
        "Agregar SeasonalDiscount no requiere tocar el código existente. Solo creas una nueva clase.",
    },
    keyPoints: [
      "Agregar funcionalidad sin modificar código existente",
      "Usar interfaces y polimorfismo",
      "Nuevos tipos = nuevas clases",
      "El código existente no cambia",
    ],
    interviewTip:
      "Si agregar un nuevo tipo requiere modificar switch/if existentes, estás violando OCP.",
  },
  {
    id: "lsp",
    name: "Liskov Substitution (LSP)",
    shortName: "LSP",
    emoji: "🔄",
    description: "Los subtipos deben ser sustituibles por sus tipos base.",
    badDemo: lspBad,
    goodDemo: lspGood,
    badCode: {
      title: "❌ Subtipo que rompe el comportamiento esperado",
      code: `class Rectangle {
  protected width: number;
  protected height: number;
  
  setWidth(w: number) { this.width = w; }
  setHeight(h: number) { this.height = h; }
  getArea() { return this.width * this.height; }
}

// ❌ Square hereda de Rectangle pero VIOLA el contrato
class Square extends Rectangle {
  // ❌ Efecto secundario inesperado
  setWidth(w: number) {
    this.width = w;
    this.height = w;  // ¡También cambia height!
  }
  setHeight(h: number) {
    this.width = h;   // ¡También cambia width!
    this.height = h;
  }
}

// ❌ Este código FALLA con Square
function testRectangle(r: Rectangle) {
  r.setWidth(5);
  r.setHeight(4);
  console.log(r.getArea()); // Esperado: 20
}
testRectangle(new Rectangle()); // ✅ 20
testRectangle(new Square());    // ❌ 16 ¡SORPRESA!`,
      explanation:
        "Square no puede sustituir a Rectangle porque cambia el comportamiento esperado. setWidth no debería afectar height.",
    },
    goodCode: {
      title: "✅ Cada tipo cumple su contrato sin sorpresas",
      code: `// ✅ Abstracción común que ambos cumplen
interface Shape {
  getArea(): number;
}

// ✅ Rectangle y Square son HERMANOS, no padre-hijo
class Rectangle implements Shape {
  constructor(
    private width: number,
    private height: number
  ) {}
  getArea() { return this.width * this.height; }
}

class Square implements Shape {
  constructor(private side: number) {}
  getArea() { return this.side * this.side; }
}

// ✅ Cualquier Shape funciona correctamente
function printArea(shape: Shape) {
  console.log(shape.getArea()); // Siempre correcto
}

printArea(new Rectangle(5, 4)); // 20 ✅
printArea(new Square(4));       // 16 ✅`,
      explanation:
        "Rectangle y Square implementan Shape independientemente. No hay herencia problemática entre ellos.",
    },
    keyPoints: [
      "Subclases no deben romper comportamiento del padre",
      "Si B hereda de A, donde uses A puedes usar B",
      "Square no debe heredar de Rectangle",
      "Contratos deben cumplirse",
    ],
    interviewTip:
      "El clásico ejemplo es Rectangle/Square. Un Square NO puede sustituir a Rectangle sin romper expectativas.",
  },
  {
    id: "isp",
    name: "Interface Segregation (ISP)",
    shortName: "ISP",
    emoji: "✂️",
    description: "Interfaces pequeñas y específicas, no interfaces 'gordas'.",
    badDemo: ispBad,
    goodDemo: ispGood,
    badCode: {
      title: "❌ Interfaz 'gorda' que obliga a implementar todo",
      code: `// ❌ Interfaz gigante
interface Worker {
  work(): void;
  eat(): void;
  sleep(): void;
  attendMeeting(): void;
  drinkCoffee(): void;
}

// ❌ Robot DEBE implementar TODO aunque no aplique
class Robot implements Worker {
  work() { /* ok */ }
  
  // ❌ Un robot NO come
  eat() { throw new Error("Robots don't eat"); }
  
  // ❌ Un robot NO duerme
  sleep() { throw new Error("Robots don't sleep"); }
  
  // ❌ Métodos forzados que no tienen sentido
  drinkCoffee() { throw new Error("No coffee for robots"); }
  
  attendMeeting() { /* ok */ }
}`,
      explanation:
        "Robot está obligado a implementar métodos que no tienen sentido. Lanza excepciones en métodos que no debería tener.",
    },
    goodCode: {
      title: "✅ Interfaces pequeñas por capacidad",
      code: `// ✅ Interfaces segregadas
interface Workable {
  work(): void;
}

interface Eatable {
  eat(): void;
}

interface Sleepable {
  sleep(): void;
}

// ✅ Humano implementa lo que necesita
class Developer implements Workable, Eatable, Sleepable {
  work() { /* código */ }
  eat() { /* pizza */ }
  sleep() { /* poco */ }
}

// ✅ Robot implementa SOLO lo que aplica
class Robot implements Workable {
  work() { /* procesar */ }
  // NO tiene eat() ni sleep() - ¡correcto!
}

// ✅ TypeScript previene errores
function feedWorker(worker: Eatable) {
  worker.eat();
}
feedWorker(new Developer()); // ✅ OK
// feedWorker(new Robot());  // ❌ Error de compilación`,
      explanation:
        "Robot solo implementa Workable. No está forzado a implementar métodos que no aplican. TypeScript previene errores.",
    },
    keyPoints: [
      "Muchas interfaces pequeñas > una grande",
      "Clientes no dependen de métodos que no usan",
      "Interfaces por capacidad/rol",
      "Más flexibilidad de implementación",
    ],
    interviewTip:
      "Si una clase implementa métodos vacíos o que lanzan 'NotImplemented', la interfaz es muy grande.",
  },
  {
    id: "dip",
    name: "Dependency Inversion (DIP)",
    shortName: "DIP",
    emoji: "⬆️",
    description: "Depender de abstracciones, no de implementaciones concretas.",
    badDemo: dipBad,
    goodDemo: dipGood,
    badCode: {
      title: "❌ Dependencias concretas internas",
      code: `class OrderService {
  // ❌ Crea sus propias dependencias
  private database = new MySQLDatabase();
  private emailSender = new SmtpEmailSender();
  
  createOrder(email: string, items: string[]) {
    // ❌ Acoplado a MySQL específicamente
    this.database.save("orders", { items });
    
    // ❌ Acoplado a SMTP específicamente
    this.emailSender.send(email, "Orden creada");
  }
}

// ❌ Problemas:
// - ¿Cambiar a PostgreSQL? Modificar OrderService
// - ¿Cambiar a SendGrid? Modificar OrderService
// - ¿Testing? Imposible sin BD y SMTP reales`,
      explanation:
        "OrderService está soldado a MySQL y SMTP. Para cambiar cualquiera, debes modificar la clase. Imposible testear sin infraestructura real.",
    },
    goodCode: {
      title: "✅ Dependencias inyectadas como abstracciones",
      code: `// ✅ Interfaces (abstracciones)
interface Database {
  save(table: string, data: object): void;
}

interface EmailSender {
  send(to: string, subject: string): void;
}

// ✅ Depende de abstracciones, no implementaciones
class OrderService {
  constructor(
    private database: Database,      // Interfaz
    private emailSender: EmailSender // Interfaz
  ) {}
  
  createOrder(email: string, items: string[]) {
    this.database.save("orders", { items });
    this.emailSender.send(email, "Orden creada");
  }
}

// ✅ Producción
new OrderService(new MySQLDatabase(), new SmtpSender());

// ✅ Testing (sin BD ni SMTP real)
new OrderService(new MockDatabase(), new MockEmailSender());

// ✅ Cambiar a PostgreSQL - solo cambiar instanciación
new OrderService(new PostgreSQLDatabase(), new SmtpSender());`,
      explanation:
        "OrderService no sabe qué BD o email usa. Puedes inyectar MySQL, PostgreSQL o un Mock sin modificar la clase.",
    },
    keyPoints: [
      "Alto nivel no depende de bajo nivel",
      "Ambos dependen de abstracciones",
      "Inyección de dependencias",
      "Facilita testing con mocks",
    ],
    interviewTip:
      "Si una clase hace 'new' de sus dependencias internamente, viola DIP. Inyecta las dependencias.",
  },
];

// Estilos
const styles = {
  container: {
    fontFamily: "system-ui, -apple-system, sans-serif",
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "20px",
    backgroundColor: "#f8f9fa",
    minHeight: "100vh",
  },
  header: {
    textAlign: "center" as const,
    marginBottom: "30px",
    padding: "20px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    borderRadius: "12px",
    color: "white",
  },
  title: {
    margin: "0 0 10px 0",
    fontSize: "28px",
  },
  subtitle: {
    margin: 0,
    opacity: 0.9,
    fontSize: "14px",
  },
  categoryTabs: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "20px",
  },
  categoryTab: {
    padding: "12px 24px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600" as const,
    transition: "all 0.2s",
  },
  categoryTabActive: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
  },
  categoryTabInactive: {
    backgroundColor: "#e9ecef",
    color: "#495057",
  },
  principlesNav: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "8px",
    justifyContent: "center",
    marginBottom: "20px",
  },
  principleTab: {
    padding: "8px 16px",
    border: "2px solid #dee2e6",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "500" as const,
    transition: "all 0.2s",
    backgroundColor: "white",
  },
  principleTabActive: {
    borderColor: "#667eea",
    backgroundColor: "#667eea",
    color: "white",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    marginBottom: "20px",
  },
  principleHeader: {
    marginBottom: "20px",
  },
  principleName: {
    fontSize: "24px",
    margin: "0 0 8px 0",
    color: "#333",
  },
  principleDesc: {
    color: "#666",
    margin: 0,
    fontSize: "15px",
  },
  keyPointsList: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "10px",
    marginBottom: "20px",
  },
  keyPoint: {
    padding: "8px 12px",
    backgroundColor: "#e8f4f8",
    borderRadius: "6px",
    fontSize: "13px",
    color: "#2c5282",
  },
  interviewTip: {
    padding: "12px 16px",
    backgroundColor: "#fff3cd",
    borderRadius: "8px",
    borderLeft: "4px solid #ffc107",
    fontSize: "13px",
    color: "#856404",
    marginBottom: "20px",
  },
  demoContainer: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  },
  demoCard: {
    borderRadius: "8px",
    overflow: "hidden",
  },
  demoHeader: {
    padding: "12px 16px",
    fontWeight: "600" as const,
    fontSize: "14px",
  },
  demoBadHeader: {
    backgroundColor: "#f8d7da",
    color: "#721c24",
  },
  demoGoodHeader: {
    backgroundColor: "#d4edda",
    color: "#155724",
  },
  demoContent: {
    padding: "16px",
    backgroundColor: "#1e1e1e",
    color: "#d4d4d4",
    fontSize: "12px",
    fontFamily: "Consolas, Monaco, 'Courier New', monospace",
    minHeight: "300px",
    maxHeight: "600px",
    overflow: "auto",
  },
  runButton: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500" as const,
    marginTop: "12px",
    transition: "all 0.2s",
  },
  runButtonBad: {
    backgroundColor: "#dc3545",
    color: "white",
  },
  runButtonGood: {
    backgroundColor: "#28a745",
    color: "white",
  },
  output: {
    marginTop: "10px",
    padding: "12px",
    backgroundColor: "#2d2d2d",
    borderRadius: "4px",
    fontSize: "11px",
    lineHeight: "1.6",
  },
};

// Componente principal
export const POOExplorer: React.FC = () => {
  const [category, setCategory] = useState<"poo" | "solid">("poo");
  const [selectedPrinciple, setSelectedPrinciple] =
    useState<string>("encapsulation");
  const [badOutput, setBadOutput] = useState<string[]>([]);
  const [goodOutput, setGoodOutput] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<{ bad: boolean; good: boolean }>({
    bad: false,
    good: false,
  });

  const principles = category === "poo" ? pooPrinciples : solidPrinciples;
  const currentPrinciple =
    principles.find((p) => p.id === selectedPrinciple) || principles[0];

  const handleCategoryChange = (newCategory: "poo" | "solid") => {
    setCategory(newCategory);
    setSelectedPrinciple(newCategory === "poo" ? "encapsulation" : "srp");
    setBadOutput([]);
    setGoodOutput([]);
  };

  const handlePrincipleChange = (principleId: string) => {
    setSelectedPrinciple(principleId);
    setBadOutput([]);
    setGoodOutput([]);
  };

  const runDemo = async (type: "bad" | "good") => {
    setIsLoading((prev) => ({ ...prev, [type]: true }));

    try {
      const demo =
        type === "bad" ? currentPrinciple.badDemo : currentPrinciple.goodDemo;
      const result = await demo();

      if (type === "bad") {
        setBadOutput(result);
      } else {
        setGoodOutput(result);
      }
    } catch (error) {
      const errorMsg = [`Error: ${error}`];
      if (type === "bad") {
        setBadOutput(errorMsg);
      } else {
        setGoodOutput(errorMsg);
      }
    }

    setIsLoading((prev) => ({ ...prev, [type]: false }));
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.title}>🎓 POO & SOLID Explorer</h1>
        <p style={styles.subtitle}>
          Aprende principios de Programación Orientada a Objetos con ejemplos
          interactivos
        </p>
      </header>

      {/* Category Tabs */}
      <div style={styles.categoryTabs}>
        <button
          style={{
            ...styles.categoryTab,
            ...(category === "poo"
              ? styles.categoryTabActive
              : styles.categoryTabInactive),
          }}
          onClick={() => handleCategoryChange("poo")}
        >
          📦 POO Básico
        </button>
        <button
          style={{
            ...styles.categoryTab,
            ...(category === "solid"
              ? styles.categoryTabActive
              : styles.categoryTabInactive),
          }}
          onClick={() => handleCategoryChange("solid")}
        >
          🏛️ SOLID
        </button>
      </div>

      {/* Principles Navigation */}
      <div style={styles.principlesNav}>
        {principles.map((p) => (
          <button
            key={p.id}
            style={{
              ...styles.principleTab,
              ...(selectedPrinciple === p.id ? styles.principleTabActive : {}),
            }}
            onClick={() => handlePrincipleChange(p.id)}
          >
            {p.emoji} {p.shortName}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div style={styles.card}>
        {/* Principle Header */}
        <div style={styles.principleHeader}>
          <h2 style={styles.principleName}>
            {currentPrinciple.emoji} {currentPrinciple.name}
          </h2>
          <p style={styles.principleDesc}>{currentPrinciple.description}</p>
        </div>

        {/* Key Points */}
        <div style={styles.keyPointsList}>
          {currentPrinciple.keyPoints.map((point, i) => (
            <div key={i} style={styles.keyPoint}>
              ✓ {point}
            </div>
          ))}
        </div>

        {/* Interview Tip */}
        <div style={styles.interviewTip}>
          <strong>💡 Tip para entrevista:</strong>{" "}
          {currentPrinciple.interviewTip}
        </div>

        {/* Demo Section */}
        <div style={styles.demoContainer}>
          {/* Bad Demo */}
          <div style={styles.demoCard}>
            <div style={{ ...styles.demoHeader, ...styles.demoBadHeader }}>
              {currentPrinciple.badCode.title}
            </div>
            <div style={styles.demoContent}>
              {/* Code Example */}
              <pre
                style={{
                  margin: "0 0 12px 0",
                  padding: "12px",
                  backgroundColor: "#1a1a2e",
                  borderRadius: "6px",
                  fontSize: "11px",
                  lineHeight: "1.5",
                  overflow: "auto",
                  maxHeight: "280px",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                <code style={{ color: "#e8e8e8" }}>
                  {currentPrinciple.badCode.code}
                </code>
              </pre>

              {/* Explanation */}
              <div
                style={{
                  padding: "10px 12px",
                  backgroundColor: "#2a1a1a",
                  borderRadius: "6px",
                  fontSize: "12px",
                  color: "#f8d7da",
                  marginBottom: "12px",
                  borderLeft: "3px solid #dc3545",
                }}
              >
                <strong>⚠️ Problema:</strong>{" "}
                {currentPrinciple.badCode.explanation}
              </div>

              <button
                style={{ ...styles.runButton, ...styles.runButtonBad }}
                onClick={() => runDemo("bad")}
                disabled={isLoading.bad}
              >
                {isLoading.bad ? "Ejecutando..." : "▶ Ver en acción"}
              </button>

              {badOutput.length > 0 && (
                <div style={styles.output}>
                  <div
                    style={{
                      marginBottom: "8px",
                      color: "#aaa",
                      fontSize: "10px",
                    }}
                  >
                    RESULTADO:
                  </div>
                  {badOutput.map((line, i) => (
                    <div key={i}>{line || "\u00A0"}</div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Good Demo */}
          <div style={styles.demoCard}>
            <div style={{ ...styles.demoHeader, ...styles.demoGoodHeader }}>
              {currentPrinciple.goodCode.title}
            </div>
            <div style={styles.demoContent}>
              {/* Code Example */}
              <pre
                style={{
                  margin: "0 0 12px 0",
                  padding: "12px",
                  backgroundColor: "#1a2e1a",
                  borderRadius: "6px",
                  fontSize: "11px",
                  lineHeight: "1.5",
                  overflow: "auto",
                  maxHeight: "280px",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                <code style={{ color: "#e8e8e8" }}>
                  {currentPrinciple.goodCode.code}
                </code>
              </pre>

              {/* Explanation */}
              <div
                style={{
                  padding: "10px 12px",
                  backgroundColor: "#1a2a1a",
                  borderRadius: "6px",
                  fontSize: "12px",
                  color: "#d4edda",
                  marginBottom: "12px",
                  borderLeft: "3px solid #28a745",
                }}
              >
                <strong>✅ Solución:</strong>{" "}
                {currentPrinciple.goodCode.explanation}
              </div>

              <button
                style={{ ...styles.runButton, ...styles.runButtonGood }}
                onClick={() => runDemo("good")}
                disabled={isLoading.good}
              >
                {isLoading.good ? "Ejecutando..." : "▶ Ver en acción"}
              </button>

              {goodOutput.length > 0 && (
                <div style={styles.output}>
                  <div
                    style={{
                      marginBottom: "8px",
                      color: "#aaa",
                      fontSize: "10px",
                    }}
                  >
                    RESULTADO:
                  </div>
                  {goodOutput.map((line, i) => (
                    <div key={i}>{line || "\u00A0"}</div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Reference */}
      <div style={{ ...styles.card, backgroundColor: "#f8f9fa" }}>
        <h3 style={{ margin: "0 0 15px 0", fontSize: "16px" }}>
          📚 Referencia Rápida
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "15px",
          }}
        >
          <div>
            <strong>POO Básico:</strong>
            <ul
              style={{
                margin: "5px 0",
                paddingLeft: "20px",
                fontSize: "13px",
                color: "#555",
              }}
            >
              <li>
                <strong>Encapsulamiento:</strong> Estado privado + métodos
                públicos
              </li>
              <li>
                <strong>Abstracción:</strong> Interfaces definen QUÉ, no CÓMO
              </li>
              <li>
                <strong>Herencia:</strong> Solo cuando hay relación ES-UN
              </li>
              <li>
                <strong>Polimorfismo:</strong> Mismo método, diferente
                comportamiento
              </li>
              <li>
                <strong>Composición:</strong> TIENE-UN en lugar de ES-UN
              </li>
            </ul>
          </div>
          <div>
            <strong>SOLID:</strong>
            <ul
              style={{
                margin: "5px 0",
                paddingLeft: "20px",
                fontSize: "13px",
                color: "#555",
              }}
            >
              <li>
                <strong>SRP:</strong> Una clase, una responsabilidad
              </li>
              <li>
                <strong>OCP:</strong> Extender sin modificar
              </li>
              <li>
                <strong>LSP:</strong> Subtipos sustituibles
              </li>
              <li>
                <strong>ISP:</strong> Interfaces pequeñas y específicas
              </li>
              <li>
                <strong>DIP:</strong> Depender de abstracciones
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POOExplorer;
