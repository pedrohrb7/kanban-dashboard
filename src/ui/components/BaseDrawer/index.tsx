import { Drawer } from 'antd';
import { type PropsWithChildren } from 'react';

interface IBaseDrawer {
  title: string;
  isOpen: boolean;
  size?: number;
  position?: 'left' | 'right' | 'top' | 'bottom';

  onClose: () => void;
}

export const BaseDrawer = (props: PropsWithChildren<IBaseDrawer>) => {
  return (
    <Drawer size={props.size || 320} open={props.isOpen} {...props}>
      {props.children}
    </Drawer>
  );
};
