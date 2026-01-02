/**
 * ❌ DIP (Dependency Inversion Principle) - MAL EJEMPLO
 *
 * Problema: Módulos de alto nivel dependen de módulos de bajo nivel.
 * OrderService está ACOPLADO a MySQLDatabase y SmtpEmailSender.
 */

// ❌ Implementación concreta de base de datos
class MySQLDatabase {
  save(table: string, data: object): string {
    return `[MySQL] INSERT INTO ${table} VALUES (${JSON.stringify(data)})`;
  }

  find(table: string, id: string): string {
    return `[MySQL] SELECT * FROM ${table} WHERE id = '${id}'`;
  }
}

// ❌ Implementación concreta de email
class SmtpEmailSender {
  send(to: string, subject: string): string {
    return `[SMTP] Enviando email a ${to}: "${subject}"`;
  }
}

// ❌ Módulo de alto nivel DEPENDE de módulos de bajo nivel
class OrderServiceBad {
  // ❌ Dependencias CONCRETAS - imposible cambiar o testear
  private database = new MySQLDatabase();
  private emailSender = new SmtpEmailSender();

  createOrder(customerEmail: string, items: string[]): string[] {
    const logs: string[] = [];

    // ❌ Acoplado a MySQL específicamente
    logs.push(this.database.save("orders", { items, customer: customerEmail }));

    // ❌ Acoplado a SMTP específicamente
    logs.push(this.emailSender.send(customerEmail, "Tu orden ha sido creada"));

    return logs;
  }
}

export function demoBad(): string[] {
  const logs: string[] = [];
  const service = new OrderServiceBad();

  logs.push("--- Creando orden ---");
  logs.push(
    ...service.createOrder("user@email.com", ["Producto A", "Producto B"])
  );

  logs.push("");
  logs.push("❌ Problemas:");
  logs.push("  - ¿Cambiar a PostgreSQL? Hay que modificar OrderService");
  logs.push("  - ¿Cambiar a SendGrid? Hay que modificar OrderService");
  logs.push("  - ¿Testing? Imposible sin base de datos real");
  logs.push(
    "  - Alto nivel (OrderService) depende de bajo nivel (MySQL, SMTP)"
  );

  return logs;
}

export { OrderServiceBad, MySQLDatabase, SmtpEmailSender };
