class promise {
  status = "pending";
  callbacks = [];
  private resolve = (result) => {
    if (this.status === "pending") {
      this.status = "fulfilled";
      setTimeout(() => {
        this.callbacks.forEach((handle) => {
          if (typeof handle[0] === "function") {
            handle[0].call(undefined, result);
          }
        });
      }, 0);
    }
  };
  private reject = (reason) => {
    if (this.status === "pending") {
      this.status = "rejected";
      setTimeout(() => {
        this.callbacks.forEach((handle) => {
          if (typeof handle[1] === "function") {
            handle[1].call(undefined, reason);
          }
        });
      }, 0);
    }
  };
  constructor(fn) {
    if (!new.target) {
      throw new Error("需要new调用");
    }
    if (typeof fn !== "function") {
      throw new Error("fn不是函数");
    }
    fn(this.resolve, this.reject);
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
export default promise;
