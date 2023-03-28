import React from "react";
import { Card, Statistic, Icon } from "antd";
import { TeamOutlined } from '@ant-design/icons';


// TODO: change results icon according to which entity requested 

const BeaconQueryResults = ({countResponse}) => {

    const resultsStyle = {
        height: "300px"
    };

    const Title = () => {
      return <h3>Count</h3>
    }

    return (
    <div style={resultsStyle}>                      
      <Card style={{ borderRadius: '10px' }}>
        <Statistic
          title={<Title />}
          value={countResponse}
        //   valueStyle={{ color: '#1890ff' }}
          prefix={<TeamOutlined />}
        />
      </Card>
    </div>
    );
};

export default BeaconQueryResults;

