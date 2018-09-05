/*
In game interface for playing the game.
Required props:
username - The current player's name.
gameState - A Shared.GameState containing the
state of the game.
sendMessage(message) - send a game client message
to the server. Types defined in Shared.ClientMessageType.
*/

import React, {Component} from "react"
import Shared from "./Shared"
import InGameStarted from "./InGameStarted"

class InGame extends Component{
    
    constructor(props){
        super(props)
        this.handleAck = this.handleAck.bind(this)
        this.sendSuggestion = this.sendSuggestion.bind(this)
    }
    sendAck(){
        this.props.sendMessage({type: Shared.ClientMessageType.ACKNOWLEDGE})
    }
    sendSuggestion(player){
        this.props.sendMessage({
            type: Shared.ClientMessageType.SUGGESTTARGET,
            choice: player
        })
    }
    render(){
        if(this.props.gameState){
            if(this.props.username in Object.keys(this.props.gameState.players)){
                switch(this.props.gameState.phase){
                    case Shared.Phases.STARTED:
                        if(this.props.gameState.players[this.props.username].isWerewolf){
                            const  werewolvesSet = new Set()
                            const villagersSet = new Set()
                            for(player of Object.keys(this.props.gameState.players)){
                                if(this.props.gameState.players[player].isWerewolf){
                                    werewolvesSet.add(player)
                                }
                                else{
                                    villagersSet.add(player)
                                }
                            }
                            return <InGameStarted username={this.props.username} playerIsWerewolf={true} 
                                werewolves={Array.from(werewolvesSet)} villagers={Array.from(villagersSet)} 
                                sendAck={this.sendAck} />
                        }
                        else{
                            return <InGameStarted username={this.props.username} playerIsWerewolf={false} 
                                werewolves={null} villagers={Object.keys(this.props.gameState.players)} 
                                sendAck={this.sendAck} />
                        }
                    case Shared.Phases.DAYTIME:
                        if(this.props.gameState.players[this.props.username].isWerewolf){
                            const livingWerewolvesSet = new Set()
                            const livingVillagersSet = new Set()
                            const deadWerewolvesSet = new Set()
                            const deadVillagersSet = new Set()
                            for(player of Object.keys(this.props.gameState.players)){
                                if(this.props.gameState.players[player].isAlive){
                                    if(this.props.gameState.players[player].isWerewolf){
                                        livingWerewolvesSet.add(player)
                                    }
                                    else{
                                        livingVillagersSet.add(player)
                                    }
                                }
                                else{
                                    if(this.props.gameState.players[player].isWerewolf){
                                        deadWerewolvesSet.add(player)
                                    }
                                    else{
                                        deadVillagersSet.add(player)
                                    }
                                }
                            }
                            return <InGameDaytime username={this.props.username} playerIsWerewolf={true} 
                                livingWerewolves={Array.from(livingWerewolvesSet)} livingVillagers={Array.from(livingVillagersSet)} 
                                deadWerewolves={Array.from(deadWerewolvesSet)} deadVillagers={Array.from(deadVillagersSet)} 
                                sendSuggestion={this.sendSuggestion} />
                        }
                        else{
                            const livingPlayersSet = new Set()
                            const deadPlayersSet = new Set()
                            for(player of Object.keys(this.props.gameState.players)){
                                if(this.props.gameState.players[player].isAlive){
                                    livingPlayersSet.add(player)
                                }
                                else{
                                    deadPlayersSet.add(player)
                                }
                            }
                            return <InGameDaytime username={this.props.username} playerIsWerewolf={false} 
                                livingWerewolves={null} livingVillagers={Array.from(livingPlayersSet)} 
                                deadWerewolves={null} deadVillagers={Array.from(deadPlayersSet)} 
                                sendSuggestion={this.sendSuggestion} />
                        }
                    //todo: other cases
                    default:
                        return <h2>Error: unrecognized game state data received from server.</h2>
                }
            }
            else{
                return <h2>Error: cannot find your player in the game.</h2>
            }
        }
        else{
            return <h2>No game data available to display.</h2>
        }
    }
}