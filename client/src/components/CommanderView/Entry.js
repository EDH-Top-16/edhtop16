import { validColors, colorImages } from "../../images/index";

export default function Entry({ rank, name, metadata, colors }) {
  return (
    <tr className="text-text text-lg">
      <td>{rank}</td>
      <td>
        <a className="underline" href="">
          {name}
        </a>
      </td>
      <td>
        {metadata.map((data) => (
          <p>{data}</p>
        ))}
      </td>
      <td className="flex space-x-4 !m-0 align-middle [&>img]:w-6">
        {colors.split("").map((color) => (
          <img key={color} src={colorImages[color]} alt={color} />
        ))}
      </td>
    </tr>
  );
}
