import React, { Component, } from 'react';
import { Redirect } from 'react-router-dom';
import { Button, Card, CardBody, CardHeader, Col, Row, Table, DropdownItem, UncontrolledDropdown, DropdownToggle, DropdownMenu } from 'reactstrap';

var oThis = null;
var pageMode = 0;

class Project extends Component {

    constructor(props) {
        super(props);
        oThis = this;
    }

    handleCreateNew = () => {
      pageMode = 1;
      oThis.forceUpdate();
    }

    handleCancel = () => {
      pageMode = 0;
      oThis.forceUpdate();
    }

    render() {
        if ( localStorage.getItem('isLogin') !== 'true' ){
            return ( <Redirect to='/login' /> );
        }

        // Default View
        if ( pageMode === 0 ){
          return(
              <div>
              <Row>
                <Col>
                  <Card>
                    <CardHeader>
                      <i className="fa fa-align-justify"></i>Project Manager
                      <Button className="btn btn-ghost-info pull-right active" onClick={event=>oThis.handleCreateNew()}>
                        <div className="card-header-action">
                          <small className="text-white">Add New</small>
                        </div>
                      </Button>
                    </CardHeader>
                    <CardBody>
                      <div className="col-md-4 pull-left">
                        <div className="input-group">
                          <input id="search-box" name="search-box" placeholder="Search Project by Name or ID" type="text" className="form-control"/>
                        </div>
                      </div>
                      <br/><br/>
                      <Table responsive hover>
                        <thead>
                          <tr>
                              <th scope="col" className="text-center">No</th>
                              <th scope="col" className="text-center">Name</th>
                              <th scope="col" className="text-center">Owner</th>
                              <th scope="col" className="text-center">Date Created</th>
                              <th scope="col" className="text-center">Location</th>
                              <th scope="col" className="text-center">Sensor Count</th>
                              <th scope="col" className="text-center">Status</th>
                              <th scope="col" className="text-center">Active Sensor</th>
                              <th scope="col" className="text-center">Inactive Sensor</th>
                              <th scope="col" className="text-center">Action</th>
                          </tr>
                        </thead>

                      </Table>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </div>            
          );
        }


        // Create New Form
        if ( pageMode == 1 ){
          return(
            <div>
              <Row>
                <Col>
                  <Card>
                      <CardHeader>
                        <i className="fa fa-align-justify"></i> Create New IoT Project
                      </CardHeader>
                      <CardBody>

                      </CardBody>
                      <div className="card-footer">
                          <Button onClick={event=>this.handleCancel()} type="reset" className="btn btn-secondary" >
                              <i className="fa fa-ban"></i> Cancel
                          </Button>
                      </div>
                  </Card>
                </Col>
              </Row>
            </div>
          );
      }

      // Edit Form
      if ( pageMode == 2 ){
        return(
          <div>
            <Row>
              <Col>
                <Card>
                    <CardHeader>
                      <i className="fa fa-align-justify"></i> Edit IoT Project
                    </CardHeader>
                    <CardBody>

                    </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        );
      }

      // Delete
      if ( pageMode == 3 ){
      }

      // Update
      if ( pageMode == 4 ){
      }

      // Search
      if ( pageMode == 5 ){
      }

      // End Of Block

    }
}

export default Project;