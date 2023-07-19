import Searchbar from "./searchbar";

type BannerProps = {
  title: string;
};

export default function Banner({ title }: BannerProps) {
  return (
    <div className="flex h-fit w-full flex-col space-y-4 bg-primary p-6">
      <h1 className="text-tertiary">{title}</h1>
      <Searchbar placeholder="Find Commander..." />
    </div>
  );
}
