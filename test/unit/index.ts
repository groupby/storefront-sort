import * as pkg from '../../src';
import Sort from '../../src/sort';
import suite from './_suite';

suite('package', ({ expect }) => {
  it('should expose Sort', () => {
    expect(pkg).to.eq(Sort);
  });
});
