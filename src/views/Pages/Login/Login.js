import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';

var oThis = null;

class Login extends Component {
  constructor(props) {
	  super(props);
	  
	  localStorage.clear();
	  
	  // Set Default Value
	  localStorage.setItem('auth', '' );
	  localStorage.setItem('isLogin', false );
	  localStorage.setItem('serverDown', false );
		
	  localStorage.setItem('userid', null );
	  localStorage.setItem('username', null );
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
  
  // Is Input String are JSON?
  IsJsonString(str) {
	try {
		JSON.parse(str);
	} catch (e) {
		return false;
	}
	return true;
  }
  
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
	
	if ( this.state.inputUseName === 'admin' && this.state.inputUsePassword === 'admin' ){
		this.setState({
			invalidInput: false
		});	
		localStorage.setItem('isLogin', true);
		console.log('Success!');
	}else{
		this.setState({
			invalidInput: true
		});			
		localStorage.setItem('isLogin', false);
	}
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
                      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua.</p>
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
