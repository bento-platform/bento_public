import React from 'react';
import ReactDOM from 'react-dom'; 
import "core-js"; 
 
const App = (props) => {
    return ( 
    <div>
        <h2>{props.text}</h2>
    </div> 
    );
};

   

ReactDOM.render(
    <div>
        <App text="Webpack React and Golang" /> 
    </div>
    ,
    document.getElementById("app")
);