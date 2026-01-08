'use client';

import {ReactNode, useState, useTransition} from 'react';
import {LoadMoreButton} from './load_more';

export type ListContainerState = {
  items: ReactNode;
  hasNextPage: boolean;
  endCursor: string | null;
};

export function ListContainer({
  initialState,
  loadMoreAction,
  header,
  gridClassName,
}: {
  initialState: ListContainerState;
  loadMoreAction: (cursor: string) => Promise<ListContainerState>;
  header?: ReactNode;
  gridClassName: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [additionalPages, setAdditionalPages] = useState<ReactNode[]>([]);
  const [pageInfo, setPageInfo] = useState({
    hasNextPage: initialState.hasNextPage,
    endCursor: initialState.endCursor,
  });

  async function loadMore() {
    if (!pageInfo.endCursor) return;

    startTransition(async () => {
      const nextState = await loadMoreAction(pageInfo.endCursor!);

      setAdditionalPages((prev) => [...prev, nextState.items]);
      setPageInfo({
        hasNextPage: nextState.hasNextPage,
        endCursor: nextState.endCursor,
      });
    });
  }

  return (
    <>
      <div className={gridClassName}>
        {header}
        {initialState.items}
        {additionalPages}
      </div>
      <div className="flex justify-center py-4">
        <LoadMoreButton
          hasNext={pageInfo.hasNextPage}
          isLoadingNext={isPending}
          loadNext={loadMore}
        />
      </div>
    </>
  );
}
