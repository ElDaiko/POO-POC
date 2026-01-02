/**
 * ✅ ABSTRACCIÓN - BUEN EJEMPLO
 *
 * Solución: Definimos una INTERFAZ (abstracción) que oculta los detalles.
 * El componente React solo sabe que puede "getUser" y "createUser",
 * NO sabe si usa fetch, axios, localStorage, o mock data.
 */

// ✅ ABSTRACCIÓN: Interface define el "QUÉ" (contrato), no el "CÓMO"
export type ApiClient = {
  get<T>(endpoint: string): Promise<T | null>;
  post<T>(endpoint: string, data: unknown): Promise<T | null>;
};

// ✅ Servicio de usuarios que depende de la abstracción
export class UserService {
  // ✅ Depende de la interfaz, NO de implementación concreta
  constructor(private apiClient: ApiClient) {}

  async getUser(id: string): Promise<{ name: string; email: string } | null> {
    // ✅ No sabe SI es fetch, axios, o mock - solo usa el contrato
    return this.apiClient.get(`/users/${id}`);
  }

  async createUser(
    name: string,
    email: string
  ): Promise<{ id: string } | null> {
    // ✅ Misma simplicidad - sin conocer detalles HTTP
    return this.apiClient.post("/users", { name, email });
  }
}

// ✅ IMPLEMENTACIÓN 1: Fetch real
export class FetchApiClient {
  constructor(private baseUrl: string, private token: string) {}

  async get<T>(endpoint: string): Promise<T | null> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: { Authorization: `Bearer ${this.token}` },
      });
      return response.ok ? await response.json() : null;
    } catch {
      return null;
    }
  }

  async post<T>(endpoint: string, data: unknown): Promise<T | null> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return response.ok ? await response.json() : null;
    } catch {
      return null;
    }
  }
}

// ✅ IMPLEMENTACIÓN 2: Mock para tests (mismo contrato)
export class MockApiClient {
  private users = new Map([
    ["1", { id: "1", name: "Juan", email: "juan@example.com" }],
  ]);

  async get<T>(endpoint: string): Promise<T | null> {
    const id = endpoint.split("/").pop();
    return (this.users.get(id!) as T) || null;
  }

  async post<T>(endpoint: string, data: unknown): Promise<T | null> {
    const newUser = { id: "2", ...data };
    return newUser as T;
  }
}

// ✅ EJEMPLO DE USO
export async function demoGood(): Promise<string[]> {
  const logs: string[] = [];

  logs.push("✅ Ventajas de la abstracción:");
  logs.push("");

  // ✅ Tu componente React puede cambiar de implementación SIN cambiar código
  const mockClient = new MockApiClient();
  const userService = new UserService(mockClient);

  const user = await userService.getUser("1");
  logs.push(`Usuario obtenido: ${user?.name} (${user?.email})`);

  logs.push("");
  logs.push("1. El servicio NO conoce si usa fetch, axios o mocks");
  logs.push(
    "2. Fácil cambiar de fetch a axios (solo cambias la implementación)"
  );
  logs.push("3. Fácil de testear (inyectas MockApiClient)");
  logs.push("4. Un solo lugar para lógica HTTP");
  logs.push("5. Tu componente React solo hace: userService.getUser(id)");
  logs.push("");
  logs.push("🎯 En entrevista:");
  logs.push("'La abstracción me permite cambiar de fetch a axios");
  logs.push("sin tocar mis componentes React, solo cambio la");
  logs.push("implementación de ApiClient que inyecto'");

  return logs;
}
