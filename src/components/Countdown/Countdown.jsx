import React, { useState } from "react";
import { useEffect } from "react";

const DateTimeDisplay = ({ value, type, isDanger }) => {
  return (
    <div className={isDanger ? "countdown danger" : "countdown"}>
      <p>{value}</p>
    </div>
  );
};

const ShowCounter = ({ days, hours, minutes, seconds, dateType }) => {
  return (
      <div className="show-counter">
        <div className="countdown-link">
          <p className="start_date">{dateType === "start" && "Starts:"}</p>
          <p className="end_date"> {dateType === "end" && "Ends:"}</p>
          {days? (
            <div className="d-flex align-items-center">
              <DateTimeDisplay
                value={days}
                type={"Days"}
                isDanger={days <= 3}
              />
              d<p style={{ marginBottom: 0 }}>:</p>
            </div>
          ): null}
          {hours? (
            <div className="d-flex align-items-center">
              <DateTimeDisplay value={hours} type={"Hours"} isDanger={false} />h
              <p style={{ marginBottom: 0 }}>:</p>
            </div>
          ): null}
          {minutes? (
            <div className="d-flex align-items-center">
              <DateTimeDisplay value={minutes} type={"Mins"} isDanger={false} />
              m<p style={{ marginBottom: 0 }}>:</p>
            </div>
          ): null}
          {seconds? (
            <div className="d-flex align-items-center">
              <DateTimeDisplay
                value={seconds}
                type={"Seconds"}
                isDanger={false}
              />
              s
            </div>
          ): null}
        </div>
      </div>
  );
};

const Countdown = ({ startDate, endDate }) => {
  const [dateType, setDateType] = useState("");
  const [countdown, setCounrtDown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    secTimer();
  }, []);

  
  const secTimer = () => {
    setInterval(() => {
      let time = new Date()
      time.setHours(time.getHours() + 5);
      time.setMinutes(time.getMinutes() + 30);
      const whichDate =
        new Date().toISOString() < new Date(startDate).toISOString() ? "start" : "end";
      setDateType(whichDate);
      let dateValue = "";
      if (whichDate === "start") {
        dateValue = new Date(startDate);
      } else {
        dateValue = new Date(endDate);
      }

      const msDiff = new Date(dateValue) - new Date();
      const daysDiff = Math.floor(msDiff / (1000 * 60 * 60 * 24));
      const hrsDiff = Math.floor(
        (msDiff - daysDiff * (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const mmDiff = Math.floor(
        (msDiff -
          daysDiff * (1000 * 60 * 60 * 24) -
          hrsDiff * (1000 * 60 * 60)) /
          (1000 * 60)
      );
      const ssDiff = Math.floor(
        (msDiff -
          daysDiff * (1000 * 60 * 60 * 24) -
          hrsDiff * (1000 * 60 * 60) -
          mmDiff * (1000 * 60)) /
          1000
      );
      setCounrtDown({
        ...countdown,
        days: daysDiff,
        hours: hrsDiff,
        minutes: mmDiff,
        seconds: ssDiff,
      });
    }, 1000);
  };
  return <ShowCounter {...countdown} dateType={dateType} />;
};
export default Countdown;
