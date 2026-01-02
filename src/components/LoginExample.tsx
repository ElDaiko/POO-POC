/**
 * ✅ LoginExample.tsx - COMPONENTE DE UI QUE CONSUME LÓGICA DE NEGOCIO
 *
 * PRINCIPIOS DEMOSTRADOS:
 * 1. SEPARACIÓN UI/LÓGICA: React solo renderiza, no contiene lógica de negocio
 * 2. COMPOSICIÓN DE SERVICIOS: Se ensamblan las dependencias en un solo lugar
 * 3. INVERSIÓN DE CONTROL: La UI no crea las dependencias, las recibe configuradas
 *
 * COMPARACIÓN BAD vs GOOD:
 *
 * ❌ BAD: La UI importa directamente el singleton y accede a su estado
 * ✅ GOOD: La UI usa un caso de uso que orquesta servicios inyectados
 */

import React, { useState, useEffect, useMemo } from "react";

// ❌ IMPORTS BAD - Para demostración de malas prácticas
import { authService as badAuthService } from "../poo/bad/AuthServiceBad";
import { userManager as badUserManager } from "../poo/bad/UserManagerBad";

// ✅ IMPORTS GOOD - Para demostración de buenas prácticas
import { AuthServiceImpl } from "../poo/good/services/AuthServiceImpl";
import { LocalStorageService } from "../poo/good/services/StorageServiceImpl";
import { SessionManager } from "../poo/good/session/SessionManager";
import { LoginUserUseCase } from "../poo/good/use-cases/LoginUserUseCase";
import type { AuthState } from "../poo/good/use-cases/LoginUserUseCase";

/**
 * ✅ BUENA PRÁCTICA: Factory function que ensambla las dependencias
 *
 * Este es el único lugar donde se crean las implementaciones concretas.
 * El resto de la aplicación trabaja con interfaces.
 */
function createLoginUseCase(): LoginUserUseCase {
  // Crear implementaciones concretas
  const storageService = new LocalStorageService("poo_demo_");
  const authService = new AuthServiceImpl();
  const sessionManager = new SessionManager(storageService);

  // Inyectar dependencias en el caso de uso
  return new LoginUserUseCase(authService, sessionManager);
}

/**
 * Estilos en línea para el ejemplo (evitar dependencias externas)
 */
const styles = {
  container: {
    fontFamily: "system-ui, -apple-system, sans-serif",
    maxWidth: "900px",
    margin: "0 auto",
    padding: "20px",
  },
  header: {
    textAlign: "center" as const,
    marginBottom: "40px",
  },
  columns: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "30px",
  },
  card: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "20px",
    backgroundColor: "#fff",
  },
  cardBad: {
    borderColor: "#e74c3c",
    backgroundColor: "#fdf2f2",
  },
  cardGood: {
    borderColor: "#27ae60",
    backgroundColor: "#f2fdf5",
  },
  title: {
    margin: "0 0 15px 0",
    fontSize: "18px",
  },
  titleBad: {
    color: "#e74c3c",
  },
  titleGood: {
    color: "#27ae60",
  },
  form: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px",
  },
  input: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "14px",
  },
  button: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold" as const,
  },
  buttonBad: {
    backgroundColor: "#e74c3c",
    color: "white",
  },
  buttonGood: {
    backgroundColor: "#27ae60",
    color: "white",
  },
  buttonDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
  status: {
    marginTop: "15px",
    padding: "10px",
    borderRadius: "4px",
    fontSize: "13px",
  },
  error: {
    backgroundColor: "#fde2e2",
    color: "#c0392b",
  },
  success: {
    backgroundColor: "#d4edda",
    color: "#155724",
  },
  codeBlock: {
    backgroundColor: "#2d2d2d",
    color: "#f8f8f2",
    padding: "15px",
    borderRadius: "4px",
    fontSize: "12px",
    overflow: "auto",
    marginTop: "15px",
  },
  hint: {
    fontSize: "12px",
    color: "#666",
    marginTop: "10px",
    fontStyle: "italic" as const,
  },
};

/**
 * ❌ COMPONENTE CON MALAS PRÁCTICAS
 *
 * Problemas:
 * - Accede directamente al singleton global
 * - Lee estado público de la clase
 * - La UI conoce los detalles de implementación
 */
