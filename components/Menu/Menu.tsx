import { MenuProps } from '@typings/db';
import React, { useCallback } from 'react';
import { CreateMenu } from './style';

function Menu({ children, style, show }: MenuProps) {
  const removeBubbling = useCallback((e) => {
    e.stopPropagation();
  }, []);

  if (!show) return null;

  return (
    <CreateMenu data-testid="menu" style={style} onClick={removeBubbling}>
      {children}
    </CreateMenu>
  );
}

Menu.defaultProps = {
  closeButton: true,
};

export default React.memo(Menu);
