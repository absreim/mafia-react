/*
Top level user account management interface.
Required props:
- username - username string of currently
logged in user
- changePwdRedirect - function to redirect user
to change password interface
- deleteRedirect - function to redirect user to
delete account interface
*/

import {Component} from "react"
import "./AccountManage.css"

class AccountManage extends Component{
    constructor(props){
        super(props)
        this.handleChangePwd = this.handleChangePwd.bind(this)
        this.handleDelete = this.handleDelete.bind(this)
    }
    handleChangePwd(event){
        this.props.changePwdRedirect()
    }
    handleDelete(event){
        this.props.deleteRedirect()
    }
    render(){
        return(
            <div>
                <h2>Manage your account</h2>
                <p>You are logged in as <span className="external-info">{this.props.username}</span></p>
                <button onClick={this.handleChangePwd}>Change Password</button>
                <button onClick={this.handleDelete}>Delete Account</button>
            </div>
        )
    }
}