const BadLoginExample: React.FC = () => {
  const [email, setEmail] = useState("test@test.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState<string | null>(null);

  // ❌ MALO: Acceso directo a estado público del singleton
  // Restaurar sesión al inicio (inicialización síncrona para evitar warning de useEffect)
  const getInitialAuthState = () => {
    badAuthService.restoreSession();
    return badAuthService.isAuthenticated;
  };
  const [isAuthenticated, setIsAuthenticated] = useState(getInitialAuthState);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setError(null);
    setIsLoading(true);

    // ❌ MALO: Llamada directa al singleton
    const success = await badAuthService.login(email, password);

    if (success) {
      // ❌ MALO: Leer estado público directamente
      setIsAuthenticated(badAuthService.isAuthenticated);

      // ❌ MALO: Usar otro singleton que depende del primero
      badUserManager.loadPermissions();
    } else {
      setError("Credenciales inválidas");
    }

    setIsLoading(false);
  };

  const handleLogout = () => {
    // ❌ MALO: Modificación directa
    badAuthService.logout();
    setIsAuthenticated(false);
  };

  return (
    <div style={{ ...styles.card, ...styles.cardBad }}>
      <h3 style={{ ...styles.title, ...styles.titleBad }}>
        ❌ Implementación BAD
      </h3>

      {!isAuthenticated ? (
        <div style={styles.form}>
          <input
            style={styles.input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            style={styles.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button
            style={{
              ...styles.button,
              ...styles.buttonBad,
              ...(isLoading ? styles.buttonDisabled : {}),
            }}
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? "Cargando..." : "Login"}
          </button>

          {error && (
            <div style={{ ...styles.status, ...styles.error }}>{error}</div>
          )}
        </div>
      ) : (
        <div>
          <div style={{ ...styles.status, ...styles.success }}>
            ✓ Autenticado como: {badAuthService.currentUser?.name}
          </div>
          <button
            style={{ ...styles.button, ...styles.buttonBad, marginTop: "10px" }}
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}

      <div style={styles.hint}>
        💡 Este código accede directamente a propiedades públicas del singleton
      </div>

      <pre style={styles.codeBlock}>
        {`// ❌ Problemas:
const success = await badAuthService.login(email, password);
setIsAuthenticated(badAuthService.isAuthenticated);
console.log(badAuthService.token); // Token expuesto!`}
      </pre>
    </div>
  );
};

/**
 * ✅ COMPONENTE CON BUENAS PRÁCTICAS
 *
 * Características:
 * - No conoce los detalles de implementación
 * - Usa un caso de uso que orquesta todo
 * - Las dependencias se inyectan vía factory
 */
const GoodLoginExample: React.FC = () => {
  // ✅ BUENO: Crear caso de uso una sola vez con useMemo
  const loginUseCase = useMemo(() => createLoginUseCase(), []);

  const [email, setEmail] = useState("test@test.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState<string | null>(null);
  const [authState, setAuthState] = useState<AuthState>(() =>
    loginUseCase.getAuthState()
  );

  // ✅ BUENO: Sincronizar estado al montar
  useEffect(() => {
    setAuthState(loginUseCase.getAuthState());
  }, [loginUseCase]);

  const handleLogin = async () => {
    setError(null);

    // ✅ BUENO: Una sola llamada al caso de uso
    const result = await loginUseCase.execute(email, password);

    if (result.success) {
      // ✅ BUENO: Obtener estado actualizado del caso de uso
      setAuthState(loginUseCase.getAuthState());
    } else {
      setError(result.error ?? "Error desconocido");
    }
  };

  const handleLogout = async () => {
    // ✅ BUENO: Logout a través del caso de uso
    await loginUseCase.logout();
    setAuthState(loginUseCase.getAuthState());
  };

  return (
    <div style={{ ...styles.card, ...styles.cardGood }}>
      <h3 style={{ ...styles.title, ...styles.titleGood }}>
        ✅ Implementación GOOD
      </h3>

      {!authState.isAuthenticated ? (
        <div style={styles.form}>
          <input
            style={styles.input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            style={styles.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button
            style={{
              ...styles.button,
              ...styles.buttonGood,
              ...(authState.isLoading ? styles.buttonDisabled : {}),
            }}
            onClick={handleLogin}
            disabled={authState.isLoading}
          >
            {authState.isLoading ? "Cargando..." : "Login"}
          </button>

          {error && (
            <div style={{ ...styles.status, ...styles.error }}>{error}</div>
          )}
        </div>
      ) : (
        <div>
          <div style={{ ...styles.status, ...styles.success }}>
            ✓ Autenticado como: {authState.user?.name}
          </div>
          <button
            style={{
              ...styles.button,
              ...styles.buttonGood,
              marginTop: "10px",
            }}
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}

      <div style={styles.hint}>
        💡 Este código usa un caso de uso que orquesta servicios inyectados
      </div>

      <pre style={styles.codeBlock}>
        {`// ✅ Ventajas:
const result = await loginUseCase.execute(email, password);
// - La UI no conoce AuthService ni SessionManager
// - Fácil de testear
// - Dependencias inyectadas`}
      </pre>
    </div>
  );
};

/**
 * ✅ COMPONENTE PRINCIPAL
 *
 * Muestra lado a lado las dos implementaciones para comparación
 */
export const LoginExample: React.FC = () => {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>🎓 POO en TypeScript - Comparación Bad vs Good</h1>
        <p>
          Usa <strong>test@test.com / 123456</strong> para probar ambos logins
        </p>
      </header>

      <div style={styles.columns}>
        <BadLoginExample />
        <GoodLoginExample />
      </div>

      <div
        style={{
          marginTop: "40px",
          padding: "20px",
          backgroundColor: "#f8f9fa",
          borderRadius: "8px",
        }}
      >
        <h3>📚 Resumen de Diferencias</h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#e9ecef" }}>
              <th
                style={{
                  padding: "10px",
                  textAlign: "left",
                  borderBottom: "2px solid #dee2e6",
                }}
              >
                Aspecto
              </th>
              <th
                style={{
                  padding: "10px",
                  textAlign: "left",
                  borderBottom: "2px solid #dee2e6",
                  color: "#e74c3c",
                }}
              >
                ❌ Bad
              </th>
              <th
                style={{
                  padding: "10px",
                  textAlign: "left",
                  borderBottom: "2px solid #dee2e6",
                  color: "#27ae60",
                }}
              >
                ✅ Good
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                style={{ padding: "10px", borderBottom: "1px solid #dee2e6" }}
              >
                Estado
              </td>
              <td
                style={{ padding: "10px", borderBottom: "1px solid #dee2e6" }}
              >
                Público, mutable
              </td>
              <td
                style={{ padding: "10px", borderBottom: "1px solid #dee2e6" }}
              >
                Privado, controlado
              </td>
            </tr>
            <tr>
              <td
                style={{ padding: "10px", borderBottom: "1px solid #dee2e6" }}
              >
                Dependencias
              </td>
              <td
                style={{ padding: "10px", borderBottom: "1px solid #dee2e6" }}
              >
                Singleton global
              </td>
              <td
                style={{ padding: "10px", borderBottom: "1px solid #dee2e6" }}
              >
                Inyección
              </td>
            </tr>
            <tr>
              <td
                style={{ padding: "10px", borderBottom: "1px solid #dee2e6" }}
              >
                Testing
              </td>
              <td
                style={{ padding: "10px", borderBottom: "1px solid #dee2e6" }}
              >
                Difícil
              </td>
              <td
                style={{ padding: "10px", borderBottom: "1px solid #dee2e6" }}
              >
                Fácil (mocks)
              </td>
            </tr>
            <tr>
              <td
                style={{ padding: "10px", borderBottom: "1px solid #dee2e6" }}
              >
                Acoplamiento
              </td>
              <td
                style={{ padding: "10px", borderBottom: "1px solid #dee2e6" }}
              >
                Alto
              </td>
              <td
                style={{ padding: "10px", borderBottom: "1px solid #dee2e6" }}
              >
                Bajo
              </td>
            </tr>
            <tr>
              <td
                style={{ padding: "10px", borderBottom: "1px solid #dee2e6" }}
              >
                Reutilización
              </td>
              <td
                style={{ padding: "10px", borderBottom: "1px solid #dee2e6" }}
              >
                Limitada
              </td>
              <td
                style={{ padding: "10px", borderBottom: "1px solid #dee2e6" }}
              >
                Alta
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LoginExample;
