import { CalculatorFactory } from '../calculatorFactory';
import { StringCalculator } from '../stringCalculator';

describe('CalculatorFactory', () => {
  let factory: CalculatorFactory;
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    factory = new CalculatorFactory();
    // On sauvegarde l'environnement pour pouvoir le restaurer après chaque test
    originalEnv = process.env;
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    // Important : on restaure l'environnement pour ne pas affecter les autres tests
    process.env = originalEnv;
  });

  it('devrait créer une instance de StringCalculator quand demandé', () => {
    process.env.CALCULATOR_CLASS = 'StringCalculator';
    const calculator = factory.createCalculator();
    expect(calculator).toBeInstanceOf(StringCalculator);
  });

  it('devrait échouer si la variable d\'environnement n\'est pas définie', () => {
    delete process.env.CALCULATOR_CLASS;
    expect(() => factory.createCalculator()).toThrow(
      'CALCULATOR_CLASS environment variable is not set'
    );
  });

  it('devrait échouer si le type de calculateur n\'est pas connu', () => {
    process.env.CALCULATOR_CLASS = 'UnknownCalculator';
    expect(() => factory.createCalculator()).toThrow(
      "Calculator type 'UnknownCalculator' is not registered"
    );
  });

  it('devrait permettre d\'ajouter de nouveaux types de calculateurs', () => {
    // On crée un nouveau type de calculateur pour le test
    class NewCalculator extends StringCalculator {}
    
    process.env.CALCULATOR_CLASS = 'NewCalculator';
    factory.register('NewCalculator', NewCalculator);
    
    const calculator = factory.createCalculator();
    expect(calculator).toBeInstanceOf(NewCalculator);
  });
});