/**
 * ✅ OCP (Open/Closed Principle) - BUEN EJEMPLO
 * 
 * Solución: Abierto para EXTENSIÓN, cerrado para MODIFICACIÓN.
 * Agregar nuevos descuentos = crear nuevas clases.
 */

// ✅ Interfaz para estrategias de descuento
interface DiscountStrategy {
  readonly name: string;
  apply(price: number): number;
}

// ✅ Implementaciones - cada una en su clase
class NoDiscount implements DiscountStrategy {
  readonly name = "Sin descuento";
  apply(price: number): number {
    return price;
  }
}

class PercentageDiscount implements DiscountStrategy {
  readonly name: string;
  private percentage: number;

  constructor(percentage: number) {
    this.percentage = percentage;
    this.name = `${percentage}% de descuento`;
  }
  apply(price: number): number {
    return price - (price * this.percentage / 100);
  }
}

class FixedDiscount implements DiscountStrategy {
  readonly name: string;
  private amount: number;

  constructor(amount: number) {
    this.amount = amount;
    this.name = `$${amount} de descuento`;
  }
  apply(price: number): number {
    return Math.max(0, price - this.amount);
  }
}

class BuyOneGetOneFree implements DiscountStrategy {
  readonly name = "BOGO (2x1)";
  apply(price: number): number {
    return price / 2;
  }
}

// ✅ NUEVO DESCUENTO - Solo crear nueva clase, NO modificar nada existente
class SeasonalDiscount implements DiscountStrategy {
  readonly name = "Descuento de temporada (25%)";
  apply(price: number): number {
    return price * 0.75;
  }
}

class FirstPurchaseDiscount implements DiscountStrategy {
  readonly name = "Primera compra (30%)";
  apply(price: number): number {
    return price * 0.70;
  }
}

// ✅ Calculadora genérica - NUNCA necesita cambiar
class DiscountCalculator {
  calculate(strategy: DiscountStrategy, price: number): number {
    return strategy.apply(price);
  }
}

export function demoGood(): string[] {
  const calculator = new DiscountCalculator();
  const logs: string[] = [];
  const price = 100;

  // ✅ Todas las estrategias funcionan con el mismo código
  const strategies: DiscountStrategy[] = [
    new NoDiscount(),
    new PercentageDiscount(10),
    new FixedDiscount(15),
    new BuyOneGetOneFree(),
    new SeasonalDiscount(),        // ✅ Nuevo, sin modificar calculator
    new FirstPurchaseDiscount(),   // ✅ Nuevo, sin modificar calculator
  ];

  logs.push(`Precio original: $${price}`);
  logs.push("");

  strategies.forEach(strategy => {
    const finalPrice = calculator.calculate(strategy, price);
    logs.push(`${strategy.name}: $${finalPrice.toFixed(2)}`);
  });

  logs.push("");
  logs.push("✅ Para agregar nuevo descuento:");
  logs.push("  1. Crear nueva clase que implementa DiscountStrategy");
  logs.push("  2. ¡Listo! No se modifica código existente");

  return logs;
}

export { 
  DiscountCalculator,
  PercentageDiscount,
  SeasonalDiscount 
};
export type { DiscountStrategy };
