import React, { Component, } from 'react';
import { Bar, Line } from 'react-chartjs-2';

import {
  Button,
  ButtonDropdown,
  ButtonGroup,
  Card,
  CardBody,
  Col,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Row,
} from 'reactstrap';


class Dashboard extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
		<div className="animated fadeIn">
			<Row>
						<Col xs="12" sm="6" lg="3">
						<Card className="text-white bg-info">
							<CardBody className="pb-0">
								<div className="text-value">12345</div>
								<div><i className="fa fa-user"></i> Active Users</div>
							</CardBody>
						</Card>
						<br/>
					</Col>
					<Col xs="12" sm="6" lg="3">
						<Card className="text-white bg-info">
							<CardBody className="pb-0">
								<div className="text-value">12345</div>
								<div><i className="fa fa-microchip"></i> Registered Device</div>
							</CardBody>
						</Card>
						<br/>
					</Col>
					<Col xs="12" sm="6" lg="3">
						<Card className="text-white bg-info">
							<CardBody className="pb-0">
								<div className="text-value">12345</div>
								<div><i className="fa fa-check-circle"></i> Online Device</div>
							</CardBody>
						</Card>
						<br/>
					</Col>
					<Col xs="12" sm="6" lg="3">
						<Card className="text-white bg-info">
							<CardBody className="pb-0">
								<div className="text-value">12345</div>
								<div><i className="fa fa-exclamation-circle"></i> Offline Device</div>
							</CardBody>
						</Card>
						<br/>
					</Col>
			</Row>
		</div>
    );
  }

}

export default Dashboard;
