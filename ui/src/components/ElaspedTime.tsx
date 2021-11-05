import React, { FC, useLayoutEffect, useState } from "react";

export type ElapsedTimeProps = {
    startTime: Date
}

export const ElaspedTime: FC<ElapsedTimeProps> = ({
    startTime
}) => {
    const [time, setTime] = useState("");
    useLayoutEffect(() => {

        setInterval(() => {
            const endTime = new Date();

            let timeDiff = endTime.getTime() - startTime.getTime();


            timeDiff = timeDiff / 1000;

            let seconds = Math.floor(timeDiff % 60);

            let secondsAsString = seconds < 10 ? "0" + seconds : seconds + "";


            timeDiff = Math.floor(timeDiff / 60);

            let minutes = timeDiff % 60;

            let minutesAsString = minutes < 10 ? "0" + minutes : minutes + "";

            timeDiff = Math.floor(timeDiff / 60);


            let hours = timeDiff % 24;

            timeDiff = Math.floor(timeDiff / 24);

            let days = timeDiff;

            let totalHours = hours + (days * 24);
            let totalHoursAsString = totalHours < 10 ? "0" + totalHours : totalHours + "";

            if (totalHoursAsString === "00") {
                setTime(minutesAsString + ":" + secondsAsString);
            } else {
                setTime(totalHoursAsString + ":" + minutesAsString + ":" + secondsAsString);
            }
        }, 1000)
    }, [startTime])

    return (<p>
        {time} elapsed
    </p>)
}