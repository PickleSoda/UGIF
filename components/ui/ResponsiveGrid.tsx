import React, { useEffect, useRef } from 'react';
// Assuming you have imagesloaded library installed
import imagesLoaded from 'imagesloaded';

const ResponsiveGrid: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const gridRef = useRef<HTMLDivElement>(null);

  const resizeGridItem = (item: HTMLElement) => {
    const grid = gridRef.current;
    if (!grid) return;

    const rowHeight = parseInt(
      window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'),
    );
    const rowGap = parseInt(
      window.getComputedStyle(grid).getPropertyValue('grid-row-gap'),
    );
    const rowSpan = Math.ceil(
      (item.querySelector('.content')!.getBoundingClientRect().height +
        rowGap) /
        (rowHeight + rowGap),
    );
    item.style.gridRowEnd = `span ${rowSpan}`;
  };

  const resizeAllGridItems = () => {
    const allItems = gridRef.current?.getElementsByClassName('item');
    if (!allItems) return;

    for (let x = 0; x < allItems.length; x++) {
      resizeGridItem(allItems[x] as HTMLElement);
    }
  };

  const resizeInstance = (instance: any) => {
    const item = instance.elements[0] as HTMLElement;
    resizeGridItem(item);
  };

  useEffect(() => {
    resizeAllGridItems();
    window.addEventListener('resize', resizeAllGridItems);

    const allItems = gridRef.current?.getElementsByClassName('item');
    if (allItems) {
      for (let x = 0; x < allItems.length; x++) {
        imagesLoaded(allItems[x], resizeInstance);
      }
    }

    return () => {
      window.removeEventListener('resize', resizeAllGridItems);
    };
  }, [children]);

  return (
    <div className="grid" ref={gridRef}>
      {React.Children.map(children, child => (
        <div className="item">
          <div className="content">{child}</div>
        </div>
      ))}
    </div>
  );
};

export default ResponsiveGrid;
