import { StringCalculator } from './stringCalculator';

// Un type qui garantit que toute classe de calculateur peut être instanciée
type CalculatorType = {
  new (): StringCalculator;
};

/**
 * Une factory qui permet de créer différents types de calculateurs
 * de manière flexible, en se basant sur une variable d'environnement.
 * Le type de calculateur peut être changé sans modifier le code client.
 */
export class CalculatorFactory {
  private readonly registry = new Map<string, CalculatorType>();

  constructor() {
    // On enregistre le calculateur standard au démarrage
    this.register('StringCalculator', StringCalculator);
  }

  /**
   * Permet d'ajouter de nouveaux types de calculateurs à la volée.
   * Utile pour étendre les fonctionnalités sans modifier la factory.
   */
  register(name: string, calculatorClass: CalculatorType): void {
    this.registry.set(name, calculatorClass);
  }

  /**
   * Crée un calculateur en se basant sur la variable d'environnement CALCULATOR_CLASS.
   * Si la variable n'existe pas ou pointe vers un type non enregistré, lance une erreur.
   */
  createCalculator(): StringCalculator {
    const className = process.env.CALCULATOR_CLASS;
    
    if (!className) {
      throw new Error('CALCULATOR_CLASS environment variable is not set');
    }

    const CalculatorClass = this.registry.get(className);
    
    if (!CalculatorClass) {
      throw new Error(`Calculator type '${className}' is not registered`);
    }

    return new CalculatorClass();
  }
}