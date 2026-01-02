/**
 * ✅ AuthService.ts - INTERFAZ DE SERVICIO DE AUTENTICACIÓN
 *
 * PRINCIPIOS APLICADOS:
 * 1. ABSTRACCIÓN: Define QUÉ hace el servicio, no CÓMO
 * 2. BAJO ACOPLAMIENTO: Los consumidores dependen del contrato, no de la implementación
 * 3. INVERSIÓN DE DEPENDENCIAS: Las clases de alto nivel dependen de abstracciones
 *
 * BENEFICIOS:
 * - Facilita testing (se pueden crear mocks que implementen la interfaz)
 * - Permite cambiar implementación sin afectar consumidores
 * - Documenta el contrato público de forma explícita
 * - Habilita múltiples implementaciones (API real, mock, OAuth, etc.)
 */

/**
 * Tipo inmutable para representar un usuario autenticado
 * Usar `readonly` previene modificaciones accidentales
 */
export interface User {
  readonly id: string;
  readonly email: string;
  readonly name: string;
}

/**
 * Resultado de autenticación con discriminador de tipo
 * Permite manejo seguro de éxito/error sin excepciones
 */
export type AuthResult =
  | { success: true; user: User; token: string }
  | { success: false; error: string };

/**
 * ✅ INTERFAZ: Contrato del servicio de autenticación
 *
 * Esta interfaz define SOLO las operaciones de autenticación.
 * No sabe nada sobre:
 * - Cómo se almacena la sesión
 * - Cómo se hace la petición HTTP
 * - Qué framework se usa
 *
 * Esto es ABSTRACCIÓN: ocultar detalles de implementación
 * detrás de un contrato claro.
 */
export interface AuthService {
  /**
   * Autentica un usuario con email y contraseña
   * @param email - Email del usuario
   * @param password - Contraseña del usuario
   * @returns Resultado de autenticación (éxito con datos o error con mensaje)
   */
  authenticate(email: string, password: string): Promise<AuthResult>;

  /**
   * Valida si un token es válido
   * @param token - Token JWT o similar a validar
   * @returns true si el token es válido, false en caso contrario
   */
  validateToken(token: string): Promise<boolean>;

  /**
   * Refresca un token existente
   * @param token - Token actual a refrescar
   * @returns Nuevo token o null si no se puede refrescar
   */
  refreshToken(token: string): Promise<string | null>;
}

/**
 * ✅ INTERFAZ: Contrato del almacenamiento de datos
 *
 * Abstrae el mecanismo de persistencia (localStorage, sessionStorage,
 * indexedDB, memoria, etc.)
 *
 * Esto permite:
 * - Testear sin acceder a storage real
 * - Cambiar de localStorage a sessionStorage fácilmente
 * - Implementar storage encriptado si se requiere
 */
export interface StorageService {
  /**
   * Guarda un valor en el storage
   */
  set<T>(key: string, value: T): void;

  /**
   * Obtiene un valor del storage
   */
  get<T>(key: string): T | null;

  /**
   * Elimina un valor del storage
   */
  remove(key: string): void;

  /**
   * Limpia todo el storage
   */
  clear(): void;
}

/**
 * ✅ INTERFAZ: Contrato para gestión de sesión
 *
 * Define operaciones de sesión separadas de autenticación.
 * Esto cumple con el principio de responsabilidad única:
 * - AuthService: autenticar usuarios
 * - SessionService: mantener estado de sesión
 */
export interface SessionService {
  /**
   * Inicia una sesión con los datos del usuario
   */
  startSession(user: User, token: string): void;

  /**
   * Obtiene la sesión actual
   */
  getSession(): { user: User; token: string } | null;

  /**
   * Termina la sesión actual
   */
  endSession(): void;

  /**
   * Verifica si hay una sesión activa
   */
  isActive(): boolean;
}
