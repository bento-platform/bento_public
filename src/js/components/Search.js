// Dashboard.js
import React from 'react';
import { connect } from 'react-redux';
import { Button, Container } from 'react-bootstrap';
import { Row, Col } from 'react-bootstrap';
import SearchResults from './SearchResults';

// do not remove, needed even though not referenced here
import QueryParameter from './Search/QueryParameter';

// import {
//     makeGetConfigRequest,
//     makeGetOverviewRequest,
//     makeGetQueryableFieldsRequest,
//     makeGetKatsuPublic,
// } from "../action";

class Search extends React.Component {
  constructor(props) {
    super(props);
  }

  queryKatsuPublic() {
    // fetch data from server
    this.props.makeGetKatsuPublic();
  }

  render() {
    const { queryResponseData, isFetchingData, queryParameterStack } =
      this.props;
  }
}

const mapDispatchToProps = {
  makeGetConfigRequest,
  makeGetQueryableFieldsRequest,
  makeGetOverviewRequest,
  makeGetKatsuPublic,
};

const mapStateToProps = (state) => ({
  queryResponseData: state.queryResponseData,
  isFetchingData: state.isFetchingData,
  queryParameterStack: state.queryParameterStack,
});

export default connect(mapStateToProps, mapDispatchToProps)(Search);
