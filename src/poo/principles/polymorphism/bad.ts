/**
 * ❌ POLIMORFISMO - MAL EJEMPLO
 * 
 * Problema: Usar condicionales (if/switch) en lugar de polimorfismo.
 * Cada vez que agregas un tipo, debes modificar TODOS los switch/if.
 */

type PaymentType = "credit" | "debit" | "paypal" | "crypto";

// ❌ Clase que maneja TODOS los tipos de pago con condicionales
class PaymentProcessorBad {
  processPayment(type: PaymentType, amount: number): string {
    // ❌ Switch gigante - viola Open/Closed Principle
    switch (type) {
      case "credit":
        return this.processCreditCard(amount);
      case "debit":
        return this.processDebitCard(amount);
      case "paypal":
        return this.processPayPal(amount);
      case "crypto":
        return this.processCrypto(amount);
      default:
        return "Tipo de pago no soportado";
    }
  }

  calculateFee(type: PaymentType, amount: number): number {
    // ❌ Otro switch - duplicación de lógica de tipos
    switch (type) {
      case "credit":
        return amount * 0.03; // 3%
      case "debit":
        return amount * 0.01; // 1%
      case "paypal":
        return amount * 0.04; // 4%
      case "crypto":
        return amount * 0.005; // 0.5%
      default:
        return 0;
    }
  }

  // ❌ Métodos privados para cada tipo - clase gigante
  private processCreditCard(amount: number): string {
    return `💳 Procesando tarjeta de crédito: $${amount}`;
  }

  private processDebitCard(amount: number): string {
    return `💳 Procesando tarjeta de débito: $${amount}`;
  }

  private processPayPal(amount: number): string {
    return `🅿️ Procesando PayPal: $${amount}`;
  }

  private processCrypto(amount: number): string {
    return `₿ Procesando crypto: $${amount}`;
  }
}

// ❌ EJEMPLO DE USO
export function demoBad(): string[] {
  const processor = new PaymentProcessorBad();
  const logs: string[] = [];
  const amount = 100;

  logs.push(processor.processPayment("credit", amount));
  logs.push(`  Fee: $${processor.calculateFee("credit", amount)}`);
  
  logs.push(processor.processPayment("paypal", amount));
  logs.push(`  Fee: $${processor.calculateFee("paypal", amount)}`);

  logs.push("");
  logs.push("❌ Problemas:");
  logs.push("  - Para agregar 'ApplePay' hay que modificar TODOS los switch");
  logs.push("  - La clase crece infinitamente con cada tipo nuevo");
  logs.push("  - Viola Open/Closed: abierto a modificación");

  return logs;
}

export { PaymentProcessorBad };
