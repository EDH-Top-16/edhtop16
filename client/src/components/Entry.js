import { Link } from "react-router-dom";

import { colorImages, moxIcon } from "../images/index";

export default function Entry({
  enableLink,
  slug,
  rank,
  name,
  mox,
  metadata,
  colors,
  tournament,
}) {
  return (
    <tr className="text-text text-lg">
      {rank ? <td>{rank}</td> : <></>}

      {name ? (
        <td>
          {enableLink ? (
            <Link to={`/commander/${slug}`}>
              <span className="underline" href="">
                {name}
              </span>
            </Link>
          ) : (
            <span className="flex">
              {name}
              {mox && mox !== "" ? (
                <a href={mox}>
                  <img className="ml-2 w-6" src={moxIcon} alt="mox" />
                </a>
              ) : (
                <></>
              )}
            </span>
          )}
        </td>
      ) : (
        <></>
      )}

      {metadata ? metadata.map((data) => <td>{data}</td>) : <></>}

      {colors ? (
        <td className="flex space-x-4 !m-0 align-middle [&>img]:w-6">
          {colors.split("").map((color) => (
            <img key={color} src={colorImages[color]} alt={color} />
          ))}
        </td>
      ) : (
        <></>
      )}

      {tournament ? <td>{tournament}</td> : <></>}
    </tr>
  );
}
