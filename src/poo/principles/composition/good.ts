/**
 * ✅ COMPOSICIÓN VS HERENCIA - BUEN EJEMPLO
 *
 * Solución: Componer objetos con las capacidades que necesitan.
 * "Tiene-un" en lugar de "Es-un".
 */

// ✅ Interfaces para capacidades individuales
interface Battery {
  level: number;
  consume(amount: number): void;
  charge(): string;
}

interface MovementCapability {
  move(battery: Battery): string;
}

interface SpeechCapability {
  speak(battery: Battery): string;
}

interface CleaningCapability {
  clean(battery: Battery): string;
}

interface FlightCapability {
  fly(battery: Battery): string;
}

// ✅ Implementaciones de capacidades (comportamientos)
class StandardBattery implements Battery {
  level = 100;

  consume(amount: number): void {
    this.level = Math.max(0, this.level - amount);
  }

  charge(): string {
    this.level = 100;
    return "🔋 Batería cargada al 100%";
  }
}

class WheelMovement implements MovementCapability {
  move(battery: Battery): string {
    battery.consume(10);
    return `🛞 Moviéndose con ruedas. Batería: ${battery.level}%`;
  }
}

class VoiceSpeaker implements SpeechCapability {
  speak(battery: Battery): string {
    battery.consume(5);
    return `🔊 "Hola humano". Batería: ${battery.level}%`;
  }
}

class VacuumCleaner implements CleaningCapability {
  clean(battery: Battery): string {
    battery.consume(20);
    return `🧹 Aspirando. Batería: ${battery.level}%`;
  }
}

class PropellerFlight implements FlightCapability {
  fly(battery: Battery): string {
    battery.consume(30);
    return `🚁 Volando con hélices. Batería: ${battery.level}%`;
  }
}

// ✅ Robots compuestos con SOLO las capacidades que necesitan
class CleaningRobotGood {
  private battery: Battery;
  private movement: MovementCapability;
  private cleaner: CleaningCapability;

  constructor(
    battery?: Battery,
    movement?: MovementCapability,
    cleaner?: CleaningCapability
  ) {
    this.battery = battery ?? new StandardBattery();
    this.movement = movement ?? new WheelMovement();
    this.cleaner = cleaner ?? new VacuumCleaner();
  }

  move(): string {
    return this.movement.move(this.battery);
  }
  clean(): string {
    return this.cleaner.clean(this.battery);
  }
  charge(): string {
    return this.battery.charge();
  }
  // ✅ NO tiene speak() - correcto!
}

class FlyingRobotGood {
  private battery: Battery;
  private flight: FlightCapability;

  constructor(battery?: Battery, flight?: FlightCapability) {
    this.battery = battery ?? new StandardBattery();
    this.flight = flight ?? new PropellerFlight();
  }

  fly(): string {
    return this.flight.fly(this.battery);
  }
  charge(): string {
    return this.battery.charge();
  }
  // ✅ NO tiene speak() ni clean() - correcto!
}

// ✅ Robot volador que limpia - FÁCIL con composición
class FlyingCleaningRobot {
  private battery: Battery;
  private flight: FlightCapability;
  private cleaner: CleaningCapability;

  constructor(
    battery?: Battery,
    flight?: FlightCapability,
    cleaner?: CleaningCapability
  ) {
    this.battery = battery ?? new StandardBattery();
    this.flight = flight ?? new PropellerFlight();
    this.cleaner = cleaner ?? new VacuumCleaner();
  }

  fly(): string {
    return this.flight.fly(this.battery);
  }
  clean(): string {
    return this.cleaner.clean(this.battery);
  }
  charge(): string {
    return this.battery.charge();
  }
}

// ✅ Robot asistente que habla y se mueve
class AssistantRobot {
  private battery: Battery;
  private movement: MovementCapability;
  private speaker: SpeechCapability;

  constructor(
    battery?: Battery,
    movement?: MovementCapability,
    speaker?: SpeechCapability
  ) {
    this.battery = battery ?? new StandardBattery();
    this.movement = movement ?? new WheelMovement();
    this.speaker = speaker ?? new VoiceSpeaker();
  }

  move(): string {
    return this.movement.move(this.battery);
  }
  speak(): string {
    return this.speaker.speak(this.battery);
  }
  charge(): string {
    return this.battery.charge();
  }
}

export function demoGood(): string[] {
  const logs: string[] = [];

  logs.push("--- Robot de Limpieza (mueve + limpia) ---");
  const cleaner = new CleaningRobotGood();
  logs.push(cleaner.move());
  logs.push(cleaner.clean());
  // cleaner.speak() ❌ No existe - correcto!

  logs.push("");
  logs.push("--- Robot Volador Limpiador (vuela + limpia) ---");
  const flyingCleaner = new FlyingCleaningRobot();
  logs.push(flyingCleaner.fly());
  logs.push(flyingCleaner.clean());

  logs.push("");
  logs.push("--- Robot Asistente (mueve + habla) ---");
  const assistant = new AssistantRobot();
  logs.push(assistant.move());
  logs.push(assistant.speak());

  logs.push("");
  logs.push("✅ Ventajas:");
  logs.push("  - Cada robot tiene SOLO lo que necesita");
  logs.push("  - Combinaciones flexibles sin herencia múltiple");
  logs.push("  - Fácil agregar nuevas capacidades");

  return logs;
}

export {
  CleaningRobotGood,
  FlyingRobotGood,
  FlyingCleaningRobot,
  AssistantRobot,
  StandardBattery,
};
export type { Battery };
