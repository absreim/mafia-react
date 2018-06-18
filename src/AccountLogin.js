/* User login interface. */

import {Component} from 'react'

class AccountLogin extends Component{
    constructor(props){
        super(props)
        this.state = {username: '', password: ''}
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
    handleSubmit(){
        this.props.submitCredentials(this.state.username, this.state.password)
    }
    render(){
        return(
            <div>
                <table>
                    <tr>
                        <td>Username:</td>
                        <td><input type="text" value={this.state.username} onChange={this.handleUsernameChange} /></td>
                    </tr>
                    <tr>
                        <td>Password:</td>
                        <td><input type="password" value={this.state.password} onChange={this.handlePasswordChange} /></td>
                    </tr>
                    <tr>
                        <button onClick={this.handleSubmit}>Submit</button>
                    </tr>
                </table>
            </div>
        )
    }
}