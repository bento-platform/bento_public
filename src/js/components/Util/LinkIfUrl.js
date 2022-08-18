import React from 'react';
import { Typography } from 'antd';

// Renders text as link if the text provided is a valid url.
const LinkIfUrl = ({ text }) => {
  if (text.match(/^(http|https):\/\/[^ "]+$/)) {
    return (
      <Typography.Link href={text} target="_blank">
        {text}
      </Typography.Link>
    );
  }
  return text;
};

export default LinkIfUrl;
