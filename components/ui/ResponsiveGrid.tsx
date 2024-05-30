import React, { useEffect, useRef, useCallback } from 'react';

interface GridItemProps {
  ratio: number; // Width/Height ratio
  children: React.ReactNode;
}

interface ResponsiveGridProps {
  children: React.ReactElement<GridItemProps>[];
  cols: number; // Number of columns
}

const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({ children, cols }) => {
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
      let ratio = parseFloat(item.getAttribute('data-ratio')!);
      resizeGridItem(item, ratio);
    }
  }, [resizeGridItem]);

  useEffect(() => {
    resizeAllGridItems();
    const resizeObserver = new ResizeObserver(resizeAllGridItems);
    const grid = gridRef.current;
    if (grid) {
      window.addEventListener('resize', resizeAllGridItems);
      resizeObserver.observe(grid);
    }

    return () => {
      window.removeEventListener('resize', resizeAllGridItems);
      resizeObserver.disconnect();
    };
  }, [resizeAllGridItems]);

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    gridAutoRows: '5px', // Adjust as needed
    gridRowGap: '5px', // Adjust as needed
    gridAutoColumns: '1fr',
    gridColumnGap: '5px',
  };

  return (
    <div style={gridStyle} ref={gridRef}>
      {React.Children.map(children, child => (
        <div
          className="item"
          data-ratio={child.props.ratio.toString() || '1'}
          style={{
            borderRadius: '8px',
            overflow: 'hidden',
            paddingTop: '0.5rem',

          }}
        >
          <div className="content">{child}</div>
        </div>
      ))}
    </div>
  );
};

export default ResponsiveGrid;

export const GridItem: React.FC<{
  ratio: number;
  children: React.ReactElement<any>;
}> = ({ ratio, children }) => <div data-ratio={ratio}>{children}</div>;
