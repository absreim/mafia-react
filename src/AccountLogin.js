/* User login interface. */

import {Component} from "react"

class AccountLogin extends Component{
    constructor(props){
        super(props)
        this.state = {username: "", password: ""}
        this.handleUsernameChange = this.handleUsernameChange.bind(this)
        this.handlePasswordChange = this.handlePasswordChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    handleUsernameChange(event){
        this.setState({username: event.target.value})
    }
    handlePasswordChange(event){
        this.setState({password: event.target.value})
    }
    handleSubmit(event){
        this.props.submitCredentials(this.state.username, this.state.password)
        event.preventDefault()
    }
    render(){
        return(
            <form onSubmit={this.handleSubmit}>
                <label for="username">Username:</label>
                <input type="text" id="username" value={this.state.username} onChange={this.handleUsernameChange} />
                <label for="password">Password</label>
                <input type="text" id="password" value={this.state.password} onChange={this.handlePasswordChange} />
                <input type="submit" value="Submit" />
            </form>
        )
    }
}