
const functions = require("./jaettavissa");
const onJaettavissa = functions.onJaettavissa;

//testitapaukset positiivisille luvuille
describe('positiiviset luvut', () => {

  test('1/3', () => {
    const result = onJaettavissa(1,3);

    expect(result).toBe(false);
  });

  test('3/1', () => {
    const result = onJaettavissa(3,1);

    expect(result).toBe(true);
  });

  test('1024/50', () => {
    const result = onJaettavissa(1024,50);

    expect(result).toBe(false);
  });

  test('50/50', () => {
    const result = onJaettavissa(50,50);

    expect(result).toBe(true);
  });

});

//testitapaukset negatiivisille luvuille
describe('negatiiviset luvut', () => {

  test('-1/-3', () => {
    const result = onJaettavissa(-1,-3);

    expect(result).toBe(false);
  });

  test('-3/-1', () => {
    const result = onJaettavissa(-3,-1);

    expect(result).toBe(true);
  });

  test('-1024/-50', () => {
    const result = onJaettavissa(-1024,-50);

    expect(result).toBe(false);
  });

  test('-50/-50', () => {
    const result = onJaettavissa(-50,-50);

    expect(result).toBe(true);
  });

});

//testitapaukset sekalaisille luvuille
describe('sekalaiset luvut', () => {

  test('-1/2', () => {
    const result = onJaettavissa(-1,2);

    expect(result).toBe(false);
  });

  test('3/-1', () => {
    const result = onJaettavissa(3,-1);

    expect(result).toBe(true);
  });

  test('-1024/50', () => {
    const result = onJaettavissa(-1024,50);

    expect(result).toBe(false);
  });

  test('50/-50', () => {
    const result = onJaettavissa(50,-50);

    expect(result).toBe(true);
  });

});

//testitapaukset erikoistapauksille
describe('erikoistapaukset', () => {

  test('lukua ei voi jakaa nollalla', () => {
    expect(() => {
      onJaettavissa(50,0);
    }).toThrow("lukua ei voi jakaa nollalla");
  });

  test('ei argumentteja', () => {
    expect(() => {
      onJaettavissa();
    }).toThrow("argumentit puuttuvat");
  });

});