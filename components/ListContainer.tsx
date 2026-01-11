'use client';

import {ReactNode, use, useState} from 'react';
import {LoadMoreButton} from './load_more';

export type ListContainerState = {
  items: ReactNode;
  hasNextPage: boolean;
  endCursor: string | null;
};

export function ListContainer({
  initialState: initialStatePromise,
  loadMoreAction,
  header,
  gridClassName,
}: {
  initialState: Promise<ListContainerState>;
  loadMoreAction: (cursor: string) => Promise<ListContainerState>;
  header?: ReactNode;
  gridClassName: string;
}) {
  const initialState = use(initialStatePromise);

  const [additionalPages, setAdditionalPages] = useState<ReactNode[]>([]);
  const [pageInfo, setPageInfo] = useState({
    isLoadingNext: false,
    hasNextPage: initialState.hasNextPage,
    endCursor: initialState.endCursor,
  });

  function loadMore() {
    if (!pageInfo.endCursor) return;

    setPageInfo((prev) => ({...prev, isLoadingNext: true}));
    loadMoreAction(pageInfo.endCursor!).then((nextState) => {
      setAdditionalPages((prev) => [...prev, nextState.items]);
      setPageInfo({
        isLoadingNext: false,
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
          isLoadingNext={pageInfo.isLoadingNext}
          loadNext={loadMore}
        />
      </div>
    </>
  );
}
