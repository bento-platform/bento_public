// Header.js
import React from "react";
import { connect } from "react-redux";

import { client } from "../constants"

class Header extends React.Component {

    componentDidMount() {
        document.title = "Bento-Public : " + client;
    }

    render() {
        return (
            <div>
                <h4>Bento-Public</h4>
                <h5>{client}</h5>
            </div>
        );
	}
}

const mapDispatchToProps = {}

const mapStateToProps = state => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Header);