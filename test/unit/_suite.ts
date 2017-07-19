import { expect } from 'chai';
import * as suite from 'mocha-suite';
import * as sinon from 'sinon';

export interface Utils {
  expect: Chai.ExpectStatic;
  spy: sinon.SinonSpyStatic;
  stub: sinon.SinonStubStatic;
  itShouldBeConfigurable: any;
  itShouldHaveAlias: any;
}

export default suite<Utils, any>((tests) => {
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => sandbox = sinon.sandbox.create());
  afterEach(() => sandbox.restore());

  tests({
    expect,
    spy: (...args) => (<any>sandbox.spy)(...args),
    stub: (...args) => (<any>sandbox.stub)(...args),
    itShouldBeConfigurable: (clazz) => {
      describe('configurable', () => {
        it('should set configurable to be true', () => {
          expect(clazz[Symbol.for('tag_description')].metadata.configurable).to.be.true;
        });
      });
    },
    itShouldHaveAlias: (clazz, expectedValue) => {
      describe('alias', () => {
        it('should set alias', () => {
          expect(clazz[Symbol.for('tag_description')].metadata.alias).to.eq(expectedValue);
        });
      });
    }
  });
});
