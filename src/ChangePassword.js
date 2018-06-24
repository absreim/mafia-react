/*
Password change interface for existing accounts.
Required props:
submitPasswords(oldPassword, new Password) - submits old and
new passwords to attempt a change
username - the name of the account for which a password change
is being made
*/

import React,{Component} from "react"
import "./ChangePassword.css"

class ChangePassword extends Component{
    constructor(props){
        super(props)
        this.state = {
            old: "",
            new: ""
        }
        this.handleOldChange = this.handleOldChange.bind(this)
        this.handleNewChange = this.handleNewChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    handleOldChange(event){
        this.setState({old: event.target.value})
    }
    handleNewChange(event){
        this.setState({new: event.target.value})
    }
    handleSubmit(event){
        this.props.submitPasswords(this.state.old, this.state.new)
        event.preventDefault()
    }
    render(){
        return(
            <form onSubmit={this.handleSubmit}>
                <h2>Change your password</h2>
                <p>Enter your existing password to change the password for the account 
                    <span className="external-info">{this.props.username}</span></p>
                <label for="old">Current password:</label>
                <input type="password" value={this.state.old} onChange={this.handleOldChange} />
                <label for="new">New password:</label>
                <input type="password" value={this.state.new} onChange={this.handleNewChange} />
            </form>
        )
    }
}

export default ChangePassword