/**
 * ❌ UserManagerBad.ts - EJEMPLO DE MAL DISEÑO EN GESTIÓN DE USUARIOS
 *
 * PROBLEMAS IDENTIFICADOS:
 * 1. ACOPLAMIENTO FUERTE: Depende directamente de AuthServiceBad
 * 2. HERENCIA INNECESARIA: Extiende AuthServiceBad sin justificación real
 * 3. VIOLACIÓN DE ENCAPSULAMIENTO: Accede a propiedades internas de la clase padre
 * 4. ESTADO DUPLICADO: Mantiene su propio estado que puede desincronizarse
 * 5. RESPONSABILIDADES CONFUSAS: ¿Es un manager o un servicio de auth?
 *
 * En una entrevista, criticarías:
 * - Uso incorrecto de herencia (no hay relación "es-un")
 * - Fragilidad del diseño (cambios en padre rompen hijo)
 * - Imposibilidad de testear aisladamente
 */

import { AuthServiceBad } from "./AuthServiceBad";
import type { User } from "./AuthServiceBad";

/**
 * ❌ MALO: Herencia incorrecta
 *
 * La pregunta clave: ¿UserManagerBad ES-UN AuthServiceBad?
 * Respuesta: NO. Un manager de usuarios no es un servicio de autenticación.
 *
 * Esto viola el principio de sustitución de Liskov:
 * No podemos usar UserManagerBad donde esperamos AuthServiceBad
 * sin efectos secundarios inesperados.
 */
export class UserManagerBad extends AuthServiceBad {
  // ❌ MALO: Estado adicional que puede desincronizarse con el padre
  public userPreferences: Record<string, unknown> = {};

  // ❌ MALO: Duplicación de estado - ¿cuál es la fuente de verdad?
  public lastActivity: Date | null = null;

  // ❌ MALO: Lista de permisos pública - problema de seguridad
  public permissions: string[] = [];

  constructor() {
    // ❌ MALO: Super obligatorio pero sin lógica clara
    super();

    // ❌ MALO: Inicialización que depende del estado del padre
    this.loadUserPreferences();
  }

  /**
   * ❌ MALO: Método que accede directamente al estado del padre
   * Si el padre cambia su implementación, esto se rompe
   */
  loadUserPreferences(): void {
    // ❌ MALO: Acceso directo a propiedad pública del padre
    if (this.currentUser) {
      // ❌ MALO: Dependencia directa de localStorage
      const prefs = localStorage.getItem(`prefs_${this.currentUser.id}`);
      if (prefs) {
        this.userPreferences = JSON.parse(prefs);
      }
    }
  }

  /**
   * ❌ MALO: Override que modifica comportamiento del padre de forma sutil
   * Esto crea bugs difíciles de rastrear
   */
  async login(email: string, password: string): Promise<boolean> {
    // ❌ MALO: Llamada al padre + lógica adicional acoplada
    const success = await super.login(email, password);

    if (success) {
      // ❌ MALO: Efectos secundarios ocultos en el login
      this.lastActivity = new Date();
      this.loadUserPreferences();
      this.loadPermissions();

      // ❌ MALO: Más acceso a localStorage
      localStorage.setItem("lastActivity", this.lastActivity.toISOString());
    }

    return success;
  }

  /**
   * ❌ MALO: Método que mezcla permisos con autenticación
   * Los permisos deberían ser responsabilidad de otra clase
   */
  loadPermissions(): void {
    // ❌ MALO: Lógica de permisos hardcodeada
    if (this.currentUser) {
      // ❌ MALO: Asignación de permisos arbitraria
      this.permissions = ["read", "write"];

      // ❌ MALO: Lógica condicional basada en datos internos
      if (this.currentUser.email.includes("admin")) {
        this.permissions.push("admin", "delete");
      }
    }
  }

  /**
   * ❌ MALO: Verificación de permisos acoplada a la clase
   * Debería ser un servicio independiente
   */
  hasPermission(permission: string): boolean {
    // ❌ MALO: Acceso directo a array público
    return this.permissions.includes(permission);
  }

  /**
   * ❌ MALO: Método que modifica el usuario del padre
   * Rompe el encapsulamiento completamente
   */
  updateUserProfile(name: string): void {
    // ❌ MALO: Modificación directa del estado del padre
    if (this.currentUser) {
      this.currentUser.name = name;

      // ❌ MALO: Duplicación de lógica de persistencia
      localStorage.setItem("user", JSON.stringify(this.currentUser));

      this.lastActivity = new Date();
    }
  }

  /**
   * ❌ MALO: Método que guarda preferencias sin validación
   */
  savePreference(key: string, value: unknown): void {
    // ❌ MALO: Modificación directa de objeto público
    this.userPreferences[key] = value;

    if (this.currentUser) {
      // ❌ MALO: Más localStorage acoplado
      localStorage.setItem(
        `prefs_${this.currentUser.id}`,
        JSON.stringify(this.userPreferences)
      );
    }
  }

  /**
   * ❌ MALO: Getter que expone estado mutable
   * El consumidor puede modificar el objeto retornado
   */
  getPreferences(): Record<string, unknown> {
    // ❌ MALO: Retorna referencia directa, no copia
    return this.userPreferences;
  }

  /**
   * ❌ MALO: Override de logout con efectos secundarios adicionales
   */
  logout(): void {
    // ❌ MALO: Limpieza de estado dispersa
    if (this.currentUser) {
      localStorage.removeItem(`prefs_${this.currentUser.id}`);
    }

    // ❌ MALO: Reset de estado local antes de llamar al padre
    this.userPreferences = {};
    this.permissions = [];
    this.lastActivity = null;

    // ❌ MALO: Llamada al padre al final (orden podría importar)
    super.logout();
  }

  /**
   * ❌ MALO: Método que verifica sesión de forma confusa
   * Duplica lógica del padre
   */
  isSessionValid(): boolean {
    // ❌ MALO: Acceso a múltiples propiedades públicas
    return (
      this.isAuthenticated && this.currentUser !== null && this.token !== ""
    );
  }

  /**
   * ❌ MALO: Método que obtiene datos de usuario de forma insegura
   */
  getUserData(): {
    user: User | null;
    permissions: string[];
    prefs: Record<string, unknown>;
  } {
    // ❌ MALO: Expone todo el estado interno
    return {
      user: this.currentUser,
      permissions: this.permissions,
      prefs: this.userPreferences,
    };
  }
}

// ❌ MALO: Otro singleton global que depende del primero
// Ahora tenemos DOS instancias que pueden desincronizarse
export const userManager = new UserManagerBad();

/**
 * ❌ MALO: Función helper que usa el singleton
 * Crea dependencia implícita en todo el código que la use
 */
export function quickLogin(email: string, password: string): Promise<boolean> {
  return userManager.login(email, password);
}
