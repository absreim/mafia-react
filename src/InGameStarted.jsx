/*
Component for in game "started" phase.
Required props:
username - the name of the player
playerIsWerewolf - boolean value indicating whether the player is a werewolf
werewolves - array of werewolves. Only applicable if player is a werewolf.
villagers - array of villagers. If the player is not a werewolf, everyone is
considered a villager.
sendAck - function for sending acknowledgment that player is ready.
*/

import React, {Component} from "react"
// todo: highlighting for acknowledgements already received
class InGameStarted extends Component{
    constructor(props){
        super(props)
        this.handleReady = this.handleReady.bind(this)
    }
    handleReady(){
        this.props.sendAck()
    }
    render(){
        if(this.props.playerIsWerewolf){
            let werewolfRows = this.props.werewolves.map((werewolf) => {
                <tr key={werewolf}>
                    <td>{werewolf}</td>
                </tr>
            })
            let villagerRows = this.props.villagers.map((villager) => {
                <tr key={villager}>
                    <td>{villager}</td>
                </tr>
            })
            return (
                <div>
                    <h2>The game has started!</h2>
                    <p>You are a werewolf.</p>
                    <p>Take note of the lists of werewolves and villagers and 
                        click the "Ready" button to continue.</p>
                    <table>
                        <caption>List of werewolves.</caption>
                        <thead>
                            <tr>
                                <th>Werewolves</th>
                            </tr>
                        </thead>
                        <tbody>{werewolfRows}</tbody>
                    </table>
                    <table>
                        <caption>List of villagers.</caption>
                        <thead>
                            <tr>
                                <th>Villagers</th>
                            </tr>
                        </thead>
                        <tbody>{villagerRows}</tbody>
                    </table>
                    <button onClick={this.handleReady}>Ready</button>
                </div>
            )
        }
        else{
            let playerRows = this.props.villagers.map(
                (player) => {
                    <tr key={player}>
                        <td>{player}</td>
                    </tr>
                }
            )
            return (
                <div>
                    <h2>The game has started!</h2>
                    <p>You are a villager.</p>
                    <p>Take note of the list of players and click the "Ready" button to continue.</p>
                    <table>
                        <caption>List of players.</caption>
                        <thead>
                            <tr>
                                <th>Players</th>
                            </tr>
                        </thead>
                        <tbody>{playerRows}</tbody>
                    </table>
                    <button onClick={this.handleReady}>Ready</button>
                </div>
            )
        }
    }   
}