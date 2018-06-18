/* Drop down menu that provides links to account management functions
 with icon indicating login status. */

import { Component } from 'react';
import './AccountMenu.css';
import Shared from './Shared.js';

class AccountMenu extends Component{
    constructor(props){
        super(props)
        this.state = {menuVisible: false}
        this.handleLogin = this.handleLogin.bind(this)
        this.handleLogout = this.handleLogout.bind(this)
        this.handleManage = this.handleManage.bind(this)
        this.toggleMenu = this.toggleMenu.bind(this)
    }
    handleLogin(){
        this.props.handleLogin()
    }
    handleLogout(){
        this.props.handleLogout()
    }
    handleManage(){
        this.props.handleManage()
    }
    toggleMenu(){
        this.setState((prevState) => {
            menuVisible: !prevState.menuVisible
        })
    }
    render(){
        if(props.loginStatus == Shared.LoginState.LOGGEDIN && props.username){
            var dropdownClass = "dropdown-content"
            if(this.state.menuVisible){
                dropdownClass += " show"
            }
            return (
                <div>
                    <button onClick={this.toggleMenu}>{this.props.username}</button>
                    <div className={dropdownClass}>
                        <a onClick={this.handleLogout}>Log Out</a>
                        <a onClick={this.handleManage}>Manage Account</a>
                    </div>
                </div>
            )
        }
        else{
            return(
                <div>
                    <button onClick={this.handleLogin}>Log In</button>
                </div>
            )
        }
    }
}

export default AccountMenu