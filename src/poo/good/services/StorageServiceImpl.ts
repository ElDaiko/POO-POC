/**
 * ✅ StorageServiceImpl.ts - IMPLEMENTACIÓN DEL SERVICIO DE ALMACENAMIENTO
 *
 * PRINCIPIOS APLICADOS:
 * 1. ENCAPSULAMIENTO: El acceso a localStorage está encapsulado
 * 2. IMPLEMENTACIÓN DE INTERFAZ: Cumple el contrato de StorageService
 * 3. RESPONSABILIDAD ÚNICA: Solo se encarga de persistencia
 *
 * BENEFICIOS:
 * - Fácil de mockear en tests
 * - Puede cambiarse por otra implementación (sessionStorage, IndexedDB)
 * - Centraliza la lógica de serialización/deserialización
 */

import type { StorageService } from "../interfaces/AuthService";

/**
 * ✅ BUENA PRÁCTICA: Implementación que cumple una interfaz
 *
 * Esta clase:
 * - Encapsula el acceso a localStorage
 * - Maneja errores de forma consistente
 * - Puede ser sustituida por un mock en testing
 */
export class LocalStorageService implements StorageService {
  // ✅ BUENO: Prefijo configurable para evitar colisiones
  private readonly prefix: string;

  constructor(prefix: string = "app_") {
    this.prefix = prefix;
  }

  /**
   * ✅ BUENO: Método privado para construir claves consistentes
   */
  private buildKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  /**
   * ✅ BUENO: Serialización centralizada con manejo de errores
   */
  set<T>(key: string, value: T): void {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(this.buildKey(key), serialized);
    } catch (error) {
      // ✅ BUENO: Error manejado, no silenciado pero no explota
      console.error(`Error saving to storage: ${key}`, error);
    }
  }

  /**
   * ✅ BUENO: Deserialización con validación de tipos
   */
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(this.buildKey(key));
      if (item === null) {
        return null;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error reading from storage: ${key}`, error);
      return null;
    }
  }

  /**
   * ✅ BUENO: Eliminación simple y directa
   */
  remove(key: string): void {
    localStorage.removeItem(this.buildKey(key));
  }

  /**
   * ✅ BUENO: Limpieza solo de claves con el prefijo de la app
   */
  clear(): void {
    const keysToRemove: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(this.prefix)) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach((key) => localStorage.removeItem(key));
  }
}

/**
 * ✅ BUENA PRÁCTICA: Implementación en memoria para testing
 *
 * Esta implementación permite:
 * - Tests sin dependencias del navegador
 * - Tests en Node.js donde no hay localStorage
 * - Tests aislados que no comparten estado
 */
export class InMemoryStorageService implements StorageService {
  private storage: Map<string, string> = new Map();

  set<T>(key: string, value: T): void {
    this.storage.set(key, JSON.stringify(value));
  }

  get<T>(key: string): T | null {
    const item = this.storage.get(key);
    if (!item) return null;

    try {
      return JSON.parse(item) as T;
    } catch {
      return null;
    }
  }

  remove(key: string): void {
    this.storage.delete(key);
  }

  clear(): void {
    this.storage.clear();
  }
}
