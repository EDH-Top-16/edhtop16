import { Link } from "react-router-dom";

import { colorImages } from "../images/index";

export default function Entry({
  enableLink,
  slug,
  rank,
  name,
  metadata,
  colors,
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
            <span className="" href="">
              {name}
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
    </tr>
  );
}
