/*
Game creation interface.
Required props:
navigateLobby() - function to return to the lobby
createGame(name, numPlayers, numWerewolves) - function to create game
with numPlayers total players and numWerewolves werewolves
*/

import React, {Component} from "react"

class CreateGame extends Component{
    constructor(props){
        super(props)
        this.state = {
            name: "",
            numPlayers: 9,
            numWerewolves: 2
        }
        this.handleNameChange = this.handleNameChange.bind(this)
        this.handleNumPlayersChange = this.handleNumPlayersChange.bind(this)
        this.handleNumWerewolvesChange = this.handleNumWerewolvesChange.bind(this)
        this.handleLobby = this.handleLobby.bind(this)
    }
    handleNameChange(event){
        this.setState({name: event.target.value})
    }
    handleNumPlayersChange(event){
        this.setState({numPlayers: event.target.value})
    }
    handleNumWerewolvesChange(event){
        this.setState({numWerewolves: event.target.value})
    }
    handleLobby(){
        this.props.navigateLobby()
    }
    getWerewolfHelpText(){
        if(this.state.numPlayers){
            let maxWerewolves = Math.floor(numPlayers / 3)
            if(maxWerewolves * 2 === numPlayers){
                maxWerewolves--
            }
            let recommended = Math.round(Math.sqrt(numPlayers))
            if(recommended > maxWerewolves){
                recommended = maxWerewolves
            }
            return ` (maximum: {maxWerewolves} recommended: {recommended})`
        }
        else{
            return ""
        }
    }
    handleSubmit(event){
        event.preventDefault()
        this.props.createGame(this.state.name, this.state.numPlayers, this.state.numWerewolves)
    }
    render(){
        <form onSubmit={this.handleSubmit}>
            <h2>Create a New Game</h2>
            <label htmlFor="name">Name</label>
            <input id="name" type="text" value={this.state.name} onChange={this.handleNameChange} />
            <label htmlFor="numPlayers">Number of Players (minimum 4)</label>
            <input id="numPlayers" type="number" value={this.state.numPlayers} onChange={this.handleNumPlayersChange} />
            <label htmlFor="numWerewolves">Number of Werewolves{getWerewolfHelpText()}</label>
            <input id="numWerewolves" type="number" value={this.state.numWerewolves} onChange={this.handleNumWerewolvesChange} />
            <button type="button" onClick={this.handleLobby}>Return to Lobby</button>
            <button type="submit">Create</button>
        </form>
    }
}

export default CreateGame