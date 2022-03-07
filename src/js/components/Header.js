// Header.js
import React from "react";
import { connect } from "react-redux";

import { client, portalUrl } from "../constants"
import { PageHeader, Button } from 'antd';

class Header extends React.Component {

    componentDidMount() {
        document.title = "Bento-Public : " + client;
    }

    render() {
        return (
            <div className="site-page-header-ghost-wrapper">
                <PageHeader
                    ghost={false}
                    title="Bento-Public"
                    subTitle={client}
                    extra={[
                        <Button href={portalUrl}target="_blank" >Portal</Button>
                    ]} />
            </div>
        );
	}
}

const mapDispatchToProps = {}

const mapStateToProps = state => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Header);