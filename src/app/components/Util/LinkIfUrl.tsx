import React from 'react';
import { Typography } from 'antd';

import { stringIsURL } from '@/utils/strings';

// Renders text as link if the text provided is a valid url.
const LinkIfUrl = ({ text }: { text: string }) => {
  if (stringIsURL(text)) {
    return (
      <Typography.Link href={text} target="_blank">
        {text}
      </Typography.Link>
    );
  }
  return <>{text}</>;
};

export default LinkIfUrl;
