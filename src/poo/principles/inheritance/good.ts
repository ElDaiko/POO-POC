/**
 * ✅ HERENCIA - BUEN EJEMPLO
 *
 * Solución: Usar herencia SOLO cuando hay relación "es-un" verdadera.
 * Un Pato ES un Animal. Un Pato PUEDE volar (interfaz).
 */

// ✅ Interfaz para capacidades compartidas
interface Flyable {
  fly(): string;
}

interface Swimmable {
  swim(): string;
}

// ✅ Clase base con relación "es-un" real
abstract class Animal {
  protected readonly name: string;
  protected energy: number;

  constructor(name: string, energy: number = 100) {
    this.name = name;
    this.energy = energy;
  }

  abstract makeSound(): string;

  eat(food: string): string {
    this.energy += 10;
    return `${this.name} come ${food}. Energía: ${this.energy}`;
  }

  sleep(): string {
    this.energy += 20;
    return `${this.name} duerme. Energía: ${this.energy}`;
  }
}

// ✅ Duck ES un Animal y PUEDE volar y nadar
class DuckGood extends Animal implements Flyable, Swimmable {
  constructor() {
    super("Pato", 100);
  }

  makeSound(): string {
    return "🦆 Cuack!";
  }

  // ✅ Implementación específica de vuelo para patos
  fly(): string {
    this.energy -= 15;
    return `🦆 ${this.name} vuela bajo sobre el estanque. Energía: ${this.energy}`;
  }

  // ✅ Los patos sí pueden nadar
  swim(): string {
    this.energy -= 5;
    return `🦆 ${this.name} nada en el estanque. Energía: ${this.energy}`;
  }
}

// ✅ Airplane NO hereda de Animal - es una clase separada
class AirplaneGood implements Flyable {
  private fuel: number = 100;

  fly(): string {
    this.fuel -= 20;
    return `✈️ Avión volando a 10,000m. Combustible: ${this.fuel}%`;
  }

  refuel(): string {
    this.fuel = 100;
    return `✈️ Avión repostado. Combustible: ${this.fuel}%`;
  }
}

// ✅ Dog ES un Animal pero NO puede volar
class Dog extends Animal implements Swimmable {
  constructor() {
    super("Perro", 100);
  }

  makeSound(): string {
    return "🐕 Guau!";
  }

  swim(): string {
    this.energy -= 10;
    return `🐕 ${this.name} nada. Energía: ${this.energy}`;
  }

  fetch(): string {
    this.energy -= 5;
    return `🐕 ${this.name} busca la pelota. Energía: ${this.energy}`;
  }
}

// ✅ EJEMPLO DE USO - Polimorfismo bien aplicado
export function demoGood(): string[] {
  const logs: string[] = [];

  const duck = new DuckGood();
  const airplane = new AirplaneGood();
  const dog = new Dog();

  logs.push("--- Cosas que vuelan (Flyable) ---");

  // ✅ Polimorfismo: mismo método, diferentes implementaciones
  const flyables: Flyable[] = [duck, airplane];
  flyables.forEach((f) => logs.push(f.fly()));

  logs.push("");
  logs.push("--- Cosas que nadan (Swimmable) ---");

  const swimmers: Swimmable[] = [duck, dog];
  swimmers.forEach((s) => logs.push(s.swim()));

  logs.push("");
  logs.push("--- Solo animales pueden comer ---");
  logs.push(duck.eat("pan"));
  logs.push(dog.eat("croquetas"));
  // airplane.eat() ❌ No existe - correcto!

  logs.push("");
  logs.push("✅ Cada clase tiene solo lo que le corresponde");

  return logs;
}

export { DuckGood, AirplaneGood, Dog, Animal };
export type { Flyable, Swimmable };
