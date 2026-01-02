/**
 * ✅ ENCAPSULAMIENTO - BUEN EJEMPLO
 * 
 * Solución: Estado privado con métodos controlados para acceso y modificación.
 * El estado interno está protegido y solo puede cambiar a través de métodos
 * que validan las operaciones.
 */

export class BankAccountGood {
  // ✅ Estado privado - solo accesible dentro de la clase
  private _balance: number;
  private readonly _accountNumber: string;
  private readonly _owner: string;
  private _transactions: string[] = [];

  constructor(owner: string, initialBalance: number) {
    this._owner = owner;
    this._balance = initialBalance;
    this._accountNumber = Math.random().toString(36).substring(7);
  }

  // ✅ Getter - acceso controlado de solo lectura
  get balance(): number {
    return this._balance;
  }

  get owner(): string {
    return this._owner;
  }

  get accountNumber(): string {
    return this._accountNumber;
  }

  // ✅ Getter que retorna copia para evitar modificación externa
  get transactions(): readonly string[] {
    return [...this._transactions];
  }

  // ✅ Método con validación - controla cómo se modifica el estado
  withdraw(amount: number): { success: boolean; message: string } {
    if (amount <= 0) {
      return { success: false, message: "El monto debe ser positivo" };
    }

    if (amount > this._balance) {
      return { success: false, message: "Fondos insuficientes" };
    }

    this._balance -= amount;
    this._transactions.push(`Retiro: -$${amount}`);
    return { success: true, message: `Retiro exitoso. Nuevo balance: $${this._balance}` };
  }

  // ✅ Método controlado para depósitos
  deposit(amount: number): { success: boolean; message: string } {
    if (amount <= 0) {
      return { success: false, message: "El monto debe ser positivo" };
    }

    this._balance += amount;
    this._transactions.push(`Depósito: +$${amount}`);
    return { success: true, message: `Depósito exitoso. Nuevo balance: $${this._balance}` };
  }
}

// ✅ EJEMPLO DE USO SEGURO:
export function demoGood(): string[] {
  const account = new BankAccountGood("Juan", 100);
  const logs: string[] = [];

  logs.push(`Balance inicial: $${account.balance}`);

  // ✅ No se puede modificar directamente
  // account.balance = 1000000; // ❌ Error: Cannot assign to 'balance'
  logs.push(`✅ Intentar hackear balance: No es posible (propiedad de solo lectura)`);

  // ✅ Retiro con validación
  const result = account.withdraw(500000);
  logs.push(`Intento retirar $500000: ${result.message}`);

  // ✅ Retiro válido
  const result2 = account.withdraw(50);
  logs.push(`Retiro de $50: ${result2.message}`);

  // ✅ El historial es de solo lectura
  logs.push(`Transacciones: ${account.transactions.join(", ")}`);

  return logs;
}
