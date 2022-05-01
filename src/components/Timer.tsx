import React from "react";
import { useState } from "react";
import { TimePicker, Button, Progress } from "antd";
import moment from "moment";
import style from "./Timer.module.css";

export default function Timer() {
  //设置的目标计时时间
  const [value, setValue] = useState<moment.Moment | null>(null);
  const [leftValue, setLeftValue] = useState("");
  const [percent, setPercent] = useState(0);
  let startTime: Date,
    frame: number = 0;

  function onChange(time: null | moment.Moment): void {
    setValue(time);
    if (time) {
      setLeftValue(format(time)); //mm
    }
  }

  function countTime(): void {
    let havePassTime: number = new Date().getTime() - startTime.getTime(); //已经经过的时间 毫秒

    //将倒计时赋值到div中
    let targetValue: number = momentObjToMilSecond(value);
    let newLeftVal: number = targetValue - havePassTime;

    setLeftValue(format(newLeftVal)); //更新剩下的时间
    setPercent(calPercent(havePassTime, targetValue));

    if (newLeftVal > 0) {
      frame = window.requestAnimationFrame(countTime);
    } else {
      window.cancelAnimationFrame(frame);
    }
  }

  function start(): void {
    if (value) {
      startTime = new Date();
      frame = window.requestAnimationFrame(countTime);
    } else {
      alert("请设置目标时间");
    }
  }

  function end() {
    //!取消不了，不知道为什么
    window.cancelAnimationFrame(frame);
  }

  return (
    <div className={style.outer}>
      <div className={style.header}>
        <span>请设置目标时间</span>
        &nbsp;&nbsp;&nbsp;
        <TimePicker value={value} onChange={onChange} />
      </div>
      <div>
        <Progress
          type="circle"
          percent={percent}
          format={(percent) => leftValue || "00:00:00"}
        />
        &nbsp;&nbsp;&nbsp;
        <Button type="primary" onClick={start}>
          开始
        </Button>
        &nbsp;&nbsp;&nbsp;
        <Button type="primary" danger onClick={end}>
          取消
        </Button>
      </div>
    </div>
  );
}

export function momentObjToMilSecond(time: moment.Moment | null): number {
  const h = moment(time).get("hour");
  const m = moment(time).get("minute");
  const s = moment(time).get("second");
  return ((h * 60 + m) * 60 + s) * 1000;
}

export function format(time: number | moment.Moment): string {
  if (typeof time === "number") {
    let temp = moment.duration(time);
    const h = temp.hours();
    const m = temp.minutes();
    const s = temp.seconds();
    return moment().set({ hour: h, minute: m, second: s }).format("HH:mm:ss");
  } else {
    return moment(time).format("HH:mm:ss");
  }
}

export function calPercent(havePassTime: number, targetValue: number): number {
  const percent = Math.floor(
    ((targetValue - havePassTime) / targetValue) * 100
  );
  return percent;
}
