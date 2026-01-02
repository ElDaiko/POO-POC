/**
 * ✅ POLIMORFISMO - BUEN EJEMPLO
 *
 * Solución: Cada tipo de pago es una clase que implementa la misma interfaz.
 * Para agregar un nuevo tipo, solo creas una nueva clase.
 */

// ✅ Interfaz que define el contrato
interface PaymentMethod {
  readonly name: string;
  process(amount: number): string;
  calculateFee(amount: number): number;
}

// ✅ Cada tipo de pago es una clase independiente
class CreditCardPayment implements PaymentMethod {
  readonly name = "Tarjeta de Crédito";

  process(amount: number): string {
    return `💳 Procesando ${this.name}: $${amount}`;
  }

  calculateFee(amount: number): number {
    return amount * 0.03; // 3%
  }
}

class DebitCardPayment implements PaymentMethod {
  readonly name = "Tarjeta de Débito";

  process(amount: number): string {
    return `💳 Procesando ${this.name}: $${amount}`;
  }

  calculateFee(amount: number): number {
    return amount * 0.01; // 1%
  }
}

class PayPalPayment implements PaymentMethod {
  readonly name = "PayPal";

  process(amount: number): string {
    return `🅿️ Procesando ${this.name}: $${amount}`;
  }

  calculateFee(amount: number): number {
    return amount * 0.04; // 4%
  }
}

class CryptoPayment implements PaymentMethod {
  readonly name = "Crypto";

  process(amount: number): string {
    return `₿ Procesando ${this.name}: $${amount}`;
  }

  calculateFee(amount: number): number {
    return amount * 0.005; // 0.5%
  }
}

// ✅ Agregar nuevo tipo es FÁCIL - solo crear nueva clase
class ApplePayPayment implements PaymentMethod {
  readonly name = "Apple Pay";

  process(amount: number): string {
    return `🍎 Procesando ${this.name}: $${amount}`;
  }

  calculateFee(amount: number): number {
    return amount * 0.02; // 2%
  }
}

// ✅ Procesador genérico - NO necesita conocer los tipos específicos
class PaymentProcessor {
  // ✅ Trabaja con la abstracción, no con tipos concretos
  processPayment(method: PaymentMethod, amount: number): string[] {
    const results: string[] = [];
    results.push(method.process(amount));
    results.push(`  Fee: $${method.calculateFee(amount).toFixed(2)}`);
    results.push(
      `  Total: $${(amount + method.calculateFee(amount)).toFixed(2)}`
    );
    return results;
  }
}

// ✅ EJEMPLO DE USO - Polimorfismo en acción
export function demoGood(): string[] {
  const processor = new PaymentProcessor();
  const logs: string[] = [];
  const amount = 100;

  // ✅ Array de diferentes implementaciones
  const methods: PaymentMethod[] = [
    new CreditCardPayment(),
    new PayPalPayment(),
    new CryptoPayment(),
    new ApplePayPayment(), // ✅ Nuevo tipo sin modificar código existente
  ];

  // ✅ Mismo código procesa TODOS los tipos
  methods.forEach((method) => {
    logs.push(...processor.processPayment(method, amount));
    logs.push("");
  });

  logs.push("✅ Ventajas:");
  logs.push("  - Agregar 'GooglePay' = crear nueva clase");
  logs.push("  - PaymentProcessor NUNCA cambia");
  logs.push(
    "  - Cumple Open/Closed: abierto a extensión, cerrado a modificación"
  );

  return logs;
}

export {
  CreditCardPayment,
  DebitCardPayment,
  PayPalPayment,
  CryptoPayment,
  ApplePayPayment,
  PaymentProcessor,
};
export type { PaymentMethod };
