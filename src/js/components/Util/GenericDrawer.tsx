import { Drawer, type DrawerProps } from 'antd';

export const GenericDrawer = (props: DrawerProps) => {
  return (
    <Drawer placement="left" mask={{ blur: true }} {...props}>
      {props.children}
    </Drawer>
  );
};
