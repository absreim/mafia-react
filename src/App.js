/*
Root component for Mafia app.
*/

import React, { Component } from 'react'
import axios from "axios"
import './App.css'
import AccountMenu from "./AccountMenu.js"
import Shared from "./Shared.js"


class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      username: null,
      loginStatus: null,
      currentContent: null
    }
  }
  componentDidMount(){
    updateLoginStatus()
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

            })
            console.log("User session is corrupt, logging out and back in may fix the problem.")
        }
      }
      else{
        console.log("Warning: after requesting logged in status from server, response from server was malformed")
      }
    }).catch(function(error){
      console.log("Error getting login status: " + error)
    })
  }
  render() {
    return (
      <table>
        <tr>
          <td>
            <AccountMenu username={this.state.username} loginStatus={this.state.loginStatus} />
          </td>
          <td>
            <h1>Mafia React Client</h1>
          </td>
        </tr>
        <tr>
          <td>
          </td>
        </tr>
      </table>
    )
  }
}

export default App
