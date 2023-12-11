import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { usePopover } from '../popovers/usePopover';
import { Menu, MenuProps } from './menus';

export const ContextMenuLayer = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState({ isOpen: false, x: 0, y: 0, menu: <Menu>{[]}</Menu> });
  const { show, hide } = useRef({
    show: (x: number, y: number, menu: React.ReactElement<MenuProps>) => {
      setState({ isOpen: true, x, y, menu });
    },
    hide: () => {
      setState({ isOpen: false, x: 0, y: 0, menu: <Menu>{[]}</Menu> });
    },
  }).current;

  return (
    <ContextMenuProvider value={show}>
      {children}
      <ContextMenu isOpen={state.isOpen} x={state.x} y={state.y} close={hide}>
        {state.menu}
      </ContextMenu>
    </ContextMenuProvider>
  );
};

export const useContextMenu = () => {
  return useContext(ContextMenuContext);
};

type ContextMenuActions = (x: number, y: number, menu: React.ReactElement<MenuProps>) => void;

const ContextMenuContext = React.createContext<ContextMenuActions>(() => {});

const ContextMenuProvider = ContextMenuContext.Provider;

interface ContextMenuProps {
  isOpen: boolean;
  x: number;
  y: number;
  children: React.ReactElement<MenuProps>;
  close: () => void;
}

/**
 * The classic desktop context menu
 */
const ContextMenu = ({ isOpen, x, y, children, close }: ContextMenuProps) => {
  const container = useRef<HTMLDivElement>(null);
  const boundingRect = useRef(new DOMRect());
  const { style, reference, floating, update } = usePopover('right-start');

  useEffect(() => {
    floating(container.current);
    // Capture only the DOMRect and not the React MutableRefObject
    const boundingRectRef = boundingRect.current;
    reference({ getBoundingClientRect: () => boundingRectRef });
  }, [floating, reference]);

  useLayoutEffect(() => {
    if (container.current && isOpen) {
      // Focus container so the keydown event can be handled even without a mouse.
      container.current.focus();

      // Update bounding rect
      // Do not replace the DOMRect object reference!
      boundingRect.current.x = x;
      boundingRect.current.y = y;
      update();
    }
  }, [isOpen, update, x, y]);

  // Close upon executing a command from a menu item
  const handleClick = (e: React.MouseEvent) => {
    const target = (e.target as HTMLElement).closest('li[role^="menuitem"]') as HTMLElement | null;
    if (target !== null) {
      close();
    }
  };

  // Clicking or tabbing outside will close the context menu by default
  const handleBlur = (e: React.FocusEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      close();
    }
  };

  // Handles keyboard navigation if no menu item has been focused yet
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      close();
    } else if (e.key === 'ArrowDown') {
      const first: HTMLElement | null = e.currentTarget.querySelector('[role^="menuitem"]');
      if (first !== null) {
        e.stopPropagation();
        first.focus();
      }
    } else if (e.key === 'ArrowUp') {
      // FIXME: It's not performant but a context menu is usually shorter than a `Tree`.
      const last: NodeListOf<HTMLElement> = e.currentTarget.querySelectorAll('[role^="menuitem"]');
      if (last.length > 0) {
        e.stopPropagation();
        last[last.length - 1].focus();
      }
    }
  };

  return (
    <div
      ref={container}
      style={style}
      data-popover
      data-open={isOpen}
      data-contextmenu
      tabIndex={-1}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onClick={handleClick}
      onMouseOver={handleMouseOver}
    >
      {children}
    </div>
  );
};

// Applies focus to the menu item which allows to use keyboard navigation immediately
function handleMouseOver(event: React.MouseEvent) {
  const target = (event.target as Element).closest('[role^="menuitem"]') as HTMLElement | null;
  if (target !== null) {
    target.focus();
  }
}
