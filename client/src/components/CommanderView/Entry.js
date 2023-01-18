import { W, U, B, R, G, C } from "../../images/index";

export default function Entry({ rank, name, metadata, colors }) {
  return (
    <div className="flex">
      <p>{rank}</p>
      <a>{name}</a>
      <p>{metadata}</p>
      <div>
        {colors.map((color) => (
          <a>{color}</a>
        ))}
      </div>
    </div>
  );
}
