/*
Root component for Mafia app.
*/

import React, { Component } from 'react'
import axios from "axios"
import './App.css'
import AccountCreation from "./AccountCreation"
import AccountDelete from "./AccountDelete"
import AccountLogin from "./AccountLogin"
import AccountManage from "./AccountManage"
import ChangePassword from "./ChangePassword"
import MainMenu from "./MainMenu"
import Welcome from "./Welcome"
import AccountMenu from "./AccountMenu"
import GameContent from "./GameContent"
import MessageBar from "./MessageBar"
import Shared from "./Shared"

const ContentEnum = {
  AccountCreation: "AccountCreation",
  AccountDelete: "AccountDelete",
  AccountLogin: "AccountLogin",
  AccountManage: "AccountManage",
  ChangePassword: "ChangePassword",
  GameContent: "GameContent",
  MainMenu: "MainMenu",
  Welcome: "Welcome"
}

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      username: null,
      loginStatus: null,
      currentContent: null,
      userMessage: "" // important message visible to user
    }
    axios.defaults.withCredentials = true
    this.createAccountWithConfirm = this.createAccountWithConfirm.bind(this)
    this.navigateLogin = this.navigateLogin.bind(this)
    this.navigateManage = this.navigateManage.bind(this)
    this.navigateDelete = this.navigateDelete.bind(this)
    this.navigateCreate = this.navigateCreate.bind(this)
    this.navigateChangePassword = this.navigateChangePassword.bind(this)
    this.navigateMainMenu = this.navigateMainMenu.bind(this)
    this.navigateGameContent = this.navigateGameContent.bind(this)
    this.logout = this.logout.bind(this)
    this.deleteAccount = this.deleteAccount.bind(this)
    this.login = this.login.bind(this)
    this.changePassword = this.changePassword.bind(this)
  }
  componentDidMount(){
    this.updateLoginStatus()
  }
  // clear the user visible messages
  // generally called when submits a form or navigates to new page
  clearMessage(){
    this.setState({userMessage: ""})
  }
  displayMessage(message){
    this.setState({userMessage: message})
  }
  updateLoginStatus(){
    axios({
      method: "get",
      url: "http://localhost:3001/loginstatus",
      withCredentials: true
    }).then((function(response){
      if(response.data.loginStatus){
        switch(response.data.loginStatus){
          case Shared.LoginStatus.LOGGEDIN:
            if(response.data.username){
              this.setState({
                username: response.data.username,
                loginStatus: Shared.LoginStatus.LOGGEDIN,
                currentContent: ContentEnum.MainMenu
              })
            }
            else{
              console.log("Warning: server responds that user is logged in, but did not specify a user name")
            }
            break
          case Shared.LoginStatus.LOGGEDOUT:
            this.setState({
              username: null,
              loginStatus: Shared.LoginStatus.LOGGEDOUT,
              currentContent: ContentEnum.Welcome
            })
            break
          case Shared.LoginStatus.ERROR:
            this.setState({
              username: null,
              loginStatus: Shared.LoginStatus.ERROR
            })
            console.log("User session is corrupt, logging out and back in may fix the problem.")
            break
          default:
            console.log("Unrecognized loginStatus value returned from server.")
        }
      }
      else{
        console.log("Warning: after requesting logged in status from server, response from server was malformed")
      }
    }).bind(this)).catch((function(error){
      this.displayMessage("Error occurred communicating with server. You may want to try refreshing the page. If problem persists, please try again later.")
      console.log("Error getting login status: " + error)
    }).bind(this))
  }
  createAccount(username, password){
    axios({
      method: "post",
      url: "http://localhost:3001/signup",
      data: {
        username: username,
        password: password
      },
      withCredentials: true
    }).then((function(response){
      if(response.data){
        switch(response.data.outcome){
          case Shared.AccountCreateOutcome.INTERNALERROR:
            this.displayMessage("Internal server error creating account. Please try again later.")
            break
          case Shared.AccountCreateOutcome.EXISTS:
            this.displayMessage("An account by that name already exists.")
            break
          case Shared.AccountCreateOutcome.MISSINGINFO:
            this.displayMessage("Error creating account due to API mismatch between client and server. Please report this error and try again later.")
            console.log("Error: server reports that in the request to create an account, username and password information is missing from the body.")
            break
          case Shared.AccountCreateOutcome.SUCCESS:
            if(this.state.loginStatus === Shared.LoginStatus.LOGGEDIN){
              this.displayMessage("Account successfully created! To log in with your new account, log out first.")
            }
            else if(this.state.loginStatus === Shared.LoginStatus.LOGGEDOUT){
              this.setState({
                currentContent: ContentEnum.AccountLogin,
                userMessage: "Account successfully created!"
              })
            }
            else{
              this.displayMessage("Account successfully created, but your user session appears to be corrupt. Please log out or refresh the page before attempting to log in with your new account.")
            }
            break
          default:
            this.displayMessage("Unrecognized response from server. Please report this error and try again later.")
            console.log("Unrecognized create account outcome: " + response.data.outcome)
        }
      }
      else{
        this.displayMessage("Unexpected response received from server when requesting the creation of the account. Please report this issue and/or try again later.")
        console.log("Error: when requesting server to create an account, response object does not contain outcome field.")
      }
    }).bind(this)).catch((function(error){
      this.displayMessage("Error communicating with server when trying to create account. You may try to create the account again. If problem persists, please try again later.")
      console.log("Error in HTTP request to create an account: " + error)
    }).bind(this))
  }
  createAccountWithConfirm(username, password, confirm){
    this.clearMessage()
    if(password === confirm){
      this.createAccount(username, password)
    }
    else{
      this.displayMessage("Passwords do not match.")
    }
  }
  deleteAccount(password){
    this.clearMessage()
    if(this.state.loginStatus === Shared.LoginStatus.LOGGEDIN && this.state.username){
      axios({
        method: "post",
        url: "http://localhost:3001/deleteAccount",
        data: {
          password: password
        },
        withCredentials: true
      }).then((function(response){
        if(response.data){
          switch(response.data.outcome){
            case Shared.AccountDeleteOutcome.NOTLOGGEDIN:
              this.displayMessage("The server thinks you are not logged in. Try logging out, logging back in, and deleting your account again.")
              break
            case Shared.AccountDeleteOutcome.INTERNALERROR:
              this.displayMessage("Internal server error trying to delete account. Please try again later.")
              break
            case Shared.AccountDeleteOutcome.MISSINGINFO:
              this.displayMessage("Protocol mismatch between client and server. Please report this problem and try again later.")
              break
            case Shared.AccountDeleteOutcome.WRONGPASSWORD:
              this.displayMessage("This password you entered was incorrect.")
              break
            case Shared.AccountDeleteOutcome.SUCCESS:
              this.setState({
                username: null,
                loginStatus: Shared.LoginStatus.LOGGEDOUT,
                currentContent: ContentEnum.Welcome,
                userMessage: ""
              })
              break
            default:
              this.displayMessage("Incomplete response from server. Please report this problem and try again later.")
          }
        }
        else{
          this.displayMessage("Incomplete response from server when trying to delete account. Please report this issue and try again later.")
        }
      }).bind(this)).catch((function(error){
        this.displayMessage("Error communicating with server when trying to delete account. Please try again later.")
        console.log("Error communicating with server when trying to delete account: " + error)
      }).bind(this))
    }
    else{
      console.log("Warning: attempt to delete account when client application is not logged in.")
    }
  }
  login(username, password){
    this.clearMessage()
    axios({
      method: "post",
      url: "http://localhost:3001/login",
      data: {
        username: username,
        password: password
      },
      withCredentials: true
    }).then((function(response){
      if(response.data){
        switch(response.data.outcome){
          case Shared.LoginOutcome.LOGGEDIN:
            this.displayMessage("The server thinks you are already logged in. Try refreshing the page to see if your login status is corrected.")
            break
          case Shared.LoginOutcome.INTERNALERROR:
            this.displayMessage("Internal server error when trying to log in. Please try again later.")
            break
          case Shared.LoginOutcome.MISSINGINFO:
            this.displayMessage("Protocol mismatch between client and server. If problem persists, please report the problem and try again later.")
            break
          case Shared.LoginOutcome.WRONGCREDENTIALS:
            this.displayMessage("Invalid username and/or password.")
            break
          case Shared.LoginOutcome.SUCCESS:
            this.setState({
              username: username,
              loginStatus: Shared.LoginStatus.LOGGEDIN,
              currentContent: ContentEnum.MainMenu
            })
            break
          default:
            this.displayMessage("Incomplete response from server. Please report this problem and try again later.")
        }
      }
    }).bind(this)).catch((function(error){
      this.displayMessage("Error communicating with server when trying to log in. Please try again later.")
      console.log("Error communicating with server when trying to log in: " + error)
    }).bind(this))
  }
  logout(){
    this.clearMessage()
    // If internal login state is in ERROR state, try to logout from the server
    // to try to clear up corrupted session.
    if(this.state.loginStatus === Shared.LoginStatus.LOGGEDIN || this.state.loginStatus === this.LoginStatus.ERROR){
      axios({
        method: "get",
        url: "http://localhost:3001/logout",
        withCredentials: true
      }).then((function(response){
        if(response.data){
          switch(response.data.outcome){
            case Shared.LogoutOutcome.SUCCESS:
              this.setState({
                username: null,
                loginStatus: Shared.LoginStatus.LOGGEDOUT,
                currentContent: ContentEnum.Welcome,
                userMessage: "Successfully logged out."
              })
              break
            case Shared.LogoutOutcome.INTERNALERROR:
              this.displayMessage("Internal server error when trying to log out. Please try again later.")
              break
            case Shared.LogoutOutcome.NOTLOGGEDIN:
              this.setState({
                username: null,
                loginStatus: Shared.LoginStatus.LOGGEDOUT,
                currentContent: ContentEnum.Welcome,
                userMessage: "Server indicates that you were already logged out."
              })
              console.log("Warning: client made attempt to log out, but server reports account is already logged out.")
              break
            default:
              this.displayMessage("Unrecognized response from server when attempting to log out. Please report this problem and try again later.")
              console.log("Unrecognized log out outcome received: " + response.data.outcome)
          }
        }
        else{
          this.displayMessage("Incomplete response from server when trying to log out. Please report this issue and try again later.")
        }
      }).bind(this)).catch((function(error){
      this.displayMessage("Error communicating with server when trying to log out. Please try again later.")
      console.log("Error communicating with server when trying to log out: " + error)
      }).bind(this))
    }
    else if(this.state.loginStatus === Shared.LoginStatus.LOGGEDOUT){
      this.displayMessage("You are already logged out.")
      console.log("Warning: attempt to log out on client end when state already indicates the account is logged out.")
    }
    else{
      this.displayMessage("Local login information is corrupt. Refreshing the page may solve the problem.")
    }
  }
  changePassword(oldPassword, newPassword){
    this.clearMessage()
    if(this.state.loginStatus === Shared.LoginStatus.LOGGEDIN && this.state.username){
      axios({
        method: "post",
        url: "http://localhost:3001/changePassword",
        data: {
          oldPassword: oldPassword,
          newPassword: newPassword
        },
        withCredentials: true
      }).then((function(response){
        if(response.data){
          switch(response.data.outcome){
            case Shared.ChangePasswordOutcome.NOTLOGGEDIN:
              this.displayMessage("The server thinks you are not logged in. Try logging out and logging back in.")
              break
            case Shared.ChangePasswordOutcome.INTERNALERROR:
              this.displayMessage("Internal server error trying to change password. Please try again later.")
              break
            case Shared.ChangePasswordOutcome.MISSINGINFO:
              this.displayMessage("Protocol mismatch between client and server. Please report this problem and try again later.")
              break
            case Shared.ChangePasswordOutcome.WRONGPASSWORD:
              this.displayMessage("This password you entered was incorrect.")
              break
            case Shared.ChangePasswordOutcome.SUCCESS:
              this.displayMessage("Password changed successfully.")
              break
            default:
              this.displayMessage("Incomplete response from server. Please report this problem and try again later.")
          }
        }
        else{
          this.displayMessage("Incomplete response from server when trying to change password. Please report this issue and try again later.")
        }
      }).bind(this)).catch((function(error){
        this.displayMessage("Error communicating with server when trying to change password. Please try again later.")
        console.log("Error communicating with server when trying to change password: " + error)
      }).bind(this))
    }
    else{
      console.log("Warning: attempt to change password when client application is not logged in.")
    }
  }

  // navigation

  navigateLogin(){
    this.clearMessage()
    if(this.state.loginStatus === Shared.LoginStatus.LOGGEDIN){
      this.displayMessage("Already logged in. To log in as a different user, log out first.")
      console.log("Warning: attempt to navigate to log in component when a user is already logged in.")
    }
    else if(this.state.loginStatus === Shared.LoginStatus.LOGGEDOUT){
      this.setState({currentContent: ContentEnum.AccountLogin})
    }
    else if(this.state.loginStatus === Shared.LoginStatus.ERROR){
      this.displayMessage("User session is corrupt. Logging out and back in may fix the problem.")
      console.log("Tried to navigate to login page but user session is corrupt. Logging out first may fix the problem.")
    }
    else{
      this.displayMessage("User session was not properly initialized. Reloading the page may fix the problem.")
      console.log("Tried to navigate to login page but login status not properly initialized. One case may be that the backend server was unreachable. Reloading the page may fix the problem.")
    }
  }
  navigateManage(){
    this.clearMessage()
    if(this.state.loginStatus === Shared.LoginStatus.LOGGEDIN){
      this.setState({currentContent: ContentEnum.AccountManage})
    }
    else if(this.state.loginStatus === Shared.LoginStatus.LOGGEDOUT){
      this.displayMessage("You are not logged in. Please log in first to manage an account.")
    }
    else if(this.state.loginStatus === Shared.LoginStatus.ERROR){
      this.displayMessage("User session is corrupt. Logging out and back in may fix the problem.")
      console.log("Tried to navigate to account management page but user session is corrupt. Logging out first may fix the problem.")
    }
    else{
      this.displayMessage("User session was not properly initialized. Reloading the page may fix the problem.")
      console.log("Tried to navigate to account management but login status not properly initialized. One cause may be that the backend server was unreachable. Reloading the page may fix the problem.")
    }
  }
  navigateCreate(){
    this.clearMessage()
    if(this.state.loginStatus === Shared.LoginStatus.LOGGEDIN){
      this.displayMessage("You are logged in. Please log out first.")
    }
    else if(this.state.loginStatus === Shared.LoginStatus.ERROR){
      this.displayMessage("User session is corrupt. Please log out first and try again.")
    }
    else if(this.state.loginStatus === Shared.LoginStatus.LOGGEDOUT){
      this.setState({currentContent: ContentEnum.AccountCreation})
    }
    else{
      this.displayMessage("User session was not properly initilized. Please refresh the page and try again.")
    }
  }
  navigateChangePassword(){
    this.clearMessage()
    if(this.state.loginStatus === Shared.LoginStatus.LOGGEDIN){
      this.setState({currentContent: ContentEnum.ChangePassword})
    }
    else if(this.state.loginStatus === Shared.LoginStatus.LOGGEDOUT){
      this.displayMessage("You must be logged in to change the password for an account.")
    }
    else if(this.state.loginStatus === Shared.LoginStatus.ERROR){
      this.displayMessage("User session is corrupt. Please log out and log in again.")
    }
    else{
      this.displayMessage("User session was not properly initialized. Please refresh the page and try again.")
    }
  }
  navigateDelete(){
    this.clearMessage()
    if(this.state.loginStatus === Shared.LoginStatus.LOGGEDIN){
      this.setState({currentContent: ContentEnum.AccountDelete})
    }
    else if(this.state.loginStatus === Shared.LoginStatus.LOGGEDOUT){
      this.displayMessage("You must be logged in to delete an account.")
    }
    else if(this.state.loginStatus === Shared.LoginStatus.ERROR){
      this.displayMessage("User session is corrupt. Please log out and log in again.")
    }
    else{
      this.displayMessage("User session was not properly initialized. Please refresh the page and try again.")
    }
  }
  navigateMainMenu(){
    this.clearMessage()
    if(this.state.loginStatus === Shared.LoginStatus.LOGGEDIN){
      this.setState({currentContent: ContentEnum.MainMenu})
    }
    else if(this.state.loginStatus === Shared.LoginStatus.LOGGEDOUT){
      this.displayMessage("You are not logged in. Please log in first.")
    }
    else if(this.state.loginStatus === Shared.LoginStatus.ERROR){
      this.displayMessage("User session is corrupt. Logging out and back in may fix the problem.")
      console.log("Tried to navigate to main menu but user session is corrupt. Logging out first may fix the problem.")
    }
    else{
      this.displayMessage("User session was not properly initialized. Reloading the page may fix the problem.")
      console.log("Tried to navigate to main menu but login status not properly initialized. One cause may be that the backend server was unreachable. Reloading the page may fix the problem.")
    }
  }
  navigateGameContent(){
    this.clearMessage()
    if(this.state.loginStatus === Shared.LoginStatus.LOGGEDIN){
      this.setState({currentContent: ContentEnum.GameContent})
    }
    else if(this.state.loginStatus === Shared.LoginStatus.LOGGEDOUT){
      this.displayMessage("You are not logged in. Please log in first.")
    }
    else if(this.state.loginStatus === Shared.LoginStatus.ERROR){
      this.displayMessage("User session is corrupt. Logging out and back in may fix the problem.")
      console.log("Tried to navigate to game content but user session is corrupt. Logging out first may fix the problem.")
    }
    else{
      this.displayMessage("User session was not properly initialized. Reloading the page may fix the problem.")
      console.log("Tried to navigate to game content but login status not properly initialized. One cause may be that the backend server was unreachable. Reloading the page may fix the problem.")
    }
  }

  // return component of content pane based on state
  getContent(){
    switch(this.state.currentContent){
      case ContentEnum.AccountCreation:
        return <AccountCreation submitCredentials={this.createAccountWithConfirm} loginRedirect={this.navigateLogin} />
      case ContentEnum.AccountDelete:
        return <AccountDelete submitPassword={this.deleteAccount} username={this.state.username} />
      case ContentEnum.AccountLogin:
        return <AccountLogin submitCredentials={this.login} createRedirect={this.navigateCreate} />
      case ContentEnum.AccountManage:
        return <AccountManage changePasswordRedirect={this.navigateChangePassword} deleteRedirect={this.navigateDelete} username={this.state.username} />
      case ContentEnum.ChangePassword:
        return <ChangePassword submitPasswords={this.changePassword} username={this.state.username} />
      case ContentEnum.MainMenu:
        return <MainMenu handleEnterGame={this.navigateGameContent} handleManage={this.navigateManage} handleLogout={this.logout} />
      case ContentEnum.Welcome:
        return <Welcome handleLogin={this.navigateLogin} handleCreate={this.navigateCreate} />
      case ContentEnum.GameContent:
        return <GameContent handleMainMenu={this.navigateMainMenu} username={this.state.username} />
      default:
        return <h2>An internal error has occurred. Please report this issue and try again later.</h2>
    }
  }
  render() {
    return (
      <table>
        <tbody>
          <tr>
            <td>
              <AccountMenu username={this.state.username} loginStatus={this.state.loginStatus} handleLogin={this.navigateLogin} handleLogout={this.logout} handleManage={this.navigateManage} />
            </td>
            <td><h1>Absreim's Mafia React Client</h1></td>
          </tr>
          <tr>
            <td>
              <MessageBar message={this.state.userMessage} />
            </td>
          </tr>
          <tr>
            <td>{this.getContent()}</td>
          </tr>
        </tbody>
      </table>
    )
  }
}

export default App
