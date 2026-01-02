/**
 * ❌ ENCAPSULAMIENTO - MAL EJEMPLO
 *
 * Problema: Estado público que puede ser modificado desde cualquier lugar
 * sin validación ni control.
 */

export class BankAccountBad {
  // ❌ Estado público - cualquiera puede modificarlo directamente
  public balance: number = 0;
  public accountNumber: string = "";
  public owner: string = "";
  public transactions: string[] = [];

  constructor(owner: string, initialBalance: number) {
    this.owner = owner;
    this.balance = initialBalance;
    this.accountNumber = Math.random().toString(36).substring(7);
  }

  // ❌ No hay validación - se puede retirar más de lo disponible
  withdraw(amount: number): void {
    this.balance -= amount;
    this.transactions.push(`Retiro: -${amount}`);
  }
}

// ❌ EJEMPLO DE USO PROBLEMÁTICO:
export function demoBad(): string[] {
  const account = new BankAccountBad("Juan", 100);
  const logs: string[] = [];

  logs.push(`Balance inicial: $${account.balance}`);

  // ❌ Modificación directa del estado - PELIGROSO
  account.balance = 1000000;
  logs.push(`⚠️ Balance hackeado directamente: $${account.balance}`);

  // ❌ Retiro sin validación
  account.withdraw(500000);
  logs.push(`Retiro de $500000: $${account.balance}`);

  // ❌ Modificación del historial
  account.transactions = [];
  logs.push(
    `⚠️ Historial borrado: ${account.transactions.length} transacciones`
  );

  return logs;
}
