import {Component} from "react"

class ChangePassword extends Component{
    constructor(props){
        super(props)
        this.state = {
            old: "",
            new: ""
        }
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
                    <span className="external-info">{this.state.username}</span></p>
                <label for="old">Current password:</label>
                <input type="password" value={this.state.old} onChange={this.handleOldChange} />
                <label for="new">New password:</label>
                <input type="password" value={this.state.new} onChange={this.handleNewChange} />
            </form>
        )
    }
}