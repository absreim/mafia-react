/*
Game creation interface.
Required props:
*/

import React, {Component} from "react"

class CreateGame extends Component{
    constructor(props){

    }
    render(){
        <form onSubmit={this.handleSubmit}>
            <h2>Create a New Game</h2>
            <button type="button" onClick={this.handleLobby}>Return to Lobby</button>
            <button type="submit">Create</button>
        </form>
    }
}

export default CreateGame