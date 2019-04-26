import React, { Component, } from 'react';
import { Redirect } from 'react-router-dom';
import { Button, Card, CardBody, CardHeader, Col, Row, Table } from 'reactstrap';

import Swal from 'sweetalert2';
import TableView from './TableView';

var oThis = null;
var pageMode = 0;

var token = "";
var body = null;
var serverDataBody = null;
var postData = {};

class Project extends Component {

    constructor(props) {
        super(props);
        oThis = this;

        oThis.initDataPost();
    }
    
    componentDidUpdate(){        
    }

    initDataPost = () => {
      postData = {};
      postData['projectname'] = '';
      postData['projectowner'] = Number( localStorage.getItem('userid') );
      postData['ownername'] = localStorage.getItem('fullname');
      postData['projectlocation'] = '';
      postData['projectdescription'] = '';
      postData['activate'] = 0;
    }

    confirmInsert = () => {
      Swal.fire({
        title: 'Are you sure?',
        text: 'This will add new Project to your profile!',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, insert new project',
        cancelButtonText: 'No, i change my mind'
      }).then((result) => {
        if (result.value) {
          oThis.handleInsertNewProject();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire(
            'Cancelled',
            'You change your mind:)',
            'error'
          );
          this.handleCancel();
        }
      })
    }

    handleInsertNewProject = () => {
        if ( oThis.handleCheckInput !== 0 ){
            oThis.handleGetToken(function (callback) {
                oThis.handlePostInsert( function (callback) {
                    pageMode = 0;
                    oThis.initDataPost();
                    oThis.forceUpdate();
                });
            });
        }else{
            return;
        }
    }

    handleCreateNew = () => {
      pageMode = 1;
      oThis.forceUpdate();
    }

    handleCancel = () => {
      pageMode = 0;
      oThis.forceUpdate();
    }
    
    handleCheckInput = () => {
      if ( postData.projectname === null || postData.projectname === "" ){
        oThis.displayErrorNoData( 'Project Name Field is empty!' );
        return 0;
      }
      return 1;
    }

    // =============================================================================
    handleChangeProjectName = (value) => {
      postData["projectname"]=value;
    }
    
    handleChangeProjectLocation = (value) => {
      postData["projectlocation"]=value;
    }

    handleChangeProjectDescription = (value) => {
      postData["projectdescription"]=value;
    }

    handleChangeProjectActivate = (value) => {
      postData["activate"]=value;
    }
    // =============================================================================

    // =============================================================================
    initServerVars = () => {
        serverDataBody = null;
    }
    
    handleGetToken = (callback) => {
      token = "";
      oThis.initServerVars();
      var http = require("http");
      var options = {
        "method": "GET",
        "hostname": 'ingen4u.ip-dynamic.com',
        "port": 3100,
        "path": "/token"
      };
      var req =  http.request(options, function (res) {
          var chunks = [];
          res.on("data", function (chunk) {
              chunks.push(chunk);
          });
          res.on("end", function () {
              body = Buffer.concat(chunks);
              if ( body !== null || body !== '' ){
                  if ( oThis.IsJsonString( body ) === true ){
                      serverDataBody = JSON.parse( body.toString() );
                      if ( serverDataBody['status'] === 1 ){
                          token = serverDataBody['data'];
                          callback(1);
                      }else{
                          oThis.displayErrorNoData(serverDataBody['message']);
                          callback(0);
                      }
                  }else{
                      oThis.displayErrorNoData();
                      callback(0);
                  }
              }else{
                  oThis.displayErrorNoData();
                  callback(0);
              }
          });
      });
      req.write('');
      req.end();
    }

