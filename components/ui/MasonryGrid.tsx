import React, { useRef, useEffect } from 'react';

import { useVirtualizer } from '@tanstack/react-virtual';

import { HomeItem } from '../../mock';

import { IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/react';

import { motion } from 'framer-motion';

import GifCard from './Cards/GifCard';

function MasonryGrid({ rows, fetchMore, hasNextPage, cols = 1, ImageClick }: { rows: HomeItem[], fetchMore: (callback?: () => void) => void, hasNextPage: boolean, cols?: number, ImageClick: (id: string) => void }) {
  const parentRef = React.useRef<HTMLDivElement>(null);
  const width = useRef(window.innerWidth);
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current || null,
    estimateSize: i => width.current / (rows[i].ratio * cols),
    overscan: 5,
    lanes: cols,
  });
  const isLoadingRef = useRef(false);
  const virtualItems = rowVirtualizer.getVirtualItems();

  useEffect(() => {
    const [lastItem] = [...virtualItems].reverse();
    if (!lastItem) {
      return;
    }

    if (
      lastItem.index >= rows.length - 1 &&
      hasNextPage &&
      !isLoadingRef.current
    ) {
      console.log('fetching more', isLoadingRef.current, hasNextPage, rows.length, lastItem.index);
      isLoadingRef.current = true;
      fetchMore(() => (isLoadingRef.current = false));
    }
  }, [
    hasNextPage,
    rows.length,
    virtualItems,
    fetchMore,
    rowVirtualizer
  ]);
  return (
    <>
      <div
        ref={parentRef}
        className="List"
        style={{
          height: `90vh`,
          width: `100%`,
          overflow: 'auto',
        }}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map(virtualRow => {
            const isLoaderRow = virtualRow.index > rows.length - 2
            return isLoaderRow ?
              <IonInfiniteScroll
                key={virtualRow.index}
                onIonInfinite={ev => {
                  console.log('yoi', ev);
                }}
              >
                <IonInfiniteScrollContent
                  loadingText="Please wait..."
                  loadingSpinner="bubbles"
                ></IonInfiniteScrollContent>
              </IonInfiniteScroll>
              :

              <div
                key={virtualRow.index}
                className="rounded-lg p-2"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: `${virtualRow.lane * 50}%`,
                  width: `${100 / cols}%`,
                  height: `${rows[virtualRow.index]}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}

                onClick={() => ImageClick(rows[virtualRow.index].id)}
              >
                <GifCard src={rows[virtualRow.index].src} />
              </div>
          })}

        </div>
      </div>
    </>
  );
}

export default MasonryGrid;
