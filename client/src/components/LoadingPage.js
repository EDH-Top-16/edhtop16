import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function LoadingPage({ setCommander, commanderExist }) {
  let params = useParams();
  const commander = params["*"].replaceAll("+", "/");
  console.log(commander, commanderExist);

  useEffect(() => {
    setCommander(commander);
  }, [commander]);

  return (
    <div className="w-11/12 ml-auto mr-0 h-screen flex flex-col justify-center items-center text-text">
      <h1 className="text-4xl font-bold text-center">Loading...</h1>
    </div>
  );
}
