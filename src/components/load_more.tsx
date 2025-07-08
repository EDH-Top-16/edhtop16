import {LoadingIcon} from './fallback';

export function LoadMoreButton({
  hasNext,
  isLoadingNext,
  loadNext,
}: {
  hasNext: boolean;
  isLoadingNext: boolean;
  loadNext: (size: number) => void;
}) {
  return isLoadingNext ? (
    <LoadingIcon padding={false} className="self-center" />
  ) : hasNext ? (
    <button
      className="font-title mx-auto flex cursor-pointer justify-center self-center rounded-md bg-[#312d5a] px-4 py-2 text-sm text-white shadow-md inset-shadow-xs"
      onClick={() => {
        loadNext(48);
      }}
    >
      Load More
    </button>
  ) : null;
}
