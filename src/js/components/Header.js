// Header.js
import React from "react";
import { connect } from "react-redux";

import { client, portalUrl } from "../constants"
import { PageHeader, Button } from 'antd';

class Header extends React.Component {

    componentDidMount() {
        document.title = "Bento-Public : " + client;
    }

    buttonHandler(url) {
        window.open(url, "_blank")
    }
    render() {
        const { portalUrl } = this.props;
        return (
            <div className="site-page-header-ghost-wrapper">
                <PageHeader
                    ghost={false}
                    title="Bento-Public"
                    subTitle={client}
                    extra={[
                        <Button onClick={() => this.buttonHandler(portalUrl)}>Portal</Button>
                    ]} />
            </div>
        );
	}
}

const mapDispatchToProps = {}

const mapStateToProps = state => ({
    portalUrl: state.config.portalUrl
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);