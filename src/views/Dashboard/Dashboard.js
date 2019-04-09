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
								<div>Active Users</div>
							</CardBody>
							<div className="chart-wrapper mx-3" style={{ height: '70px' }}>
							</div>
						</Card>
					</Col>
					<Col xs="12" sm="6" lg="3">
						<Card className="text-white bg-info">
							<CardBody className="pb-0">
								<div className="text-value">12345</div>
								<div>Registered Device</div>
							</CardBody>
							<div className="chart-wrapper mx-3" style={{ height: '70px' }}>
							</div>
						</Card>
					</Col>
					<Col xs="12" sm="6" lg="3">
						<Card className="text-white bg-info">
							<CardBody className="pb-0">
								<div className="text-value">12345</div>
								<div>Online Device</div>
							</CardBody>
							<div className="chart-wrapper mx-3" style={{ height: '70px' }}>
							</div>
						</Card>
					</Col>
					<Col xs="12" sm="6" lg="3">
						<Card className="text-white bg-info">
							<CardBody className="pb-0">
								<div className="text-value">12345</div>
								<div>Offline Device</div>
							</CardBody>
							<div className="chart-wrapper mx-3" style={{ height: '70px' }}>
							</div>
						</Card>
					</Col>
			</Row>
		</div>
    );
  }

}

export default Dashboard;
