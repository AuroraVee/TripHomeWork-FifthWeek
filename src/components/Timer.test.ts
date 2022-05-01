import { momentObjToMilSecond, format, calPercent } from "./Timer";
import moment from "moment";

describe(momentObjToMilSecond.name, () => {
  test("将moment对象转成毫秒", function () {
    const res = momentObjToMilSecond(
      moment().set({ minutes: 3, hours: 0, seconds: 0 })
    );
    expect(res).toEqual(3 * 60 * 1000);
  });
});

describe(format.name, () => {
  test("将毫秒数字格式化为hh:mm:ss", () => {
    const val = format(1000);
    expect(val).toEqual("00:00:01");
  });
});

describe(calPercent.name, () => {
  test("计算剩下的时间百分比", () => {
    const val = calPercent(2000, 10000);
    expect(val).toEqual(80);
  });
});
