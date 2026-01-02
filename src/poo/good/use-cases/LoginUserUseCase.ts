/**
 * ✅ LoginUserUseCase.ts - CASO DE USO DE LOGIN
 *
 * PRINCIPIOS APLICADOS:
 * 1. COMPOSICIÓN: Combina AuthService + SessionManager sin herencia
 * 2. ORQUESTACIÓN: Coordina el flujo de login sin contener lógica de negocio
 * 3. INYECCIÓN DE DEPENDENCIAS: Recibe todas las dependencias por constructor
 * 4. ABSTRACCIÓN: Depende de interfaces, no implementaciones
 *
 * ¿QUÉ ES UN CASO DE USO?
 *
 * Un caso de uso representa una acción que el usuario quiere realizar.
 * Su responsabilidad es COORDINAR, no IMPLEMENTAR:
 * - No valida credenciales (eso lo hace AuthService)
 * - No guarda sesión (eso lo hace SessionManager)
 * - Solo orquesta el flujo y maneja errores
 *
 * BENEFICIOS:
 * - La UI llama UN método y obtiene resultado
 * - Fácil de testear mockando dependencias
 * - Cambios en auth o sesión no afectan al caso de uso
 * - La lógica de coordinación está centralizada
 */

import type {
  AuthService,
  SessionService,
  User,
} from "../interfaces/AuthService";

/**
 * Resultado del caso de uso de login
 * Contiene toda la información que la UI necesita
 */
export interface LoginResult {
  success: boolean;
  user?: User;
  error?: string;
}

/**
 * Resultado del caso de uso de logout
 */
export interface LogoutResult {
  success: boolean;
}

/**
 * Estado de autenticación para la UI
 */
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}

/**
 * ✅ BUENA PRÁCTICA: Caso de uso que orquesta el flujo de login
 *
 * Esta clase:
 * - Recibe dependencias por constructor (inyección)
 * - Depende de INTERFACES, no implementaciones
 * - Coordina el flujo sin contener lógica de negocio
 * - Retorna resultados tipados que la UI puede consumir
 */
export class LoginUserUseCase {
  // ✅ BUENO: Dependencias privadas e inyectadas
  private readonly authService: AuthService;
  private readonly sessionService: SessionService;

  // ✅ BUENO: Estado privado
  private isLoading: boolean = false;

  /**
   * ✅ BUENA PRÁCTICA: Constructor con inyección de dependencias
   *
   * El caso de uso no sabe:
   * - Qué implementación de AuthService se usa
   * - Cómo se guarda la sesión
   * - Si es testing o producción
   *
   * @param authService - Servicio de autenticación (interfaz)
   * @param sessionService - Servicio de sesión (interfaz)
   */
  constructor(authService: AuthService, sessionService: SessionService) {
    this.authService = authService;
    this.sessionService = sessionService;
  }

  /**
   * ✅ BUENA PRÁCTICA: Método principal que orquesta el login
   *
   * Flujo:
   * 1. Validación básica de entrada
   * 2. Delegar autenticación al AuthService
   * 3. Si exitoso, delegar creación de sesión al SessionService
   * 4. Retornar resultado tipado
   *
   * La UI simplemente llama: await loginUseCase.execute(email, password)
   */
  async execute(email: string, password: string): Promise<LoginResult> {
    // ✅ BUENO: Control de estado de loading
    if (this.isLoading) {
      return { success: false, error: "Login en progreso" };
    }

    this.isLoading = true;

    try {
      // ✅ BUENO: Validación básica de entrada
      const validationError = this.validateInput(email, password);
      if (validationError) {
        return { success: false, error: validationError };
      }

      // ✅ BUENO: Delegar autenticación al servicio
      const authResult = await this.authService.authenticate(email, password);

      if (!authResult.success) {
        return { success: false, error: authResult.error };
      }

      // ✅ BUENO: Delegar gestión de sesión
      this.sessionService.startSession(authResult.user, authResult.token);

      return {
        success: true,
        user: authResult.user,
      };
    } catch (error) {
      // ✅ BUENO: Manejo de errores centralizado
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error desconocido durante el login";

      return { success: false, error: errorMessage };
    } finally {
      // ✅ BUENO: Siempre limpiar estado de loading
      this.isLoading = false;
    }
  }

  /**
   * ✅ BUENA PRÁCTICA: Logout como parte del mismo caso de uso
   */
  async logout(): Promise<LogoutResult> {
    try {
      this.sessionService.endSession();
      return { success: true };
    } catch {
      return { success: false };
    }
  }

  /**
   * ✅ BUENA PRÁCTICA: Obtener estado actual para la UI
   */
  getAuthState(): AuthState {
    const session = this.sessionService.getSession();

    return {
      isAuthenticated: this.sessionService.isActive(),
      user: session?.user ?? null,
      isLoading: this.isLoading,
    };
  }

  /**
   * ✅ BUENA PRÁCTICA: Verificar si hay sesión activa
   */
  isAuthenticated(): boolean {
    return this.sessionService.isActive();
  }

  /**
   * ✅ BUENA PRÁCTICA: Obtener usuario actual de forma segura
   */
  getCurrentUser(): User | null {
    return this.sessionService.getSession()?.user ?? null;
  }

  /**
   * ✅ BUENO: Validación privada separada
   */
  private validateInput(email: string, password: string): string | null {
    if (!email?.trim()) {
      return "El email es requerido";
    }

    if (!password) {
      return "La contraseña es requerida";
    }

    // Validación básica de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Formato de email inválido";
    }

    return null;
  }
}

/**
 * ✅ BUENA PRÁCTICA: Factory para crear instancias configuradas
 *
 * Un factory permite:
 * - Encapsular la creación de objetos complejos
 * - Cambiar implementaciones fácilmente
 * - Centralizar la configuración
 */
export class LoginUseCaseFactory {
  /**
   * Crea una instancia para producción
   */
  static createForProduction(
    authService: AuthService,
    sessionService: SessionService
  ): LoginUserUseCase {
    return new LoginUserUseCase(authService, sessionService);
  }

  /**
   * Crea una instancia para testing con mocks
   */
  static createForTesting(
    mockAuthService?: AuthService,
    mockSessionService?: SessionService
  ): LoginUserUseCase {
    // En testing, se pueden usar implementaciones mock
    const auth = mockAuthService ?? {
      authenticate: async () => ({
        success: true,
        user: { id: "1", email: "test@test.com", name: "Test" },
        token: "token",
      }),
      validateToken: async () => true,
      refreshToken: async () => "new-token",
    };

    const session = mockSessionService ?? {
      startSession: () => {},
      getSession: () => ({
        user: { id: "1", email: "test@test.com", name: "Test" },
        token: "token",
      }),
      endSession: () => {},
      isActive: () => true,
    };

    return new LoginUserUseCase(auth, session);
  }
}
