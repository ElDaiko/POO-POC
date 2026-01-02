/**
 * ❌ COMPOSICIÓN VS HERENCIA - MAL EJEMPLO
 * 
 * Problema: Usar herencia para compartir código cuando no hay relación "es-un".
 * Resulta en jerarquías rígidas y código difícil de mantener.
 */

// ❌ Clase base con funcionalidad mezclada
class RobotBad {
  protected battery: number = 100;

  charge(): string {
    this.battery = 100;
    return "🔋 Batería cargada al 100%";
  }

  move(): string {
    this.battery -= 10;
    return `🤖 Robot moviéndose. Batería: ${this.battery}%`;
  }

  speak(): string {
    this.battery -= 5;
    return `🤖 "Hola humano". Batería: ${this.battery}%`;
  }
}

// ❌ CleaningRobot hereda TODO aunque solo necesita moverse
class CleaningRobotBad extends RobotBad {
  clean(): string {
    this.battery -= 20;
    return `🧹 Limpiando. Batería: ${this.battery}%`;
  }
  
  // ❌ Hereda speak() pero un robot de limpieza no habla
  // No podemos "quitar" el método heredado
}

// ❌ ¿Qué pasa si queremos un robot que vuela pero no habla?
// Tenemos que crear más clases base, la jerarquía explota
class FlyingRobotBad extends RobotBad {
  fly(): string {
    this.battery -= 30;
    return `🚁 Volando. Batería: ${this.battery}%`;
  }
  
  // ❌ También hereda speak() innecesariamente
}

// ❌ ¿Robot volador que limpia? Herencia múltiple no existe en TS
// class FlyingCleaningRobot extends CleaningRobotBad, FlyingRobotBad {} // ❌ ERROR

export function demoBad(): string[] {
  const logs: string[] = [];
  
  const cleaner = new CleaningRobotBad();
  logs.push(cleaner.move());
  logs.push(cleaner.clean());
  logs.push(cleaner.speak()); // ❓ ¿Por qué un robot de limpieza habla?
  
  logs.push("");
  
  const flyer = new FlyingRobotBad();
  logs.push(flyer.fly());
  logs.push(flyer.speak()); // ❓ ¿Por qué un dron habla?
  
  logs.push("");
  logs.push("❌ Problemas:");
  logs.push("  - Robots heredan métodos que no necesitan");
  logs.push("  - No podemos crear FlyingCleaningRobot (herencia múltiple)");
  logs.push("  - Jerarquía rígida y difícil de extender");

  return logs;
}

export { RobotBad, CleaningRobotBad, FlyingRobotBad };
