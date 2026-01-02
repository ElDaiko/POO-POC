/**
 * ✅ ABSTRACCIÓN - BUEN EJEMPLO
 * 
 * Solución: Interfaz que define QUÉ hace el servicio, no CÓMO lo hace.
 * El cliente solo conoce el contrato, los detalles están ocultos.
 */

// ✅ Interfaz - Define el contrato (QUÉ)
export interface NotificationService {
  send(to: string, subject: string, message: string): Promise<NotificationResult>;
}

export interface NotificationResult {
  success: boolean;
  message: string;
}

// ✅ Implementación Email - Oculta detalles SMTP
export class EmailNotificationService implements NotificationService {
  private smtpServer = "smtp.gmail.com";
  private port = 587;

  async send(to: string, subject: string, _message: string): Promise<NotificationResult> {
    // ✅ Todos los detalles de SMTP están OCULTOS aquí
    console.log(`[SMTP] Conectando a ${this.smtpServer}:${this.port}`);
    console.log(`[SMTP] Enviando a ${to}`);
    
    // Simular envío
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return {
      success: true,
      message: `Email enviado a ${to}: "${subject}"`
    };
  }
}

// ✅ Implementación SMS - Misma interfaz, diferente implementación
export class SMSNotificationService implements NotificationService {
  private apiKey = "twilio-api-key";

  async send(to: string, _subject: string, message: string): Promise<NotificationResult> {
    // ✅ Detalles de Twilio API ocultos
    console.log(`[SMS] Usando API Key: ${this.apiKey.substring(0, 5)}...`);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return {
      success: true,
      message: `SMS enviado a ${to}: "${message.substring(0, 20)}..."`
    };
  }
}

// ✅ Implementación Push - Otra implementación más
export class PushNotificationService implements NotificationService {
  async send(to: string, subject: string, _message: string): Promise<NotificationResult> {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return {
      success: true,
      message: `Push enviado al dispositivo ${to}: "${subject}"`
    };
  }
}

// ✅ EJEMPLO DE USO - El cliente NO conoce los detalles
export async function demoGood(): Promise<string[]> {
  const logs: string[] = [];

  // ✅ El cliente trabaja con la ABSTRACCIÓN, no con implementaciones
  async function notifyUser(service: NotificationService, user: string): Promise<string> {
    const result = await service.send(user, "Bienvenido", "Gracias por registrarte");
    return result.message;
  }

  // ✅ Podemos cambiar la implementación sin cambiar el código cliente
  const emailService = new EmailNotificationService();
  const smsService = new SMSNotificationService();
  const pushService = new PushNotificationService();

  logs.push(await notifyUser(emailService, "user@email.com"));
  logs.push(await notifyUser(smsService, "+1234567890"));
  logs.push(await notifyUser(pushService, "device-token-xyz"));

  logs.push("✅ Mismo código cliente, 3 implementaciones diferentes");

  return logs;
}
