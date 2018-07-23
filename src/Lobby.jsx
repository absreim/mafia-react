/*
Lobby interface for joining and creating games.
Required props:
-lobbyGames - object with game names as keys, each pointing 
to objects containing details of a game that is waiting for 
players to join, incluidng max players, number of werewolves,
and players in game
-joinGame(gameName) - function for joining the game named 
gameName
-navigateCreate() - function to navigate to the create game
interface
*/

import React, {Component} from "react"
import "./Lobby.css"

class Lobby extends Component{
    constructor(props){
        super(props)
        this.state = {
            selectedGame: null
        }
        this.handleJoin = this.handleJoin.bind(this)
        this.handleCreate = this.handleCreate.bind(this)
    }
    handleJoin(){
        if(this.state.selectedGame){
            this.props.joinGame(this.state.selectedGame)
        }
    }
    handleCreate(){
        this.props.navigateCreate()
    }
    handleClick(gameName){
        this.setState({selectedGame: gameName})
    }
    render(){
        let lobbyGameRows = null
        if(this.props.lobbyGames){
            lobbyGameRows = Object.keys(this.props.lobbyGames).map((gameName) =>
                <tr key={gameName} onClick={() => this.handleClick(gameName)} className={gameName === this.state.selectedGame ? "games-table__row--selected" : "games-table__row"}>
                    <td>{gameName}</td>
                    <td>{this.state.lobbyGames[gameName].players.size}</td>
                    <td>{this.state.lobbyGames[gameName].maxPlayers}</td>
                    <td>{this.state.lobbyGames[gameName].numWerewolves}</td>
                </tr>
        )}
        let playersInGameRows = null
        if(this.state.selectedGame && this.props.lobbyGames[this.state.selectedGame]){
            playersInGameRows = this.props.lobbyGames[this.state.selectedGame].players.map((player) =>
                <tr key={player}>
                    <td>{player}</td>
                </tr>
            )
        }
        return(
            <div>
                <h2>Games Lobby</h2>
                <table>
                    <thead>
                        <tr>
                            <td>Games in Lobby</td>
                        </tr>
                        <tr>
                            <td>Name</td>
                            <td># Players in Game</td>
                            <td>Max Players</td>
                            <td># Werewolves</td>
                        </tr>
                    </thead>
                    <tbody>{lobbyGameRows}</tbody>
                </table>
                <table>
                    <thead>
                        <tr>
                            <td>Players in Selected Game</td>
                        </tr>
                    </thead>
                    <tbody>{playersInGameRows}</tbody>
                </table>
                <button onClick={this.handleJoin} disabled={!this.state.selectedGame}>Join Game</button>
                <button onClick={this.handleCreate}>Create New Game</button>
            </div>
        )
    }
}

export default Lobby