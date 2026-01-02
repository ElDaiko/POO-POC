/**
 * ❌ AuthServiceBad.ts - EJEMPLO DE MALAS PRÁCTICAS EN POO
 *
 * PROBLEMAS IDENTIFICADOS:
 * 1. ALTO ACOPLAMIENTO: Esta clase hace TODO - autenticación, sesión y almacenamiento
 * 2. ESTADO PÚBLICO: Las propiedades son accesibles directamente desde fuera
 * 3. RESPONSABILIDADES MEZCLADAS: Viola el principio de responsabilidad única (SRP)
 * 4. DEPENDENCIAS DIRECTAS: Accede directamente a localStorage (no se puede testear)
 * 5. SIN ABSTRACCIÓN: No hay interfaces, todo está acoplado a la implementación
 *
 * En una entrevista, este código sería criticado por:
 * - Imposibilidad de testing unitario (depende de localStorage)
 * - Cualquier cambio afecta múltiples funcionalidades
 * - No se puede reutilizar parcialmente
 * - El estado puede ser modificado desde cualquier lugar
 */

// ❌ MALO: Tipo exportado pero sin contrato formal (interface)
export type User = {
  id: string;
  email: string;
  name: string;
};

// ❌ MALO: Clase "God Object" que hace demasiadas cosas
export class AuthServiceBad {
  // ❌ MALO: Estado público - cualquiera puede modificarlo directamente
  public currentUser: User | null = null;

  // ❌ MALO: Estado público - se puede cambiar sin validación
  public isAuthenticated: boolean = false;

  // ❌ MALO: Token expuesto públicamente (problema de seguridad)
  public token: string = "";

  // ❌ MALO: Estado de loading público - puede causar estados inconsistentes
  public isLoading: boolean = false;

  // ❌ MALO: Historial de logins expuesto - violación de encapsulamiento
  public loginHistory: Date[] = [];

  /**
   * ❌ MALO: Este método hace DEMASIADAS COSAS:
   * 1. Valida credenciales
   * 2. Simula llamada a API
   * 3. Guarda en localStorage
   * 4. Actualiza estado interno
   * 5. Registra historial
   *
   * Si algo falla, es difícil saber qué parte falló
   */
  async login(email: string, password: string): Promise<boolean> {
    // ❌ MALO: Modificación directa de estado sin protección
    this.isLoading = true;

    try {
      // ❌ MALO: Validación mezclada con lógica de negocio
      if (!email || !password) {
        this.isLoading = false;
        return false;
      }

      // ❌ MALO: Simulación de API directamente en el servicio
      // En código real, esto acoplaría la clase a una implementación específica de HTTP
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // ❌ MALO: Lógica de autenticación hardcodeada
      if (email === "test@test.com" && password === "123456") {
        // ❌ MALO: Creación de datos directamente aquí
        this.currentUser = {
          id: "1",
          email: email,
          name: "Usuario Test",
        };

        this.token = "fake-jwt-token-12345";
        this.isAuthenticated = true;

        // ❌ MALO: Acceso directo a localStorage - imposible de testear
        // Si localStorage no está disponible, esto explota
        localStorage.setItem("user", JSON.stringify(this.currentUser));
        localStorage.setItem("token", this.token);

        // ❌ MALO: Manejo de historial mezclado con autenticación
        this.loginHistory.push(new Date());
        localStorage.setItem("loginHistory", JSON.stringify(this.loginHistory));

        this.isLoading = false;
        return true;
      }

      this.isLoading = false;
      return false;
    } catch {
      // ❌ MALO: Manejo de errores genérico, difícil de debuggear
      this.isLoading = false;
      return false;
    }
  }

  /**
   * ❌ MALO: Logout también hace demasiadas cosas
   * Está acoplado a la implementación de login
   */
  logout(): void {
    this.currentUser = null;
    this.token = "";
    this.isAuthenticated = false;

    // ❌ MALO: Acceso directo a localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }

  /**
   * ❌ MALO: Método que intenta restaurar sesión
   * Mezcla lógica de deserialización con estado
   */
  restoreSession(): void {
    // ❌ MALO: Try-catch gigante que oculta errores específicos
    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      if (storedUser && storedToken) {
        // ❌ MALO: Parsing sin validación de esquema
        this.currentUser = JSON.parse(storedUser);
        this.token = storedToken;
        this.isAuthenticated = true;
      }
    } catch {
      // ❌ MALO: Error silencioso
      this.logout();
    }
  }

  /**
   * ❌ MALO: Getter innecesario cuando el estado es público
   * Inconsistencia: ¿por qué tener getter si la propiedad es pública?
   */
  getUser(): User | null {
    return this.currentUser;
  }

  /**
   * ❌ MALO: Método que modifica usuario sin validación
   * Cualquiera puede llamarlo con cualquier dato
   */
  updateUser(userData: Partial<User>): void {
    if (this.currentUser) {
      // ❌ MALO: Mutación directa sin validación
      this.currentUser = { ...this.currentUser, ...userData };
      localStorage.setItem("user", JSON.stringify(this.currentUser));
    }
  }
}

// ❌ MALO: Singleton global - estado compartido entre toda la aplicación
// Esto hace imposible el testing y crea dependencias ocultas
export const authService = new AuthServiceBad();
