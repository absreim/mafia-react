/* Account creation interface. */

import {Component} from "react"

class AccountCreation extends Component {
    constructor(props){
        super(props)
        this.state = {
            username: "",
            password: "",
            confirm: ""
        }
        this.handleUsernameChange = this.handleUsernameChange.bind(this)
        this.handlePasswordChange = this.handleUsernameChange.bind(this)
        this.handleConfirmChange = this.handleConfirmChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    handleUsernameChange(event){
        this.setState({username: event.target.value})
    }
    handlePasswordChange(event){
        this.setState({password: event.target.value})
    }
    handleConfirmChange(event){
        this.setState({confirm: event.target.value})
    }
    handleSubmit(event){
        // defer credential validation to component above
        this.props.submitCrendentials(this.state.username, this.state.password, this.state.confirm)
        event.preventDefault()
    }
    render(){
        return(
            <form onSubmit={this.handleSubmit}>
                <label for="username">Username:</label>
                <input type="text" id="username" value={this.state.username} onChange={this.handleUsernameChange} />
                <label for="password">Password</label>
                <input type="text" id="password" value={this.state.password} onChange={this.handlePasswordChange} />
                <label for="confirm">Confirm Password</label>
                <input type="text" id="confirm" value={this.state.confirm} onChange={this.handleConfirmChange} />
                <input type="submit" value="Submit" />
            </form>
        )
    }
}