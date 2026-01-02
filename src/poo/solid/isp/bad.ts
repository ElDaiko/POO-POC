/**
 * ❌ ISP (Interface Segregation Principle) - MAL EJEMPLO
 *
 * Problema: Interfaz "gorda" que obliga a implementar métodos innecesarios.
 */

// ❌ Interfaz gigante - todos deben implementar TODO
interface WorkerBad {
  work(): string;
  eat(): string;
  sleep(): string;
  attendMeeting(): string;
  writeReport(): string;
  drinkCoffee(): string;
}

// ❌ Desarrollador: tiene que implementar TODO aunque no aplique
class DeveloperBad implements WorkerBad {
  work(): string {
    return "👨‍💻 Escribiendo código";
  }
  eat(): string {
    return "🍕 Comiendo pizza";
  }
  sleep(): string {
    return "😴 Durmiendo poco";
  }
  attendMeeting(): string {
    return "📅 En reunión (preferiría programar)";
  }
  writeReport(): string {
    return "📝 Escribiendo reporte (no me gusta)";
  }
  drinkCoffee(): string {
    return "☕ Café es vida";
  }
}

// ❌ Robot: obligado a implementar métodos absurdos
class RobotWorkerBad implements WorkerBad {
  work(): string {
    return "🤖 Procesando tareas";
  }

  // ❌ Un robot NO come, pero debe implementar el método
  eat(): string {
    return "🤖 ERROR: No tengo sistema digestivo";
  }

  // ❌ Un robot NO duerme
  sleep(): string {
    return "🤖 ERROR: No necesito dormir";
  }

  attendMeeting(): string {
    return "🤖 Asistiendo a reunión virtual";
  }
  writeReport(): string {
    return "🤖 Generando reporte automático";
  }

  // ❌ Un robot NO toma café
  drinkCoffee(): string {
    return "🤖 ERROR: El café daña mis circuitos";
  }
}

export function demoBad(): string[] {
  const logs: string[] = [];

  const developer = new DeveloperBad();
  const robot = new RobotWorkerBad();

  logs.push("--- Desarrollador ---");
  logs.push(developer.work());
  logs.push(developer.drinkCoffee());

  logs.push("");
  logs.push("--- Robot ---");
  logs.push(robot.work());
  logs.push(robot.eat()); // ❌ Método forzado
  logs.push(robot.sleep()); // ❌ Método forzado
  logs.push(robot.drinkCoffee()); // ❌ Método forzado

  logs.push("");
  logs.push("❌ Problemas:");
  logs.push("  - Robot implementa métodos que no tienen sentido");
  logs.push("  - Interfaz WorkerBad es demasiado grande");
  logs.push("  - Clientes dependen de métodos que no usan");

  return logs;
}

export { DeveloperBad, RobotWorkerBad };
export type { WorkerBad };
