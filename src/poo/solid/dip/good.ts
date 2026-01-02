/**
 * ✅ DIP (Dependency Inversion Principle) - BUEN EJEMPLO
 *
 * Solución: Ambos niveles dependen de ABSTRACCIONES.
 * OrderService depende de interfaces, no de implementaciones.
 */

// ✅ ABSTRACCIONES (interfaces)
interface Database {
  save(table: string, data: object): string;
  find(table: string, id: string): string;
}

interface EmailSender {
  send(to: string, subject: string): string;
}

// ✅ Implementación MySQL
class MySQLDatabase implements Database {
  save(table: string, data: object): string {
    return `[MySQL] INSERT INTO ${table} VALUES (${JSON.stringify(data)})`;
  }
  find(table: string, id: string): string {
    return `[MySQL] SELECT * FROM ${table} WHERE id = '${id}'`;
  }
}

// ✅ Implementación PostgreSQL (nueva, sin cambiar OrderService)
class PostgreSQLDatabase implements Database {
  save(table: string, data: object): string {
    return `[PostgreSQL] INSERT INTO ${table} VALUES (${JSON.stringify(data)})`;
  }
  find(table: string, id: string): string {
    return `[PostgreSQL] SELECT * FROM ${table} WHERE id = '${id}'`;
  }
}

// ✅ Implementación Mock para testing
class MockDatabase implements Database {
  save(table: string, data: object): string {
    return `[MOCK] Simulando guardado en ${table}: ${JSON.stringify(data)}`;
  }
  find(table: string, id: string): string {
    return `[MOCK] Simulando búsqueda en ${table} por id ${id}`;
  }
}

// ✅ Implementación SMTP
class SmtpEmailSender implements EmailSender {
  send(to: string, subject: string): string {
    return `[SMTP] Email a ${to}: "${subject}"`;
  }
}

// ✅ Implementación SendGrid
class SendGridEmailSender implements EmailSender {
  send(to: string, subject: string): string {
    return `[SendGrid] Email a ${to}: "${subject}"`;
  }
}

// ✅ Módulo de alto nivel depende de ABSTRACCIONES
class OrderServiceGood {
  private database: Database;
  private emailSender: EmailSender;

  constructor(database: Database, emailSender: EmailSender) {
    this.database = database;
    this.emailSender = emailSender;
  }

  createOrder(customerEmail: string, items: string[]): string[] {
    const logs: string[] = [];

    // ✅ Trabaja con abstracción, no sabe qué DB es
    logs.push(this.database.save("orders", { items, customer: customerEmail }));

    // ✅ Trabaja con abstracción, no sabe qué servicio de email es
    logs.push(this.emailSender.send(customerEmail, "Tu orden ha sido creada"));

    return logs;
  }
}

export function demoGood(): string[] {
  const logs: string[] = [];

  // ✅ Producción con MySQL y SMTP
  logs.push("--- Producción (MySQL + SMTP) ---");
  const prodService = new OrderServiceGood(
    new MySQLDatabase(),
    new SmtpEmailSender()
  );
  logs.push(...prodService.createOrder("user@email.com", ["Producto A"]));

  logs.push("");

  // ✅ Fácil cambiar a PostgreSQL + SendGrid
  logs.push("--- Otra config (PostgreSQL + SendGrid) ---");
  const altService = new OrderServiceGood(
    new PostgreSQLDatabase(),
    new SendGridEmailSender()
  );
  logs.push(...altService.createOrder("user@email.com", ["Producto B"]));

  logs.push("");

  // ✅ Testing con Mocks
  logs.push("--- Testing (Mock) ---");
  const testService = new OrderServiceGood(new MockDatabase(), {
    send: (to, subject) => `[TEST] Mock email a ${to}: ${subject}`,
  });
  logs.push(...testService.createOrder("test@test.com", ["Test Item"]));

  logs.push("");
  logs.push("✅ DIP cumplido:");
  logs.push("  - OrderService no conoce MySQL, PostgreSQL, etc.");
  logs.push("  - Fácil cambiar implementaciones");
  logs.push("  - Fácil testear con mocks");

  return logs;
}

export { OrderServiceGood, MySQLDatabase, PostgreSQLDatabase };
export type { Database, EmailSender };
