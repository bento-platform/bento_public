import { Drawer, type DrawerProps } from 'antd';

export const GenericDrawer = (props: DrawerProps) => {
  return (
    <Drawer placement="left" mask={true} getContainer="#content-layout" {...props}>
      {props.children}
    </Drawer>
  );
};
