import React, { Component, } from 'react';
import { Redirect } from 'react-router-dom';

var oThis = null;

class UserDetail extends Component {
    constructor(props) {
        super(props);
        oThis = this;
    }

    render() {
        if ( localStorage.getItem('isLogin') !== 'true' ){
            return ( <Redirect to='/login' /> );
        }

        return('');
    }
}

export default UserDetail;