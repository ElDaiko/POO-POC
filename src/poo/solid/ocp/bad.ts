/**
 * ❌ OCP (Open/Closed Principle) - MAL EJEMPLO
 * 
 * Problema: Para agregar un nuevo tipo de descuento,
 * hay que MODIFICAR la clase existente.
 */

type DiscountType = "none" | "percentage" | "fixed" | "bogo";

class DiscountCalculatorBad {
  // ❌ Cada nuevo tipo requiere modificar este método
  calculate(type: DiscountType, price: number, value: number): number {
    switch (type) {
      case "none":
        return price;
      case "percentage":
        return price - (price * value / 100);
      case "fixed":
        return price - value;
      case "bogo": // Buy One Get One
        return price / 2;
      // ❌ Para agregar "seasonal" hay que modificar este switch
      default:
        return price;
    }
  }
}

export function demoBad(): string[] {
  const calculator = new DiscountCalculatorBad();
  const logs: string[] = [];
  const price = 100;

  logs.push(`Precio original: $${price}`);
  logs.push(`Sin descuento: $${calculator.calculate("none", price, 0)}`);
  logs.push(`10% descuento: $${calculator.calculate("percentage", price, 10)}`);
  logs.push(`$15 descuento: $${calculator.calculate("fixed", price, 15)}`);
  logs.push(`BOGO: $${calculator.calculate("bogo", price, 0)}`);

  logs.push("");
  logs.push("❌ Para agregar descuento 'seasonal':");
  logs.push("  1. Modificar el type DiscountType");
  logs.push("  2. Agregar case al switch");
  logs.push("  3. Recompilar y re-testear TODO");

  return logs;
}

export { DiscountCalculatorBad };
