import * as chai from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";
import promise from "./promise2";
const assert = chai.assert;
const expect = chai.expect;
chai.use(sinonChai);
describe("测试promise的功能", () => {
  it("不加new不能调用", () => {
    assert.throw(() => {
      //@ts-ignore
      promise();
    });
  });
  it("不传函数不能调用", () => {
    assert.throw(() => {
      //@ts-ignore
      new promise(1);
    });
    assert(new promise(() => {}));
  });
  it("函数传了之后立即执行", () => {
    const fn = sinon.fake();
    new promise(fn);
    assert(fn.called);
  });
  it("传入的函数有一个reject和resolve都是函数", () => {
    const p = new promise((resolve, reject) => {
      assert.isFunction(resolve);
      assert.isFunction(reject);
    });
  });
  it("new promise后返回一个对象，它有一个status是pending", () => {
    const p = new promise((resolve, reject) => {});
    assert.isObject(p);
    assert(p.status === "pending");
  });
  it("new promise后如果调用resolve，那么status会变成fulfilled", () => {
    const a = new promise((resolve, reject) => {
      resolve();
    });
    assert(a.status === "fulfilled");
  });
  it("new promise后如果调用reject，那么status会变成rejected", () => {
    const a = new promise((resolve, reject) => {
      reject();
    });
    assert(a.status === "rejected");
  });
  it("重复调用resolve或者reject，status不会改变", () => {
    const a = new promise((resolve, reject) => {
      resolve();
      reject();
    });
    assert(a.status === "fulfilled");
  });
  it("new promise实例有一个then方法", () => {
    assert.isFunction(new promise((resolve, reject) => {}).then);
  });
  it("resolve**之后**会执行then的第一个参数函数", (done) => {
    const fn = sinon.fake();
    const p = new promise((resolve, reject) => {
      resolve();
    });
    p.then(fn, () => {});
    //之前没执行
    assert.isFalse(fn.called);
    setTimeout(() => {
      // 断言之后执行了
      assert.isTrue(fn.called);
      done();
    }, 0);
  });
  it("reject**之后**会执行then的第二个参数函数", (done) => {
    const fn = sinon.fake();
    const p = new promise((resolve, reject) => {
      reject();
    });
    p.then(null, fn);
    //之前没执行
    assert.isFalse(fn.called);
    setTimeout(() => {
      // 断言之后执行了
      assert.isTrue(fn.called);
      done();
    }, 0);
  });
  it("then可以调用多次fn--成功情况", (done) => {
    const fn1 = sinon.fake();
    const fn2 = sinon.fake();
    const p = new promise((resolve, reject) => {
      resolve();
    });
    p.then(fn1, null);
    p.then(fn2, null);
    setTimeout(() => {
      assert(fn1.calledOnce);
      assert(fn1.calledBefore(fn2));
      done();
    }, 0);
  });
  it("then可以调用多次fn--失败情况", (done) => {
    const fn1 = sinon.fake();
    const fn2 = sinon.fake();
    const p = new promise((resolve, reject) => {
      reject();
    });
    p.then(null, fn1);
    p.then(null, fn2);
    setTimeout(() => {
      assert(fn1.calledOnce);
      assert(fn1.calledBefore(fn2));
      done();
    }, 0);
  });
  it("resolve、reject都调用,then参数都传，看看有没有执行正确", (done) => {
    const fn1 = sinon.fake();
    const fn2 = sinon.fake();
    const p = new promise((resolve, reject) => {
      resolve();
      reject();
    });
    p.then(fn1, fn2);
    setTimeout(() => {
      assert(fn1.called);
      assert.isFalse(fn2.called);
      done();
    }, 0);
  });
  it("resolve或者reject后可以传递参数", () => {
    const p = new promise((resolve, reject) => {
      resolve(2);
    });
    p.then((r) => {
      assert(r === 2);
    });
    new promise((resolve, reject) => reject("错误")).then(null, (reason) => {
      assert(reason === "错误");
    });
  });
});
