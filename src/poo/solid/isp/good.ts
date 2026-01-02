/**
 * ✅ ISP (Interface Segregation Principle) - BUEN EJEMPLO
 * 
 * Solución: Interfaces pequeñas y específicas.
 * Cada clase implementa SOLO las interfaces que necesita.
 */

// ✅ Interfaces segregadas por capacidad
interface Workable {
  work(): string;
}

interface Eatable {
  eat(): string;
}

interface Sleepable {
  sleep(): string;
}

interface Meetable {
  attendMeeting(): string;
}

interface Reportable {
  writeReport(): string;
}

interface CoffeeDrinker {
  drinkCoffee(): string;
}

// ✅ Developer implementa SOLO lo que necesita
class DeveloperGood implements Workable, Eatable, Sleepable, CoffeeDrinker {
  work(): string { return "👨‍💻 Escribiendo código"; }
  eat(): string { return "🍕 Comiendo pizza"; }
  sleep(): string { return "😴 Durmiendo poco"; }
  drinkCoffee(): string { return "☕ Café es vida"; }
  // ✅ NO implementa Meetable ni Reportable si no los necesita
}

// ✅ Manager implementa otras interfaces
class Manager implements Workable, Eatable, Meetable, Reportable, CoffeeDrinker {
  work(): string { return "👔 Coordinando equipo"; }
  eat(): string { return "🥗 Almuerzo de negocios"; }
  attendMeeting(): string { return "📅 Liderando reunión"; }
  writeReport(): string { return "📊 Preparando métricas"; }
  drinkCoffee(): string { return "☕ Espresso doble"; }
  // ✅ NO implementa Sleepable (los managers no duermen 😅)
}

// ✅ Robot implementa SOLO lo que aplica
class RobotWorkerGood implements Workable, Meetable, Reportable {
  work(): string { return "🤖 Procesando tareas"; }
  attendMeeting(): string { return "🤖 Asistiendo reunión virtual"; }
  writeReport(): string { return "🤖 Generando reporte automático"; }
  // ✅ NO implementa Eatable, Sleepable, CoffeeDrinker - ¡correcto!
}

// ✅ Funciones que aceptan interfaces específicas
function feedWorker(worker: Eatable): string {
  return worker.eat();
}

function getWork(worker: Workable): string {
  return worker.work();
}

export function demoGood(): string[] {
  const logs: string[] = [];

  const dev = new DeveloperGood();
  const manager = new Manager();
  const robot = new RobotWorkerGood();

  logs.push("--- Todos pueden trabajar (Workable) ---");
  logs.push(getWork(dev));
  logs.push(getWork(manager));
  logs.push(getWork(robot));

  logs.push("");
  logs.push("--- Solo humanos comen (Eatable) ---");
  logs.push(feedWorker(dev));
  logs.push(feedWorker(manager));
  // feedWorker(robot); ❌ Error de compilación - correcto!
  logs.push("🤖 Robot no implementa Eatable (correcto)");

  logs.push("");
  logs.push("✅ Ventajas de ISP:");
  logs.push("  - Cada clase implementa solo lo necesario");
  logs.push("  - TypeScript previene errores en tiempo de compilación");
  logs.push("  - Interfaces pequeñas = código más flexible");

  return logs;
}

export { 
  DeveloperGood, 
  Manager, 
  RobotWorkerGood 
};
export type { Workable, Eatable };
