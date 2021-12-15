// Books.js
import React from "react";
import { connect } from "react-redux";
import { appendData, makeGetRequest } from "./action";

class Dashboard extends React.Component {
  componentDidMount() {
	// TODO: move to 'environnent variables'
  	let client = 'iCHANGE';
  	let phenopackets = [];

	// initial data
  	phenopackets.push({
  		id: 0,
  		sampleId: 'HG0100',
  		age: 65
  	});

  	phenopackets.push({
		id: 1,
		sampleId: 'HG0101',
		age: 40
	});

  	this.props.appendData({
  		client: client,
  		phenopackets: [...this.props.phenopackets, ...phenopackets]
  	});

	// fetch data from server
	this.props.makeGetRequest("http://localhost:8090/data");

  }

  render() {
  	const { client, phenopackets } = this.props;

    let phenopacketsList = phenopackets.length > 0
    	&& phenopackets.map((item, i) => {
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
	client: state.client,
	phenopackets: state.phenopackets
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);