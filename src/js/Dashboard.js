// Books.js
import React from "react";
import { connect } from "react-redux";
import { appendData, makeGetRequest } from "./action";

import { client, dataUrl } from "./constants"

class Dashboard extends React.Component {

	dataPath = "data";

    componentDidMount() {
        // fetch data from server
        this.props.makeGetRequest(dataUrl);
    }

    render() {
        const { phenopackets } = this.props;

        let phenopacketsList = phenopackets.length > 0 && phenopackets.map((item, i) => {
            return (
                <li key={i} value={item.id}>
                    Id: {item.id} - Sample: {item.sampleId} - Age: ({item.age})
                </li>
            )
        }, this);

        return (
            <div>
                <h1>Hello {client}!</h1>
                <ol>
                    { phenopacketsList }
                </ol>
            </div>
        );
	}
}

const mapDispatchToProps = {
	appendData,
	makeGetRequest
}

const mapStateToProps = state => ({
	phenopackets: state.phenopackets
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);