/**
 * ❌ ABSTRACCIÓN - MAL EJEMPLO
 *
 * Problema: El componente React conoce TODOS los detalles de implementación
 * de cómo se hace una petición HTTP. Está fuertemente acoplado.
 */

// ❌ Componente que conoce los detalles de fetch
export class UserServiceBad {
  // ❌ El cliente debe conocer la URL completa
  private baseUrl = "https://api.example.com";

  // ❌ El cliente debe conocer headers, métodos HTTP, parsing, etc.
  async getUser(id: string): Promise<{ name: string; email: string } | null> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer token-123",
        },
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return data;
    } catch {
      return null;
    }
  }

  // ❌ Cada método repite la lógica de fetch
  async createUser(name: string, email: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer token-123",
        },
        body: JSON.stringify({ name, email }),
      });

      return response.ok;
    } catch {
      return false;
    }
  }
}

// ❌ EJEMPLO DE USO - Mucha complejidad en el componente
export function demoBad(): string[] {
  const logs: string[] = [];

  logs.push("❌ Problemas de este diseño:");
  logs.push("");
  logs.push("1. El servicio conoce detalles de fetch (headers, métodos HTTP)");
  logs.push("2. Si cambias de fetch a axios, debes reescribir TODO");
  logs.push("3. Si cambia la URL base, afecta múltiples lugares");
  logs.push("4. Headers duplicados en cada método");
  logs.push("5. Difícil de testear (depende de fetch real)");
  logs.push("");
  logs.push("⚠️ En React: Tu componente estaría lleno de detalles HTTP");
  logs.push("⚠️ Cada componente repetiría la misma lógica de fetch");

  return logs;
}
