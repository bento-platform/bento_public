// Header.js
import React from "react";
import { connect } from "react-redux";

import { client } from "../constants"

class Header extends React.Component {

    componentDidMount() {}

    render() {
        return (
            <div>
                <h1>Hello {client}!</h1>
            </div>
        );
	}
}

const mapDispatchToProps = {}

const mapStateToProps = state => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Header);