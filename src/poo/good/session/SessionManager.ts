/**
 * ✅ SessionManager.ts - GESTOR DE SESIÓN CON COMPOSICIÓN
 *
 * PRINCIPIOS APLICADOS:
 * 1. ENCAPSULAMIENTO: Estado completamente privado
 * 2. COMPOSICIÓN: Usa StorageService en lugar de heredar
 * 3. RESPONSABILIDAD ÚNICA: Solo gestiona el estado de sesión
 * 4. INYECCIÓN DE DEPENDENCIAS: Recibe StorageService por constructor
 *
 * ¿POR QUÉ COMPOSICIÓN Y NO HERENCIA?
 *
 * SessionManager USA un StorageService, no ES UN StorageService.
 * - Herencia: "es-un" (is-a relationship)
 * - Composición: "tiene-un" (has-a relationship)
 *
 * Si usáramos herencia:
 * - SessionManager tendría métodos de storage que no debería exponer
 * - Cambiar de localStorage a sessionStorage requeriría cambiar la clase padre
 * - Testing sería más difícil
 *
 * Con composición:
 * - SessionManager expone SOLO métodos de sesión
 * - Podemos inyectar cualquier implementación de StorageService
 * - Testing es trivial con mocks
 */

import type {
  User,
  SessionService,
  StorageService,
} from "../interfaces/AuthService";

/**
 * Tipo interno para el estado de sesión
 * Solo se usa dentro de esta clase
 */
interface SessionState {
  user: User;
  token: string;
  createdAt: number;
  expiresAt: number;
}

/**
 * ✅ BUENA PRÁCTICA: Clase con estado privado y composición
 */
export class SessionManager implements SessionService {
  // ✅ BUENO: Estado PRIVADO - nadie puede acceder directamente
  private currentSession: SessionState | null = null;

  // ✅ BUENO: Dependencia inyectada - COMPOSICIÓN
  private readonly storage: StorageService;

  // ✅ BUENO: Configuración privada
  private readonly sessionKey = "session";
  private readonly sessionDurationMs: number;

  /**
   * ✅ BUENA PRÁCTICA: Inyección de dependencias por constructor
   *
   * Esto permite:
   * - Usar localStorage en producción
   * - Usar InMemoryStorage en tests
   * - Cambiar la implementación sin modificar esta clase
   *
   * @param storage - Servicio de almacenamiento (inyectado)
   * @param sessionDurationHours - Duración de la sesión en horas
   */
  constructor(storage: StorageService, sessionDurationHours: number = 24) {
    this.storage = storage;
    this.sessionDurationMs = sessionDurationHours * 60 * 60 * 1000;

    // ✅ BUENO: Restaurar sesión al inicializar
    this.restoreSession();
  }

  /**
   * ✅ BUENO: Método público con lógica clara
   * Inicia una nueva sesión guardando los datos de forma segura
   */
  startSession(user: User, token: string): void {
    const now = Date.now();

    // ✅ BUENO: Crear estado de sesión inmutable
    this.currentSession = {
      user: { ...user }, // ✅ BUENO: Copia para evitar mutaciones externas
      token,
      createdAt: now,
      expiresAt: now + this.sessionDurationMs,
    };

    // ✅ BUENO: Delegar persistencia al storage inyectado
    this.storage.set(this.sessionKey, this.currentSession);
  }

  /**
   * ✅ BUENO: Getter que retorna copia, no referencia
   * Esto previene que el consumidor modifique el estado interno
   */
  getSession(): { user: User; token: string } | null {
    if (!this.currentSession || this.isExpired()) {
      return null;
    }

    // ✅ BUENO: Retornar copia, no referencia directa
    return {
      user: { ...this.currentSession.user },
      token: this.currentSession.token,
    };
  }

  /**
   * ✅ BUENO: Obtener solo el usuario (principio de mínima exposición)
   */
  getUser(): User | null {
    const session = this.getSession();
    return session ? { ...session.user } : null;
  }

  /**
   * ✅ BUENO: Obtener solo el token
   */
  getToken(): string | null {
    return this.currentSession?.token ?? null;
  }

  /**
   * ✅ BUENO: Terminar sesión limpiando todo el estado
   */
  endSession(): void {
    this.currentSession = null;
    this.storage.remove(this.sessionKey);
  }

  /**
   * ✅ BUENO: Verificación de sesión activa
   */
  isActive(): boolean {
    return this.currentSession !== null && !this.isExpired();
  }

  /**
   * ✅ BUENO: Obtener tiempo restante de sesión
   */
  getTimeRemaining(): number {
    if (!this.currentSession) return 0;

    const remaining = this.currentSession.expiresAt - Date.now();
    return Math.max(0, remaining);
  }

  /**
   * ✅ BUENO: Extender la sesión actual
   */
  extendSession(): void {
    if (this.currentSession && !this.isExpired()) {
      this.currentSession.expiresAt = Date.now() + this.sessionDurationMs;
      this.storage.set(this.sessionKey, this.currentSession);
    }
  }

  /**
   * ✅ BUENO: Método privado - detalle de implementación
   */
  private isExpired(): boolean {
    if (!this.currentSession) return true;
    return Date.now() > this.currentSession.expiresAt;
  }

  /**
   * ✅ BUENO: Método privado para restaurar sesión
   */
  private restoreSession(): void {
    const stored = this.storage.get<SessionState>(this.sessionKey);

    if (stored && stored.expiresAt > Date.now()) {
      this.currentSession = stored;
    } else if (stored) {
      // Sesión expirada, limpiar
      this.storage.remove(this.sessionKey);
    }
  }
}

/**
 * ✅ BUENA PRÁCTICA: Extensión por composición, no herencia
 *
 * Si necesitamos un SessionManager con funcionalidades extra,
 * creamos una nueva clase que COMPONE al original, no que hereda.
 */
export class AuditableSessionManager implements SessionService {
  // ✅ BUENO: Composición - tiene un SessionManager
  private readonly sessionManager: SessionManager;
  private readonly onSessionStart?: (user: User) => void;
  private readonly onSessionEnd?: () => void;

  constructor(
    storage: StorageService,
    callbacks?: {
      onSessionStart?: (user: User) => void;
      onSessionEnd?: () => void;
    }
  ) {
    this.sessionManager = new SessionManager(storage);
    this.onSessionStart = callbacks?.onSessionStart;
    this.onSessionEnd = callbacks?.onSessionEnd;
  }

  startSession(user: User, token: string): void {
    this.sessionManager.startSession(user, token);
    // ✅ BUENO: Callback adicional sin modificar SessionManager
    this.onSessionStart?.(user);
  }

  getSession(): { user: User; token: string } | null {
    return this.sessionManager.getSession();
  }

  endSession(): void {
    this.sessionManager.endSession();
    this.onSessionEnd?.();
  }

  isActive(): boolean {
    return this.sessionManager.isActive();
  }
}
