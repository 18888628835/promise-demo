import * as chai from "chai";
import promise2 from "./promise";
import * as sinon from "sinon";
import * as sinonChai from "sinon-Chai";
chai.use(sinonChai);
const assert = chai.assert;
describe("promise", () => {
  it("promise2是一个类", () => {
    assert.isFunction(promise2);
    assert.isObject(promise2.prototype);
  });
  it("new promise2()必须接收一个函数", () => {
    assert.throw(() => {
      //@ts-ignore
      new promise2();
    });
    assert.throw(() => {
      //@ts-ignore
      new promise2(1);
    });
  });
  it("new promise2会生成一个对象，对象有then方法", () => {
    assert.isFunction(new promise2(() => {}).then);
  });
  it("new promise2(fn)中的fn会立即执行", () => {
    let fn = sinon.fake();
    new promise2(fn);
    assert(fn.called);
  });
  it("new promise2(fn)中的fn接收resolve和reject两个函数", (done) => {
    const promise = new promise2((resolve, reject) => {
      assert.isFunction(resolve);
      assert.isFunction(reject);
      done();
    });
  });
  // 如果下面的代码中有需要等待执行的异步函数，就需要传一个done，执行完异步代码后再done()
  it("promise.then(success)中的success会在resolve调用完成后执行", (done) => {
    let success = sinon.fake();
    const promise = new promise2((resolve, reject) => {
      // 该函数没有执行
      assert.isFalse(success.called);
      resolve();
      setTimeout(() => {
        // 该函数执行了
        assert(success.called);
        done();
      }, 0);
      console.log("代码执行了");
    });
    promise.then(success, () => {});
  });
  it("promise.then(null,fail)中的fail会在reject调用完成后执行", (done) => {
    let fail = sinon.fake();
    const promise = new promise2((resolve, reject) => {
      // 该函数没有执行
      assert.isFalse(fail.called);
      reject();
      setTimeout(() => {
        // 该函数执行了
        assert(fail.called);
        done();
      }, 0);
      console.log("代码执行了");
    });
    promise.then(null, fail);
  });
  it("如果promise.then(null,null)传的不是函数，那么就忽略", () => {
    const promise = new promise2((resolve, reject) => {
      resolve();
    });
    promise.then(false, null);
  });
  it("2.2.2", (done) => {
    const fn = sinon.fake();
    const promise = new promise2((resolve, reject) => {
      assert.isFalse(fn.called);
      resolve(233);
      resolve(233);
      setTimeout(() => {
        assert(promise.state === "fulfilled");
        assert.isTrue(fn.calledOnce);
        assert(fn.calledWith(233));
        done();
      });
    });
    promise.then(fn);
  });
  it("2.2.2", (done) => {
    const fn = sinon.fake();
    const promise = new promise2((resolve, reject) => {
      assert.isFalse(fn.called);
      reject(233);
      reject(233);
      setTimeout(() => {
        assert(promise.state === "rejected");
        assert.isTrue(fn.calledOnce);
        assert(fn.calledWith(233));
        done();
      });
    });
    promise.then(null, fn);
  });
  it("在我的代码执行完之前不可以调用then函数", (done) => {
    const promise = new promise2((resolve) => {
      resolve();
    });
    const fn = sinon.fake();
    promise.then(fn);
    assert.isFalse(fn.called);
    setTimeout(() => {
      assert.isTrue(fn.called);
      done();
    }, 0);
  });
  it("fn被调用后没有this", () => {
    const promise = new promise2((resolve) => {
      resolve();
    });
    promise.then(function () {
      assert(this === undefined);
    });
  });
  it("promise可以调用多次then", (done) => {
    const promise = new promise2((resolve) => {
      resolve();
    });
    const callbacks = [sinon.fake(), sinon.fake(), sinon.fake()];
    promise.then(callbacks[0]);
    promise.then(callbacks[1]);
    promise.then(callbacks[2]);
    setTimeout(() => {
      assert(callbacks[0].called);
      assert(callbacks[1].called);
      assert(callbacks[2].called);
      assert(callbacks[1].calledAfter(callbacks[0]));
      assert(callbacks[2].calledAfter(callbacks[1]));
      done();
    }, 0);
  });
  it("promise可以调用多次then-失败情况", (done) => {
    const promise = new promise2((resolve, reject) => {
      reject();
    });
    const callbacks = [sinon.fake(), sinon.fake(), sinon.fake()];
    promise.then(null, callbacks[0]);
    promise.then(null, callbacks[1]);
    promise.then(null, callbacks[2]);
    setTimeout(() => {
      assert(callbacks[0].called);
      assert(callbacks[1].called);
      assert(callbacks[2].called);
      assert(callbacks[1].calledAfter(callbacks[0]));
      assert(callbacks[2].calledAfter(callbacks[1]));
      done();
    }, 0);
  });
});
