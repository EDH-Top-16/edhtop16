import { validColors, colorImages } from "../../images/index";

export default function Entry({ rank, name, metadata, colors }) {
  return (
    <tr className="flex space-x-24 text-white text-lg">
      <td>{rank}</td>
      <td>
        <a className="underline" href="">
          {name}
        </a>
      </td>
      <td>{metadata}</td>
      <td className="flex space-x-4 [&>img]:w-6">
        {colors.map((color) => (
          <img key={color} src={colorImages[color]} alt={color} />
        ))}
      </td>
    </tr>
  );
}
