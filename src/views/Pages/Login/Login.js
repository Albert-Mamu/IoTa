import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';

import Swal from 'sweetalert2';

var oThis = null;

var token = "";
var body = null;
var serverDataBody = null;
var postData = {};

class Login extends Component {
    constructor(props) {
	    super(props);
	  
      localStorage.clear();
	  
	    // Set Default Value
	    localStorage.setItem('isLogin', false );
		
	    localStorage.setItem('userid', null );
      localStorage.setItem('username', null );
      localStorage.setItem('userlevel', null );
	    localStorage.setItem('fullname', null );
	    localStorage.setItem('gender', null );
	    localStorage.setItem('birthdate', null );
	    localStorage.setItem('photos', null );
	    localStorage.setItem('email', null );
	  
	    this.state = {
		    inputUseName: '',
		    inputUsePassword: '',
		    serverDown: false,
		    invalidInput: false,
		    invalidUser: false
	    };
	  
	    oThis = this;
    }

  handleLogin = () => {
      oThis.handleGetToken(function (callback) {
        oThis.handleCheckLogin( function (callback, userid) {
            if ( localStorage.getItem('isLogin') === 'true' ){
              oThis.props.history.push('/dashboard',null);				
            }else{

            }
        });
      });
  }

  // ======================================================================
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

  handleCheckLogin = (callback) => {
    oThis.initServerVars();
    postData["mode"] = 1;
    postData['username'] = this.state.inputUseName;
    postData['password'] = this.state.inputUsePassword;

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

                        localStorage.setItem('isLogin', true );
                        localStorage.setItem('userid', serverDataBody['data'][0]['userid'] );
                        localStorage.setItem('userlevel', serverDataBody['data'][0]['level'] );
                        localStorage.setItem('username', serverDataBody['data'][0]['username'] );
                        localStorage.setItem('fullname', serverDataBody['data'][0]['fullname'] );
                        localStorage.setItem('gender', serverDataBody['data'][0]['gender'] );
                        localStorage.setItem('birthdate', serverDataBody['data'][0]['birthdate'] );
                        localStorage.setItem('photos', serverDataBody['data'][0]['photo'] );
                        localStorage.setItem('email', serverDataBody['data'][0]['email'] );

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
  // =======================================================================

  userLogin = () => {
	    localStorage.setItem('isLogin', false);
	  
	    if ( this.state.inputUseName === '' || this.state.inputUsePassword === '' ){
		    this.setState({
			    invalidInput: true
		    });	
	  	  return;
	    }else{
		    this.setState({
			    invalidInput: false
		    });
	    }
	
      oThis.handleLogin();
  }
    
  render() {

    // Check is user already login?
    if ( localStorage.getItem('isLogin') === 'true' ){
	    return ( <Redirect to='/dashboard' /> );
    }

    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                  {
                    this.state.invalidInput ?
                    (
                      <div class="alert alert-danger fade show" role="alert"><center>ERROR: Please fill the form correctly!</center></div>
                    ) : this.state.invalidUser &&
                    (
                      <div class="alert alert-danger fade show" role="alert"><center>ERROR: User / Password incorrect!</center></div>		  	
                    )
                  }
                  {
                    this.state.serverDown &&
                    (
                      <div class="alert alert-danger fade show" role="alert"><center>ERROR: server is down!</center></div>
                    )
                  }
                    <Form>
                      <h1>Login</h1>
                      <p className="text-muted">Sign In to your account</p>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="text" onChange={event => this.setState( {inputUseName: event.target.value })} placeholder="Username" autoComplete="username" />
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="password" onChange={event => this.setState({ inputUsePassword: event.target.value })} placeholder="Password" autoComplete="current-password" />
                      </InputGroup>
                      <Row>
                        <Col xs="6">
                          <Button color="primary" className="px-4" onClick={event => oThis.userLogin()} >Login</Button>
                        </Col>
                        <Col xs="6" className="text-right">
                          <Button color="link" className="px-0">Forgot password?</Button>
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
                <Card className="text-white bg-primary py-5 d-md-down-none" style={{ width: '44%' }}>
                  <CardBody className="text-center">
                    <div>
                      <h2>Sign up</h2>
                      <p>Create new user account.</p>
                      <Link to="/register">
                        <Button color="primary" className="mt-3" active tabIndex={-1}>Register Now!</Button>
                      </Link>
                    </div>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Login;
