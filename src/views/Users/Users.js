import React, { Component, } from 'react';
import { Redirect } from 'react-router-dom';
import { Button, Card, CardBody, CardHeader, Col, Row, Table} from 'reactstrap';

import FileBase64 from 'react-file-base64';
import Swal from 'sweetalert2';
import TableView from './TableView';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

var oThis = null;
var pageMode = 0;

var token = "";
var body = null;
var serverDataBody = null;
var postData = {};

class Users extends Component {
    constructor(props) {
        super(props);
        oThis = this;
        this.state = {
            startDate: new Date(),
            files: []
        };

        this.initDataPost();
        this.handleChangeStart = this.handleChangeStart.bind(this);
    }

    initDataPost = () => {
        postData = {};
        postData['username'] = '';
        postData['fullname'] = '';
        postData['gender'] = 1;
        postData['phone'] = '';
        postData['address'] = '';
        postData['email'] = '';
        postData['weburl'] = '';
        postData['userlevel'] = 2;
        postData['password'] = '';
        postData['activate'] = 0;
        postData["birthdate"] = '';
        this.setState({ files: [] });
        this.setState({ startDate: new Date() });
    }

    componentDidUpdate(){        
    }

    confirmInsert = () => {
        Swal.fire({
          title: 'Are you sure?',
          text: 'This will add new user to the platform!',
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, insert user',
          cancelButtonText: 'No, i change my mind'
        }).then((result) => {
          if (result.value) {
            oThis.handleInsertUser();
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

    // ================================================================
    handleChangeStart = (inDate) => {
        this.setState({
            startDate: inDate
        });
    }

    handleChangeUserName = (value) => {
        postData["username"]=value;
    }

    handleChangeFullName = (value) => {
        postData["fullname"]=value;
    }

    handleChangePhone = (value) => {
        postData["phone"]=value;
    }

    handleChangeAddress = (value) => {
        postData["address"]=value;
    }

    handleChangeEmail = (value) => {
        postData["email"]=value;
    }

    handleChangeWeburl = (value) => {
        postData["weburl"]=value;
    }

    handleChangePassword = (value) => {
        postData["password"]=value;
    }

    switchGender = (inValue) => {
        postData["gender"] = inValue;
    }

    switchLevel = (inValue) => {
        postData["userlevel"] = inValue;
    }

    switchActive = (inValue) => {
        postData["activate"] = inValue;
    }

    resetFiles = () => {
        oThis.setState({ files: [] });
    }

    getFiles = (files) => {
        oThis.setState({ files: files });
        postData['photo'] = oThis.state.files.base64;
    }
    // ================================================================

    handleCreateNew = () => {
        pageMode = 1;
        oThis.forceUpdate();
    }

    handleInsertUser = () => {
        if ( oThis.handleCheckInput !== 0 ){
            var startDay = oThis.state.startDate.getDate();
            var startMonth = oThis.state.startDate.getMonth()+1;
            var startYear = oThis.state.startDate.getFullYear();
            var convertDateFormat = startMonth.toString() + "/" + startDay.toString() + "/" + startYear.toString();
            postData["birthdate"] = convertDateFormat;
        
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

    handleCancel = () => {
        pageMode = 0;
        oThis.resetFiles();
        oThis.forceUpdate();
    }

    handleCheckInput = () => {
        if ( postData.username === null || postData.username === "" ){
            oThis.displayErrorNoData( 'Username Field is empty!' );
            return 0;
        }
        if ( postData.password === null || postData.password === "" ){
          oThis.displayErrorNoData( 'Password Field is empty!' );
          return 0;
        }
        if ( postData.email === null || postData.email === "" ){
          oThis.displayErrorNoData( 'Email Field is empty!' );
          return 0;
        }

        return 1;
    }

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
        postData["mode"] = 2;
        
        var http = require("http");
        var options = {
          "method": "POST",
          "hostname": 'ingen4u.ip-dynamic.com',
          "port": 3100,
          "path": "/users",
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
                                'New user has been registered in the system!',
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
        console.log( localStorage.getItem('userlevel') );
        
        if ( localStorage.getItem('isLogin') !== 'true' ){
            return ( <Redirect to='/login' /> );
        }

        if ( localStorage.getItem('userlevel') !== '1' ){
            return('');
        }

        // Default View
        if ( pageMode === 0 ){
          return(
              <div>
              <Row>
                <Col>
                  <Card>
                    <CardHeader>
                      <i className="fa fa-align-justify"></i>Users
                      <Button className="btn btn-ghost-info pull-right active" onClick={event=>oThis.handleCreateNew()}>
                        <div className="card-header-action">
                          <small className="text-white" >Add New</small>
                        </div>
                      </Button>
                    </CardHeader>
                    <CardBody>
                      <div className="col-md-4 pull-left">
                        <div className="input-group">
                          <input id="search-box" name="search-box" placeholder="Search User by Name or ID" type="text" className="form-control"/>
                        </div>
                      </div>
                      <br/><br/>
                      <Table responsive hover>
                        <thead>
                          <tr>
                              <th scope="col" className="text-center">Photo</th>
                              <th scope="col" className="text-center">User Name</th>
                              <th scope="col" className="text-center">Full Name</th>
                              <th scope="col" className="text-center">Phone</th>
                              <th scope="col" className="text-center">E-Mail</th>
                              <th scope="col" className="text-center">Gender</th>
                              <th scope="col" className="text-center">Type</th>
                              <th scope="col" className="text-center">Created On</th>
                              <th scope="col" className="text-center">Active</th>
                              <th scope="col" className="text-center">Actions</th>
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
                          <i className="fa fa-align-justify"></i> Create New User
                        </CardHeader>
                        <CardBody>
                            <form>
                                <div className="position-relative form-group">
                                    <label><strong>Photo</strong></label><br/>
                                    <img src={oThis.state.files.base64} width="92" height="92" /><br /><br />
                                    <FileBase64 multiple={false} onDone={oThis.getFiles.bind(this)}/>
                                </div>
                                <div className="position-relative form-group was-validated">
                                    <span class="input-group-text">
                                        <label><strong>User Name:* </strong></label>&nbsp;&nbsp;
                                        <input id="username" required="true" type="text" class="form-control-warning form-control" placeholder="User Name" onChange={event=>this.handleChangeUserName(event.target.value)} ></input>
                                    </span>
                                </div>
                                <div className="position-relative form-group">
                                    <span class="input-group-text">
                                        <label><strong>Full Name: </strong></label>&nbsp;&nbsp;
                                        <input id="userfullname" required="" type="text" class="form-control" placeholder="Full Name" onChange={event=>this.handleChangeFullName(event.target.value)} ></input>
                                    </span>
                                </div>
                                <div className="position-relative form-group">
                                    <span class="input-group-text">
                                        <label><strong>Birthdate:</strong></label>&nbsp;&nbsp;
                                        <DatePicker
                                          dateFormat="MM/dd/yyyy"
        								                  selected={this.state.startDate}
        								                  onChange={this.handleChangeStart}
      							        />
                                    </span>
                                </div>
                                <div className="position-relative form-group">
                                    <span class="input-group-text">
                                        <label><strong>Gender:</strong></label>&nbsp;&nbsp;
                                        <select id="usergender" required="" class="form-control" name="usergender">
                                            <option onClick={event=>oThis.switchGender(1)} selected>Male</option>
                                            <option onClick={event=>oThis.switchGender(2)} >Female</option>
                                        </select>
                                    </span>
                                </div>
                                <div className="position-relative form-group">
                                    <span class="input-group-text">
                                        <label><strong>Phone:</strong></label>&nbsp;&nbsp;
                                        <input id="userphone" required="" type="text" class="form-control" placeholder="Phone" onChange={event=>this.handleChangePhone(event.target.value)} ></input>
                                    </span>
                                </div>
                                <div className="position-relative form-group">
                                    <span class="input-group-text">
                                        <label><strong>Address:</strong></label>&nbsp;&nbsp;
                                        <input id="useraddress" required="" type="text" class="form-control" placeholder="Full Address" onChange={event=>this.handleChangeAddress(event.target.value)} ></input>
                                    </span>
                                </div>
                                <div className="position-relative form-group was-validated">
                                    <span class="input-group-text">
                                        <label><strong>Email:* </strong></label>&nbsp;&nbsp;
                                        <input id="useremail" required="true" type="email" class="form-control-warning form-control" placeholder="Email" onChange={event=>this.handleChangeEmail(event.target.value)} ></input>
                                    </span>
                                </div>
                                <div className="position-relative form-group">
                                    <span class="input-group-text">
                                        <label><strong>Website URL: </strong></label>&nbsp;&nbsp;
                                        <input id="useremail" required="" type="text" class="form-control" placeholder="Website URL (start with: http:// or https://)" onChange={event=>this.handleChangeWeburl(event.target.value)} ></input>
                                    </span>
                                </div>
                                <div className="position-relative form-group">
                                    <span class="input-group-text">
                                        <label><strong>User Level: </strong></label>&nbsp;&nbsp;
                                        <select id="userlevel" required="" class="form-control" name="userlevel">
                                            <option onClick={event=>oThis.switchLevel(1)}>Admin</option>
                                            <option onClick={event=>oThis.switchLevel(2)} selected>User</option>
                                        </select>
                                    </span>
                                </div>
                                <div className="position-relative form-group was-validated">
                                    <span class="input-group-text">
                                        <label><strong>Password:* </strong></label>&nbsp;&nbsp;
                                        <input id="useremail" required="true" type="password" class="form-control-warning form-control" placeholder="Password" onChange={event=>this.handleChangePassword(event.target.value)}></input>
                                    </span>
                                </div>
                                <div className="position-relative form-group">
                                    <span class="input-group-text">
                                        <label><strong>Activate: </strong></label>&nbsp;&nbsp;
                                        <select id="userlevel" required="" class="form-control" name="userlevel">
                                            <option onClick={event=>oThis.switchActive(0)} selected>Not Active</option>
                                            <option onClick={event=>oThis.switchActive(1)}>Active</option>
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

        // End Of Block
    }
}

export default Users;