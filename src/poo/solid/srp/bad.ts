/**
 * ❌ SRP (Single Responsibility Principle) - MAL EJEMPLO
 *
 * Problema: Una clase hace DEMASIADAS cosas.
 * UserService maneja: validación, persistencia, emails y logs.
 */

export class UserServiceBad {
  private users: Map<string, { email: string; password: string }> = new Map();

  async registerUser(email: string, password: string): Promise<string[]> {
    const logs: string[] = [];

    // ❌ Responsabilidad 1: Validación
    if (!email.includes("@")) {
      logs.push("❌ Email inválido");
      return logs;
    }
    if (password.length < 6) {
      logs.push("❌ Password muy corta");
      return logs;
    }
    logs.push("✓ Validación completada");

    // ❌ Responsabilidad 2: Persistencia
    const id = Math.random().toString(36).substring(7);
    this.users.set(id, { email, password });
    logs.push(`✓ Usuario guardado en BD con ID: ${id}`);

    // ❌ Responsabilidad 3: Envío de email
    logs.push(`✓ Email de bienvenida enviado a ${email}`);

    // ❌ Responsabilidad 4: Logging
    logs.push(
      `✓ Log: Usuario ${email} registrado a las ${new Date().toISOString()}`
    );

    // ❌ Responsabilidad 5: Métricas
    logs.push(`✓ Métrica: total_users_registered++`);

    logs.push("");
    logs.push("⚠️ Esta clase tiene 5 responsabilidades diferentes");
    logs.push(
      "⚠️ Si cambia la lógica de emails, hay que modificar UserService"
    );

    return logs;
  }
}

export function demoBad(): Promise<string[]> {
  const service = new UserServiceBad();
  return service.registerUser("test@email.com", "password123");
}
