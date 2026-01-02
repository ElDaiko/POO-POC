/**
 * ✅ SRP (Single Responsibility Principle) - BUEN EJEMPLO
 * 
 * Solución: Cada clase tiene UNA sola razón para cambiar.
 * Separamos validación, persistencia, emails y logs.
 */

// ✅ Clase solo para validación
class UserValidator {
  validate(email: string, password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!email.includes("@")) {
      errors.push("Email inválido");
    }
    if (password.length < 6) {
      errors.push("Password muy corta (min 6 caracteres)");
    }

    return { valid: errors.length === 0, errors };
  }
}

// ✅ Clase solo para persistencia
class UserRepository {
  private users: Map<string, { email: string; password: string }> = new Map();

  save(email: string, password: string): string {
    const id = Math.random().toString(36).substring(7);
    this.users.set(id, { email, password });
    return id;
  }

  findById(id: string) {
    return this.users.get(id);
  }
}

// ✅ Clase solo para emails
class EmailService {
  sendWelcome(email: string): string {
    return `Email de bienvenida enviado a ${email}`;
  }
}

// ✅ Clase solo para logging
class Logger {
  log(message: string): string {
    return `[${new Date().toISOString()}] ${message}`;
  }
}

// ✅ Servicio que COORDINA (no hace el trabajo, delega)
class UserRegistrationService {
  private validator: UserValidator;
  private repository: UserRepository;
  private emailService: EmailService;
  private logger: Logger;

  constructor(
    validator: UserValidator,
    repository: UserRepository,
    emailService: EmailService,
    logger: Logger
  ) {
    this.validator = validator;
    this.repository = repository;
    this.emailService = emailService;
    this.logger = logger;
  }

  async register(email: string, password: string): Promise<string[]> {
    const logs: string[] = [];

    // Delega validación
    const validation = this.validator.validate(email, password);
    if (!validation.valid) {
      logs.push(`❌ Validación fallida: ${validation.errors.join(", ")}`);
      return logs;
    }
    logs.push("✓ Validación: OK");

    // Delega persistencia
    const userId = this.repository.save(email, password);
    logs.push(`✓ Persistencia: Usuario guardado con ID ${userId}`);

    // Delega email
    logs.push(`✓ Email: ${this.emailService.sendWelcome(email)}`);

    // Delega logging
    logs.push(`✓ Log: ${this.logger.log(`Usuario ${email} registrado`)}`);

    return logs;
  }
}

export async function demoGood(): Promise<string[]> {
  // ✅ Cada clase se puede modificar independientemente
  const service = new UserRegistrationService(
    new UserValidator(),
    new UserRepository(),
    new EmailService(),
    new Logger()
  );

  const logs = await service.register("test@email.com", "password123");
  
  logs.push("");
  logs.push("✅ Cada clase tiene UNA sola responsabilidad:");
  logs.push("  - UserValidator: solo valida");
  logs.push("  - UserRepository: solo persiste");
  logs.push("  - EmailService: solo envía emails");
  logs.push("  - Logger: solo registra logs");
  logs.push("  - UserRegistrationService: solo coordina");

  return logs;
}

export { UserValidator, UserRepository, EmailService, Logger, UserRegistrationService };
