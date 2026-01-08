import {LoadingIcon} from './fallback';
import {Button} from './ui/button';

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
    <Button
      variant="outline"
      className="mx-auto flex justify-center self-center"
      onClick={() => {
        loadNext(48);
      }}
    >
      Load More
    </Button>
  ) : null;
}
