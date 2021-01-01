class promise2 {
  callbacks = [];
  state = "pending";
  resolve(result) {
    if (this.state === "fulfilled") return;
    this.state = "fulfilled";
    setTimeout(() => {
      this.callbacks.forEach((handle) => {
        if (typeof handle[0] === "function") {
          handle[0].call(undefined, result);
        }
      });
    }, 0);
  }
  reject(reason) {
    if (this.state === "rejected") return;
    this.state = "rejected";
    setTimeout(() => {
      this.callbacks.forEach((handle) => {
        if (typeof handle[1] === "function") {
          handle[1].call(undefined, reason);
        }
      });
    }, 0);
  }
  constructor(fn) {
    if (typeof fn !== "function") {
      throw new Error("我只接收一个函数");
    }
    fn(this.resolve.bind(this), this.reject.bind(this));
  }
  then(success?, fail?) {
    const handle = [];
    if (typeof success === "function") {
      handle[0] = success;
    }
    if (typeof fail === "function") {
      handle[1] = fail;
    }
    this.callbacks.push(handle);
  }
}
export default promise2;
