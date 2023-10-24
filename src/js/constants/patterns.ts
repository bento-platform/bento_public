export const DOI_PATTERN = /^10.\d{4,9}\/[-._;()/:A-Z0-9]+$/i;

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
export const URL_PATTERN = /^(http|https):\/\/[^ "]+$/;
