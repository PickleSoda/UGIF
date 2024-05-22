import React, { useEffect, useRef, useCallback } from 'react';

interface GridItemProps {
  ratio: number; // Width/Height ratio
  children: React.ReactNode;
}

const ResponsiveGrid: React.FC<{
  children: React.ReactElement<GridItemProps>[];
}> = ({ children }) => {
  const gridRef = useRef<HTMLDivElement>(null);

  const resizeGridItem = useCallback((item: HTMLElement, ratio: number) => {
    const grid = gridRef.current;
    if (!grid) return;

    const rowHeight = parseInt(
      window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'),
    );
    const rowGap = parseInt(
      window.getComputedStyle(grid).getPropertyValue('grid-row-gap'),
    );
    const itemWidth = item.getBoundingClientRect().width;
    const rowSpan = Math.ceil(
      (itemWidth / ratio + rowGap) / (rowHeight + rowGap),
    );

    item.style.gridRowEnd = `span ${rowSpan}`;
  }, []);

  const resizeAllGridItems = useCallback(() => {
    const allItems = gridRef.current?.getElementsByClassName('item');
    if (!allItems) return;

    for (let x = 0; x < allItems.length; x++) {
      const item = allItems[x] as HTMLElement;
      const ratio = parseFloat(item.getAttribute('data-ratio')!);
      resizeGridItem(item, ratio);
    }
  }, [resizeGridItem]);

  useEffect(() => {
    resizeAllGridItems();
    window.addEventListener('resize', resizeAllGridItems);

    return () => {
      window.removeEventListener('resize', resizeAllGridItems);
    };
  }, [children, resizeAllGridItems]);

  return (
    <div className="grid" ref={gridRef}>
      {React.Children.map(children, child => (
        <div
          className="item rounded-lg overflow-hidden px-0.5"
          data-ratio={child.props.ratio.toString() || 1}
        >
          <div className="content">{child}</div>
        </div>
      ))}
    </div>
  );
};

export default ResponsiveGrid;
