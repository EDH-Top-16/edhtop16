"use client";

export default function Error({
  code,
  msg,
}: {
  code: number;
  msg: string;
}): JSX.Element {
  return (
    <div>
      <h1>Error {code}</h1>
      <p>{msg}</p>
    </div>
  );
}
