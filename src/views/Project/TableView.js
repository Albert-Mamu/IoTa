import React, { Component, } from 'react';

import Swal from 'sweetalert2';

var oThis = null;

var token = "";
var body = null;
var serverDataBody = null;
var readData="";
var postData = {};

class TableView extends Component {
    constructor(props) {
        super(props);
        oThis = this;

        oThis.initDataPost();
        oThis.handleGetAllProject();
    }

    componentDidUpdate(){
        postData = {};
    }

    initDataPost = () => {
        postData = {};
        postData['projectowner'] = Number( localStorage.getItem('userid') );
        postData['ownername'] = localStorage.getItem('fullname');
    }

    confirmDelete = (projectid) => {
        Swal.fire({
          title: 'Are you sure?',
          text: 'This will delete the selected project from the platform!',
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, delete it',
          cancelButtonText: 'No, i change my mind'
        }).then((result) => {
          if (result.value) {
            oThis.handleDeleteProject(projectid);
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire(
              'Cancelled',
              'You change your mind:)',
              'error'
            );
          }
        })
    }

    handleGetAllProject = () => {
        oThis.handleGetToken(function (callback) {
            oThis.handlePostListProject( function (callback) {
                oThis.initDataPost();
                oThis.forceUpdate();
            });
        });
    }

    handleDeleteProject = (projectid) => {
        postData['projectid'] = projectid;
        oThis.handleGetToken(function (callback) {
            oThis.handlePostDeleteProject( function (callback) {
                oThis.initDataPost();
                oThis.handleGetAllProject();
            });
        });
    }
    
    // =============================================================================
    initServerVars = () => {
        serverDataBody = null;
        readData="";
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

    handlePostListProject = (callback) => {
        oThis.initServerVars();
        postData["mode"] = 0;

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
                            readData = JSON.stringify( serverDataBody.data );
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

    handlePostDeleteProject = (callback) => {
        oThis.initServerVars();
        postData["mode"] = 2;

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
        if ( readData !== null && readData !== '' ){
            const varRenderContent = JSON.parse(readData).map((d) => {
                return(
                    <tr>
                        <td class="text-center">
                            {d.projectname}
                        </td>
                        <td class="text-center">
                            {d.ownername}
                        </td>
                        <td class="text-center">
                            {d.projectlocation}
                        </td>
                        <td class="text-center">
                            {d.projectdescription}
                        </td>
                        <td class="text-center">
                            {d.created_on.replace('T',' ').substring(0, d.created_on.length - 5)}
                        </td>
                        <td class="text-center">
                        {
                            d.active === 1 ? (
                                <span class="badge badge-success">Active</span>
                            ) : (
                                <span class="badge badge-secondary">Not Active</span>
                            )
                        }
                        </td>
                        <td class="text-center">
                            <button type="button" class="btn btn-sm btn-pill btn-danger" onClick={event=>oThis.confirmDelete(d.projectid)}>Delete</button>&nbsp;&nbsp;
                            <button type="button" class="btn btn-sm btn-pill btn-warning">Edit</button>
                        </td>
                    </tr>
                )
            });
            return (varRenderContent);
        }

        return('');
    }

}

export default TableView;