    handlePostInsert = (callback) => {
        oThis.initServerVars();
        postData["mode"] = 1;
        
        var http = require("http");
        var options = {
          "method": "POST",
          "hostname": 'ingen4u.ip-dynamic.com',
          "port": 3100,
          "path": "/project",
          "headers": {
            "Content-Type": "application/json"
          }
        };

        var jsonData = JSON.stringify(postData);
        var strRequest = "{\n\t\"token\": \"" + token + "\","+
                         "\n\t\"data\": " + jsonData + "\n}";

        var req =  http.request(options, function (res) {
            var chunks = [];
            res.on("data", function (chunk) {
                chunks.push(chunk);
            });
            res.on("end", function () {
                body = Buffer.concat(chunks);
                if ( body !== null || body !== '' ){
                    if ( oThis.IsJsonString( body ) === true ){
                        serverDataBody = JSON.parse( body.toString() );
                        if ( serverDataBody['status'] === 1 ){
                            Swal.fire(
                                'Success',
                                'Project has been created!',
                                'success'
                            );
                            callback(1);
                        }else{
                            oThis.displayErrorNoData(serverDataBody['message']);
                            callback(0);
                        }
                    }else{
                        oThis.displayErrorNoData();
                        callback(0);
                    }
                }else{
                    oThis.displayErrorNoData();
                    callback(0);
                }
            });
        });
        req.write(strRequest);
        req.end();
    }

    // Display Alert Error
    displayErrorNoData = (message) => {
        if ( message === '' || message === null ){
            Swal.fire('Oops...', 'Something went wrong!', 'error');
        }else{
            Swal.fire('Oops...', message, 'error');
        }
    }

    // Is Input String are JSON?
    IsJsonString(str) {
      try {
        JSON.parse(str);
      } catch (e) {
        return false;
      }
      return true;
    }
    // =============================================================================

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
                              <th scope="col" className="text-center">Name</th>
                              <th scope="col" className="text-center">Owner</th>
                              <th scope="col" className="text-center">Location</th>
                              <th scope="col" className="text-center">Description</th>
                              <th scope="col" className="text-center">Created On</th>
                              <th scope="col" className="text-center">Status</th>
                              <th scope="col" className="text-center">Action</th>
                          </tr>
                          <TableView/>
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
            <div class="col-12 col-md-8">
              <Row>
                <Col>
                  <Card>
                      <CardHeader>
                        <i className="fa fa-align-justify"></i> Create New IoT Project
                      </CardHeader>
                      <CardBody>
                          <form>
                              <div className="position-relative form-group was-validated">
                                  <span class="input-group-text">
                                    <label><strong>Project Name:*</strong></label>&nbsp;&nbsp;
                                    <input id="projectname" required="true" type="text" class="form-control-warning form-control" placeholder="Project Name" onChange={event=>this.handleChangeProjectName(event.target.value)} ></input>
                                  </span>
                              </div>
                              <div className="position-relative form-group was-validated">
                                  <span class="input-group-text">
                                    <label><strong>Project Location (Lat, Lng):*</strong></label>&nbsp;&nbsp;
                                    <input id="projectlocation" required="true" type="text" class="form-control-warning form-control" placeholder="Location (lat,lng)" onChange={event=>this.handleChangeProjectLocation(event.target.value)} ></input>
                                  </span>
                              </div>
                              <div className="position-relative form-group">
                                  <span class="input-group-text">
                                      <label><strong>Description:</strong></label>&nbsp;&nbsp;
                                      <input id="projectlocation" required="" type="text" class="form-control" placeholder="About The Project" onChange={event=>this.handleChangeProjectDescription(event.target.value)} ></input>
                                  </span>
                              </div>
                              <div className="position-relative form-group">
                                  <span class="input-group-text">
                                      <label><strong>Activate: </strong></label>&nbsp;&nbsp;
                                      <select id="userlevel" required="" class="form-control" name="userlevel">
                                            <option selected onClick={event=>oThis.handleChangeProjectActivate(0)} >Not Active</option>
                                            <option onClick={event=>oThis.handleChangeProjectActivate(1)} >Active</option>
                                        </select>
                                  </span>
                              </div>
                          </form>
                      </CardBody>
                      <div className="card-footer">
                          <button onClick={event=>this.confirmInsert()} type="submit" className="btn btn-primary" >
                              <i className="fa fa-dot-circle-o"></i> Submit
                          </button>
                          &nbsp;&nbsp;
                          <Button onClick={event=>this.handleCancel()} type="reset" className="btn btn-secondary" >
                              <i className="fa fa-ban"></i> Close
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