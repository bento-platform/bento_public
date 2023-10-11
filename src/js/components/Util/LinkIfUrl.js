import React from 'react';
import { Typography } from 'antd';

/*
^                               starts with...
    (
        http|https              "http" or "https"
    )
:                               :
\/\/                            //
    [^                          anything excluding...
         "                      space or double quote
    ]
    +                           repeated at least once
$                               until the end of the string
*/
const URL_REGEX = /^(http|https):\/\/[^ "]+$/;

// Renders text as link if the text provided is a valid url.
const LinkIfUrl = ({ text }) => {
  if (text.match(URL_REGEX)) {
    return (
      <Typography.Link href={text} target="_blank">
        {text}
      </Typography.Link>
    );
  }
  return text;
};

export default LinkIfUrl;
