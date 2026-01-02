/**
 * ✅ LSP (Liskov Substitution Principle) - BUEN EJEMPLO
 *
 * Solución: Usar abstracción correcta. Rectangle y Square
 * son AMBOS tipos de Shape, no uno heredando del otro.
 */

// ✅ Abstracción común que ambos cumplen correctamente
interface Shape {
  getArea(): number;
  describe(): string;
}

// ✅ Rectangle es una Shape con ancho y alto independientes
class Rectangle implements Shape {
  private readonly width: number;
  private readonly height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  getArea(): number {
    return this.width * this.height;
  }

  describe(): string {
    return `Rectángulo ${this.width}×${this.height}`;
  }
}

// ✅ Square es una Shape con un solo lado
class Square implements Shape {
  private readonly side: number;

  constructor(side: number) {
    this.side = side;
  }

  getArea(): number {
    return this.side * this.side;
  }

  describe(): string {
    return `Cuadrado ${this.side}×${this.side}`;
  }
}

// ✅ Circle también es una Shape
class Circle implements Shape {
  private readonly radius: number;

  constructor(radius: number) {
    this.radius = radius;
  }

  getArea(): number {
    return Math.PI * this.radius * this.radius;
  }

  describe(): string {
    return `Círculo r=${this.radius}`;
  }
}

// ✅ Función que trabaja con la abstracción
function calculateTotalArea(shapes: Shape[]): number {
  return shapes.reduce((total, shape) => total + shape.getArea(), 0);
}

export function demoGood(): string[] {
  const logs: string[] = [];

  // ✅ Todas las shapes funcionan correctamente
  const shapes: Shape[] = [
    new Rectangle(5, 4), // Área: 20
    new Square(4), // Área: 16
    new Circle(3), // Área: ~28.27
  ];

  logs.push("--- Todas las Shapes funcionan igual ---");
  shapes.forEach((shape) => {
    logs.push(`${shape.describe()}: Área = ${shape.getArea().toFixed(2)}`);
  });

  logs.push("");
  logs.push(`Área total: ${calculateTotalArea(shapes).toFixed(2)}`);

  logs.push("");
  logs.push("✅ LSP cumplido:");
  logs.push("  - Cualquier Shape puede usarse donde se espera Shape");
  logs.push("  - No hay sorpresas ni efectos secundarios");
  logs.push("  - Rectangle y Square son hermanos, no padre-hijo");

  return logs;
}

export { Rectangle, Square, Circle };
export type { Shape };
