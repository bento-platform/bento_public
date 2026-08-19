import type { ComponentProps } from 'react';
import Icon from '@ant-design/icons';
import BeaconSvg from './BeaconSvg';

type CustomIconComponentProps = ComponentProps<typeof Icon>;

const BeaconLogo = (props: Partial<CustomIconComponentProps>) => <Icon component={BeaconSvg} {...props} />;
export default BeaconLogo;
