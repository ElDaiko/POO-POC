/**
 * ❌ LSP (Liskov Substitution Principle) - MAL EJEMPLO
 *
 * Problema: Las clases hijas NO pueden sustituir a la clase padre
 * sin romper el comportamiento esperado.
 */

class RectangleBad {
  protected _width: number = 0;
  protected _height: number = 0;

  setWidth(width: number): void {
    this._width = width;
  }

  setHeight(height: number): void {
    this._height = height;
  }

  getWidth(): number {
    return this._width;
  }

  getHeight(): number {
    return this._height;
  }

  getArea(): number {
    return this._width * this._height;
  }
}

// ❌ Square hereda de Rectangle pero VIOLA el contrato
class SquareBad extends RectangleBad {
  // ❌ Sobrescribe para mantener ancho = alto
  setWidth(width: number): void {
    this._width = width;
    this._height = width; // ❌ Efecto secundario inesperado!
  }

  setHeight(height: number): void {
    this._width = height; // ❌ Efecto secundario inesperado!
    this._height = height;
  }
}

// ❌ Función que espera comportamiento de Rectangle
function calculateAreaBad(rectangle: RectangleBad): string[] {
  const logs: string[] = [];

  rectangle.setWidth(5);
  rectangle.setHeight(4);

  logs.push(`Ancho establecido: 5`);
  logs.push(`Alto establecido: 4`);
  logs.push(`Área esperada: 20 (5 × 4)`);
  logs.push(`Área real: ${rectangle.getArea()}`);

  return logs;
}

export function demoBad(): string[] {
  const logs: string[] = [];

  logs.push("--- Con Rectangle (funciona bien) ---");
  const rect = new RectangleBad();
  logs.push(...calculateAreaBad(rect));

  logs.push("");
  logs.push("--- Con Square (¡ROMPE!) ---");
  const square = new SquareBad();
  logs.push(...calculateAreaBad(square)); // ❌ Área = 16, no 20!

  logs.push("");
  logs.push("❌ Problema: Square no puede sustituir a Rectangle");
  logs.push("❌ El código que funciona con Rectangle falla con Square");
  logs.push("❌ Esto viola LSP: los subtipos deben ser sustituibles");

  return logs;
}

export { RectangleBad, SquareBad };
