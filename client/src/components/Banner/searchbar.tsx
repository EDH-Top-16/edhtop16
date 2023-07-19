type SearchbarProps = {
  placeholder: string;
};

export default function Searchbar({
  placeholder,
}: SearchbarProps): JSX.Element {
  return (
    <label>
      <input className="w-fit" type="text" placeholder={placeholder} />
    </label>
  );
}
