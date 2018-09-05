/*
Component for in game "daytime" phase.
Required props:
username - the name of the player
playerIsWerewolf - boolean value indicating whether the player is a werewolf
livingWerewolves - array of living werewolves. Only applicable if the player is a werewolf
livingVillagers - array of living villagers
deadWerewolves - array of dead werewolves. Only applicable if the player is a werewolf
deadVillagers - array of dead villagers
sendSuggestion - function to send suggestion to server
*/

import React, {Component} from "react"
import "./InGameDaytime.css"

class InGameDaytime extends Component{
    constructor(props){
        super(props)
        this.state = {
            selectedPlayer: null
        }
        this.handleSuggest = this.handleSuggest.bind(this)
    }
    handleClickPlayer(player){
        this.setState({selectedPlayer: player})
    }
    handleSuggest(player){
        this.props.sendSuggestion(player)
    }
    render(){
        <p>Waiting for a player to suggest a target for execution.</p>
        if(this.props.playerIsWerewolf){
            const livingVillagersRows = this.props.livingVillagers.map(
                (player) => {
                    <tr key={player} onClick={() => this.handleClickPlayer(player)}
                        className={player === this.state.selectedPlayer ? "player-list__row--selected" : "player-list__row"}>
                        <td>{player}</td>
                    </tr>
                }
            )
            const deadVillagersRows = this.props.deadVillagers.map(
                (player) => {
                    <tr key={player}
                        className="player-list__row">
                        <td>{player}</td>
                    </tr>
                }
            )
            const livingWerewolvesRows = this.props.livingWerewolves.map(
                (player) => {
                    <tr key={player} onClick={() => this.handleClickPlayer(player)}
                        className={player === this.state.selectedPlayer ? "player-list__row--selected" : "player-list__row"}>
                        <td>{player}</td>
                    </tr>
                }
            )
            const deadWerewolvesRows = this.props.deadWerewolves.map(
                (player) => {
                    <tr key={player}
                        className="player-list__row">
                        <td>{player}</td>
                    </tr>
                }
            )
            if(this.props.username in this.props.livingWerewolves){
                return (
                    <div>
                        <h2>It is the daytime.</h2>
                        <p>You are a werewolf and you are alive.</p>
                        <p>In this phase, someone must suggest a living player to execute. First come first serve.</p>
                        <table>
                            <caption>List of living villagers.</caption>
                            <thead>
                                <th>Living Villagers</th>
                            </thead>
                            <tbody>{livingVillagersRows}</tbody>
                        </table>
                        <table>
                            <caption>List of living werewolves.</caption>
                            <thead>
                                <th>Living Werewolves</th>
                            </thead>
                            <tbody>{livingWerewolvesRows}</tbody>
                        </table>
                        <table>
                            <caption>List of dead villagers.</caption>
                            <thead>
                                <th>Dead Villagers</th>
                            </thead>
                            <tbody>{deadVillagersRows}</tbody>
                        </table>
                        <table>
                            <caption>List of dead werewolves.</caption>
                            <thead>
                                <th>Dead Werewolves</th>
                            </thead>
                            <tbody>{deadWerewolvesRows}</tbody>
                        </table>
                        <p>Waiting for a player to suggest a target for execution.
                            You may suggest a target yourself by selecting a player and clicking "Suggest".</p>
                        <button onClick={this.handleSuggest(this.state.selectedPlayer)} 
                            disabled={!this.state.selectedPlayer}>Suggest</button>
                    </div>
                )
            }
            else{
                return (
                    <div>
                        <h2>It is the daytime.</h2>
                        <p>You are a werewolf and you are dead.</p>
                        <p>In this phase, someone must suggest a living player to execute. First come first serve.</p>
                        <table>
                            <caption>List of living players.</caption>
                            <thead>
                                <th>Living Players</th>
                            </thead>
                            <tbody>{livingPlayersRows}</tbody>
                        </table>
                        <table>
                            <caption>List of dead players.</caption>
                            <thead>
                                <th>Dead Players</th>
                            </thead>
                            <tbody>{deadPlayersRows}</tbody>
                        </table>
                        <p>Waiting for a player to suggest a target for execution. Since you are dead, you
                            cannot make a suggestion.</p>
                    </div>
                )
            }
        }
        else{
            const livingPlayersRows = this.props.livingVillagers.map(
                (player) => {
                    <tr key={player} onClick={() => this.handleClickPlayer(player)}
                        className={player === this.state.selectedPlayer ? "player-list__row--selected" : "player-list__row"}>
                        <td>{player}</td>
                    </tr>
                }
            )
            const deadPlayersRows = this.props.deadVillagers.map(
                (player) => {
                    <tr key={player}
                        className="player-list__row">
                        <td>{player}</td>
                    </tr>
                }
            )
            if(this.props.username in this.props.livingVillagers){
                return (
                    <div>
                        <h2>It is the daytime.</h2>
                        <p>You are a villager and you are alive.</p>
                        <p>In this phase, someone must suggest a living player to execute. First come first serve.</p>
                        <table>
                            <caption>List of living players.</caption>
                            <thead>
                                <th>Living Players</th>
                            </thead>
                            <tbody>{livingPlayersRows}</tbody>
                        </table>
                        <table>
                            <caption>List of dead players.</caption>
                            <thead>
                                <th>Dead Players</th>
                            </thead>
                            <tbody>{deadPlayersRows}</tbody>
                        </table>
                        <p>Waiting for a player to suggest a target for execution.
                            You may suggest a target yourself by selecting a player and clicking "Suggest".</p>
                        <button onClick={this.handleSuggest(this.state.selectedPlayer)} 
                            disabled={!this.state.selectedPlayer}>Suggest</button>
                    </div>
                )
            }
            else{
                return (
                    <div>
                        <h2>It is the daytime.</h2>
                        <p>You are a villager and you are dead.</p>
                        <p>In this phase, someone must suggest a living player to execute. First come first serve.</p>
                        <table>
                            <caption>List of living players.</caption>
                            <thead>
                                <th>Living Players</th>
                            </thead>
                            <tbody>{livingPlayersRows}</tbody>
                        </table>
                        <table>
                            <caption>List of dead players.</caption>
                            <thead>
                                <th>Dead Players</th>
                            </thead>
                            <tbody>{deadPlayersRows}</tbody>
                        </table>
                        <p>Waiting for a player to suggest a target for execution. Since you are dead, you
                            cannot make a suggestion.</p>
                    </div>
                )
            }
        }
    }
}