/**
 * ✅ AuthServiceImpl.ts - IMPLEMENTACIÓN DEL SERVICIO DE AUTENTICACIÓN
 *
 * PRINCIPIOS APLICADOS:
 * 1. ENCAPSULAMIENTO: Estado privado, solo accesible mediante métodos públicos
 * 2. ABSTRACCIÓN: Implementa la interfaz AuthService
 * 3. RESPONSABILIDAD ÚNICA: Solo autentica, no gestiona sesión ni storage
 * 4. BAJO ACOPLAMIENTO: No depende de implementaciones concretas
 *
 * DIFERENCIAS CON AuthServiceBad:
 * - Estado privado vs público
 * - Una responsabilidad vs múltiples
 * - Implementa interfaz vs clase independiente
 * - Retorna resultados tipados vs modifica estado interno
 */

import type { AuthService, AuthResult, User } from "../interfaces/AuthService";

/**
 * ✅ BUENA PRÁCTICA: Clase que implementa una interfaz
 *
 * Esta clase SOLO se encarga de autenticar usuarios.
 * No sabe nada sobre:
 * - Dónde se guarda la sesión
 * - Cómo se renderiza la UI
 * - Qué pasa después del login
 */
export class AuthServiceImpl implements AuthService {
  // ✅ BUENO: Usuarios simulados encapsulados (en prod vendría de API)
  private readonly validUsers: ReadonlyArray<{
    email: string;
    password: string;
    user: User;
  }> = [
    {
      email: "test@test.com",
      password: "123456",
      user: { id: "1", email: "test@test.com", name: "Usuario Test" },
    },
    {
      email: "admin@test.com",
      password: "admin123",
      user: { id: "2", email: "admin@test.com", name: "Administrador" },
    },
  ];

  // ✅ BUENO: Tokens válidos encapsulados
  private readonly validTokens: Set<string> = new Set();

  /**
   * ✅ BUENO: Método que retorna resultado en lugar de modificar estado
   *
   * Ventajas:
   * - El llamador decide qué hacer con el resultado
   * - Fácil de testear (entrada -> salida)
   * - No hay efectos secundarios ocultos
   */
  async authenticate(email: string, password: string): Promise<AuthResult> {
    // ✅ BUENO: Validación clara al inicio
    if (!email || !password) {
      return { success: false, error: "Email y contraseña son requeridos" };
    }

    // Simulación de latencia de red
    await this.simulateNetworkDelay();

    // ✅ BUENO: Búsqueda encapsulada
    const validUser = this.findValidUser(email, password);

    if (!validUser) {
      return { success: false, error: "Credenciales inválidas" };
    }

    // ✅ BUENO: Generación de token encapsulada
    const token = this.generateToken(validUser.user.id);

    // ✅ BUENO: Registro interno del token válido
    this.validTokens.add(token);

    return {
      success: true,
      user: validUser.user,
      token,
    };
  }

  /**
   * ✅ BUENO: Validación de token aislada
   */
  async validateToken(token: string): Promise<boolean> {
    await this.simulateNetworkDelay(100);
    return this.validTokens.has(token);
  }

  /**
   * ✅ BUENO: Refresh de token implementado
   */
  async refreshToken(token: string): Promise<string | null> {
    await this.simulateNetworkDelay(100);

    if (!this.validTokens.has(token)) {
      return null;
    }

    // Invalidar token antiguo
    this.validTokens.delete(token);

    // Generar nuevo token
    const newToken = this.generateToken("refreshed");
    this.validTokens.add(newToken);

    return newToken;
  }

  /**
   * ✅ BUENO: Método privado - detalle de implementación oculto
   */
  private findValidUser(email: string, password: string) {
    return this.validUsers.find(
      (u) => u.email === email && u.password === password
    );
  }

  /**
   * ✅ BUENO: Generación de token encapsulada
   * En producción, esto vendría del backend
   */
  private generateToken(userId: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2);
    return `token_${userId}_${timestamp}_${random}`;
  }

  /**
   * ✅ BUENO: Simulación de red encapsulada y configurable
   */
  private simulateNetworkDelay(ms: number = 500): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

/**
 * ✅ BUENA PRÁCTICA: Implementación mock para testing
 *
 * Esta implementación permite tests determinísticos:
 * - Sin delays
 * - Comportamiento controlado
 * - Sin estado persistente
 */
export class MockAuthService implements AuthService {
  private shouldSucceed: boolean;
  private mockUser: User;

  constructor(shouldSucceed: boolean = true) {
    this.shouldSucceed = shouldSucceed;
    this.mockUser = { id: "mock-1", email: "mock@test.com", name: "Mock User" };
  }

  async authenticate(email: string, password: string): Promise<AuthResult> {
    if (this.shouldSucceed && email && password) {
      return {
        success: true,
        user: this.mockUser,
        token: "mock-token",
      };
    }
    return { success: false, error: "Mock error" };
  }

  async validateToken(token: string): Promise<boolean> {
    return token === "mock-token";
  }

  async refreshToken(): Promise<string | null> {
    return this.shouldSucceed ? "new-mock-token" : null;
  }
}
