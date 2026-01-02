/**
 * ❌ HERENCIA - MAL EJEMPLO
 *
 * Problema: Usar herencia cuando NO hay relación "es-un".
 * Un Pato NO ES un Avión, aunque ambos puedan "volar".
 */

// ❌ Clase base con comportamiento específico
class AirplaneBad {
  protected fuel: number = 100;
  protected altitude: number = 0;

  startEngine(): string {
    this.fuel -= 10;
    return "🛩️ Motor de turbina encendido";
  }

  fly(): string {
    if (this.fuel <= 0) {
      return "⚠️ Sin combustible!";
    }
    this.altitude = 10000;
    this.fuel -= 20;
    return `Volando a ${this.altitude}m de altura`;
  }

  land(): string {
    this.altitude = 0;
    return "Aterrizando en pista";
  }

  refuel(): string {
    this.fuel = 100;
    return "Repostando combustible";
  }
}

// ❌ MAL: Pato hereda de Avión porque ambos "vuelan"
// Pero un pato NO ES un avión
class DuckBad extends AirplaneBad {
  quack(): string {
    return "🦆 Cuack!";
  }

  // ❌ Tenemos que sobrescribir métodos que no tienen sentido
  startEngine(): string {
    // Un pato no tiene motor... pero heredamos este método
    return "🦆 Agitando alas...";
  }

  // ❌ El combustible no aplica a un pato
  fly(): string {
    this.altitude = 50; // Los patos no vuelan tan alto
    return `Pato volando a ${this.altitude}m`;
  }

  // ❌ Método heredado que no tiene sentido
  refuel(): string {
    // ¿Repostar un pato? 🤔
    return "🦆 Comiendo pan...?";
  }
}

// ❌ EJEMPLO DE USO - Problemas evidentes
export function demoBad(): string[] {
  const logs: string[] = [];
  const duck = new DuckBad();

  logs.push(duck.quack());
  logs.push(duck.startEngine()); // ❓ ¿Motor en un pato?
  logs.push(duck.fly());
  logs.push(duck.refuel()); // ❓ ¿Repostar un pato?
  logs.push(`⚠️ Fuel del pato: ${duck["fuel"]}`); // ❓ ¿Combustible?

  logs.push("");
  logs.push(
    "❌ Problema: Duck tiene propiedades y métodos que no le corresponden"
  );
  logs.push("❌ Un Pato NO ES un Avión, solo comparten que pueden volar");

  return logs;
}

export { DuckBad, AirplaneBad };
