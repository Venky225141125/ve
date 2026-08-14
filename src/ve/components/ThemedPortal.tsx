import React, { useLayoutEffect, useRef, useState, type CSSProperties, type HTMLAttributes } from 'react';
import { createPortal } from 'react-dom';
import { readEditorTheme } from '../utils/theme';

export interface ThemedPortalProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean;
}

export const ThemedPortal: React.FC<ThemedPortalProps> = ({
  open,
  className = '',
  style,
  children,
  ...rest
}) => {
  const hostRef = useRef<HTMLSpanElement>(null);
  const [isDark, setIsDark] = useState(false);
  const [themeStyle, setThemeStyle] = useState<CSSProperties>({});

  useLayoutEffect(() => {
    if (!open) return;
    const theme = readEditorTheme(hostRef.current);
    setIsDark(theme.isDark);
    setThemeStyle(theme.style);
  }, [open]);

  return (
    <>
      <span ref={hostRef} hidden />
      {open &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className={`${className}${isDark ? ' dark' : ''}`.trim()}
            style={{ ...themeStyle, ...style }}
            {...rest}
          >
            {children}
          </div>,
          document.body
        )}
    </>
  );
};
