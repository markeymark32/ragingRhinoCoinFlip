import React, { useState, useEffect } from "react";

function Histroy() {
  const [recentPlays, setRecentPlays] = useState([]);

  function timeDifference(current, previous) {
    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (!previous) return "";

    if (elapsed < msPerMinute) {
      const seconds = Math.round(elapsed / 1000);
      return `${seconds} ${seconds === 1 ? "second" : "seconds"} ago`;
    } else if (elapsed < msPerHour) {
      const minutes = Math.round(elapsed / msPerMinute);
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    } else if (elapsed < msPerDay) {
      const hours = Math.round(elapsed / msPerHour);
      return `${hours} ${hours === 1 ? "hour" : "hours "} ago`;
    } else if (elapsed < msPerMonth) {
      const days = Math.round(elapsed / msPerDay);
      return `${days} ${days === 1 ? "day" : "days"} ago`;
    } else if (elapsed < msPerYear) {
      const months = Math.round(elapsed / msPerMonth);
      return `${months} ${months === 1 ? "month" : "months"} ago`;
    } else {
      const years = Math.round(elapsed / msPerYear);
      return `${years} ${years === 1 ? "year" : "years"} ago`;
    }
  }

  useEffect(() => {
    fetch("https://indexer-dl.herokuapp.com/api/latest_transactions")
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((jsonResponse) => {
        setRecentPlays(
          jsonResponse.data.map((elm) => {
            return {
              amount: (parseFloat(elm.amount) / 1.035).toFixed(1),
              time: timeDifference(new Date(), elm.timestamp ?? null),
              accountId: elm.signer_id ?? "default.near",
              outcome: elm.outcome ? "won" : "lost"
            };
          })
        );
      });
  }, []);

  if (recentPlays.length < 1) return <></>;

  return (
    <>
      {recentPlays?.map((elm, index) => (
        <div className="overlap-group-2 border-1px-mortar">
          <img
            className="group-15"
            src="https://anima-uploads.s3.amazonaws.com/projects/625f543462fd13e687a91026/releases/625fe28395bd0d454b070c27/img/group-15@2x.svg"
            alt="coin"
          />
          <div className="wallet-9y-mp-flipped-005-and-doubled pixeloidsans-regular-normal-white-18px-2">
            <span className="pixeloidsans-regular-normal-white-18px">
              {elm.accountId} flipped {elm.amount} Ⓝ and{" "}
            </span>
            {elm.outcome === "won" && (
              <span className="pixeloidsans-regular-normal-caribbean-green-pearl-18px">
                {elm.outcome}{" "}
              </span>
            )}
            {elm.outcome === "lost" && (
              <span className="pixeloidsans-regular-normal-caribbean-red-pearl-18px">
                {elm.outcome}{" "}
              </span>
            )}
            <span className="proximanova-light-white-16px-2">{elm.time}</span>
          </div>
        </div>
      ))}
    </>
  );
}
export default Histroy;
