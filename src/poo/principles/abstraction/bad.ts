/**
 * ❌ ABSTRACCIÓN - MAL EJEMPLO
 * 
 * Problema: El código cliente conoce TODOS los detalles de implementación.
 * Si cambia la forma de enviar emails, hay que cambiar todo el código que lo usa.
 */

// ❌ Clase concreta sin abstracción
export class EmailSenderBad {
  public smtpServer: string = "smtp.gmail.com";
  public port: number = 587;
  public username: string = "";
  public password: string = "";

  // ❌ El cliente necesita conocer todos los detalles de configuración SMTP
  connect(): string {
    return `Conectando a ${this.smtpServer}:${this.port}...`;
  }

  authenticate(): string {
    return `Autenticando con ${this.username}...`;
  }

  formatMessage(to: string, subject: string, body: string): string {
    return `MIME-Version: 1.0\nTo: ${to}\nSubject: ${subject}\n\n${body}`;
  }

  sendRaw(formattedMessage: string): string {
    return `Enviando mensaje SMTP: ${formattedMessage.substring(0, 50)}...`;
  }

  disconnect(): string {
    return "Desconectando del servidor SMTP...";
  }
}

// ❌ EJEMPLO DE USO - El cliente hace TODO el trabajo
export function demoBad(): string[] {
  const sender = new EmailSenderBad();
  const logs: string[] = [];

  // ❌ El cliente necesita conocer el proceso completo de SMTP
  sender.smtpServer = "smtp.gmail.com";
  sender.port = 587;
  sender.username = "user@gmail.com";
  sender.password = "password123";

  logs.push(sender.connect());
  logs.push(sender.authenticate());
  
  const message = sender.formatMessage(
    "dest@email.com",
    "Hola",
    "Este es el cuerpo del mensaje"
  );
  logs.push(sender.sendRaw(message));
  logs.push(sender.disconnect());

  logs.push("⚠️ Si cambiamos a SendGrid, hay que reescribir TODO este código");

  return logs;
}
