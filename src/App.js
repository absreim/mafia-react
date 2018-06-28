/*
Root component for Mafia app.
*/

import React, { Component } from 'react'
import axios from "axios"
import './App.css'
import AccountCreation from "./AccountCreation"
import AccountMenu from "./AccountMenu.js"
import Shared from "./Shared.js"


class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      username: null,
      loginStatus: null,
      currentContent: null,
      userImportantMessage: "" // important message visible to user
    }
    this.createAccountWithConfirm = this.createAccountWithConfirm.bind(this)
    this.navigateLogin = this.navigateLogin.bind(this)
  }
  componentDidMount(){
    updateLoginStatus()
  }
  // clear the user visible messages
  // generally called when submits a form or navigates to new page
  clearMessage(){
    this.setState({userImportantMessage: ""})
  }
  importantMessage(message){
    this.setState({userImportantMessage: message})
  }
  updateLoginStatus(){
    axios.get("http://localhost:3001/loginstatus").then(function(response){
      if(response.data.loginStatus){
        switch(response.data.loginStatus){
          case Shared.LoginState.LOGGEDIN:
            if(response.data.username){
              this.setState({
                username: response.data.username,
                loginStatus: Shared.LoginState.LOGGEDIN
              })
            }
            else{
              console.log("Warning: server responds that user is logged in, but did not specify a user name")
            }
          case Shared.LoginState.LOGGEDOUT:
            this.setState({
              username: null,
              loginStatus: Shared.LoginState.LOGGEDOUT
            })
          case Shared.LoginState.ERROR:
            this.setState({
              username: null,
              loginStatus: Shared.LoginState.ERROR
            })
            console.log("User session is corrupt, logging out and back in may fix the problem.")
          default:
            console.log("Unrecognized loginStatus value returned from server.")
        }
      }
      else{
        console.log("Warning: after requesting logged in status from server, response from server was malformed")
      }
    }).catch(function(error){
      importantMessage("Error occurred communicating with server. You may want to try refreshing the page. If problem persists, please try again later.")
      console.log("Error getting login status: " + error)
    })
  }
  createAccount(username, password){
    axios({
      method: "post",
      url: "http://localhost:3001/signup",
      data: {
        username: username,
        password: password
      }
    }).then(function(response){
      if(response.data.outcome){
        switch(response.data.outcome){
          case Shared.AccountCreateOutcome.INTERNALERROR:
            importantMessage("Internal server error creating account. Please try again later.")
          case Shared.AccountCreateOutcome.EXISTS:
            importantMessage("An account by that name already exists.")
          case Shared.AccountCreateOutcome.MISSINGINFO:
            importantMessage("Error creating account due to API mismatch between client and server. Please report this error and try again later.")
            console.log("Error: server reports that in the request to create an account, username and password information is missing from the body.")
          case Shared.AccountCreateOutcome.SUCCESS:
            if(this.state.loginStatus == Shared.LoginState.LOGGEDIN){
              importantMessage("Account successfully created! To log in with your new account, log out first.")
            }
            else if(this.state.loginStatus == Shared.LoginState.LOGGEDOUT){
              this.setState({
                currentContent: ContentEnum.AccountLogin,
                userImportantMessage: "Account successfully created!"
              })
            }
            else{
              importantMessage("Account successfully created, but your user session appears to be corrupt. Please log out or refresh the page before attempting to log in with your new account.")
            }
        }
      }
      else{
        importantMessage("Unexpected response received from server when requesting the creation of the account. Please report this issue and/or try again later.")
        console.log("Error: when requesting server to create an account, response object does not contain outcome field.")
      }
    }).catch(function(error){
      importantMessage("Error communicating with server when trying to create account. You may try to create the account again. If problem persists, please try again later.")
      console.log("Error in HTTP request to create an account: " + error)
    })
  }
  createAccountWithConfirm(username, password, confirm){
    this.clearMessage()
    if(password === confirm){
      createAccount(username, password)
    }
    else{
      this.importantMessage("Passwords do not match.")
    }
  }
  navigateLogin(){
    this.clearMessage()
    if(this.state.loginStatus == Shared.LoginState.LOGGEDIN){
      this.importantMessage("Already logged in. To log in as a different user, log out first.")
      console.log("Warning: attempt to navigate to log in component when a user is already logged in.")
    }
    else if(this.state.loginStatus == Shared.LoginState.LOGGEDOUT){
      this.setState({currentContent: ContentEnum.AccountLogin})
    }
    else if(this.state.loginStatus == Shared.LoginState.ERROR){
      this.importantMessage("User session is corrupt. Logging out and back in may fix the problem.")
      console.log("Tried to navigate to login page but user session is corrupt. Logging out first may fix the problem.")
    }
    else{
      this.importantMessage("User session was not properly initialized. Reloading the page may fix the problem.")
      console.log("Tried to navigate to login page but login status not properly initialized. One case may be that the backend server was unreachable. Reloading the page may fix the problem.")
    }
  }
  // return component of content pane based on state
  getContent(){
    switch(this.state.currentContent){
      case ContentEnum.AccountCreation:
        return <AccountCreation submitCredentials={createAccountWithConfirm} loginRedirect={this.navigateLogin} />
    }
  }
  render() {
    return (
      <table>
        <tr>
          <td>
            <AccountMenu username={this.state.username} loginStatus={this.state.loginStatus} handleLogin={this.navigateLogin} />
          </td>
          <td><h1>Absreim's Mafia React Client</h1></td>
        </tr>
        <tr>
          <MessageBar message={this.state.userImportantMessage} />
        </tr>
        <tr>
          <td>{getContent()}</td>
        </tr>
      </table>
    )
  }
}

ContentEnum = {
  AccountCreation: "AccountCreation",
  AccountDelete: "AccountDelete",
  AccountLogin: "AccountLogin",
  AccountMaange: "AccountManage",
  ChangePassword: "ChangePassword",
  MainMenu: "MainMenu",
  Welcome: "Welcome"
}

export default App
