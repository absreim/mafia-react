/* High level component for contents of the game. */

import React, {Component} from "react"
import io from "socket.io-client"
import Shared from "./Shared"
import Lobby from "./Lobby"
import CreateGame from "./CreateGame";

const GameContentPhase = {
    INITIAL: "initial",
    AWAITINGINITIALSTATUS: "awaitingInitialStatus",
    PREVIOUSSTATUSPAGE: "previousStatusPage",
    INLOBBY: "inLobby",
    CREATEGAME: "createGame",
    INLOBBYGAME: "inLobbyGame",
    INGAME: "inGame",
    DISCONNECTED: "disconnected"
}

class GameContent extends Component{
    constructor(props){
        super(props)
        this.state = {
            phase: GameContentPhase.INITIAL,
            socket: null,
            socketConnectError: null,
            socketConnectTimeout: null,
            socketGeneralError: null,
            gameState: null,
            lobbyState: null,
            lobbyGameState: null,
            lobbyUpdatesSubscribed: false, // protects against an unlikely race condition
            gameName: null
        }
        this.handleMainMenu = this.handleMainMenu.bind(this)
        this.connectSocket = this.connectSocket.bind(this)
        this.handleContinue = this.handleContinue.bind(this)
        this.navigateCreate = this.navigateCreate.bind(this)
        this.joinGame = this.joinGame.bind(this)
        this.leaveGame = this.leaveGame.bind(this)
        this.createGame = this.createGame.bind(this)
        this.navigateLobbyFromCreate = this.navigateLobbyFromCreate.bind(this)
    }
    componentDidMount(){
        const socket = io("http://localhost:3001/socket.io",{
            autoConnect: false,
            reconnection: false
        })
        socket.on("connection", (function(){
            this.setState({
                socketConnectError: null,
                socketConnectTimeout: null,
                socketGeneralError: null,
                gameState: null,
                lobbyState: null,
                lobbyGameState: null,
                lobbyUpdatesSubscribed: false,
                gameName: null,
                phase: GameContentPhase.AWAITINGINITIALSTATUS
            })
            socket.emit(Shared.ClientSocketEvent.STATUSREQUEST)
        }).bind(this))
        socket.on("disconnect", (function(){
            this.setState({
                socketConnectError: null,
                socketConnectTimeout: null,
                socketGeneralError: null,
                gameState: null,
                lobbyState: null,
                lobbyGameState: null,
                lobbyUpdatesSubscribed: false,
                gameName: null,
                phase: GameContentPhase.DISCONNECTED
            })
        }).bind(this))
        socket.on("connect_error", (function(error){
            this.setState({
                socketConnectError: error,
                socketConnectTimeout: null,
                socketGeneralError: null,
            })
            console.log("Error encountered while trying to establish socket.io connection: " + error)
        }).bind(this))
        socket.on("connect_timeout", (function(timeout){
            this.setState({
                socketConnectError: null,
                socketConnectTimeout: timeout,
                socketGeneralError: null
            })
            console.log("Timeout reached while trying to establish socket.io connection: " + timeout)
        }).bind(this))
        socket.on("error", (function(error){
            this.setState({
                socketConnectError: null,
                socketConnectTimeout: null,
                socketGeneralError: error
            })
            console.log("Error encountered by the socket.io client: " + error)
        }).bind(this))
        socket.on(Shared.ServerSocketEvent.STATUSREPLY, function(data){
            if(this.state.awaitingStatus){
                if(data.game){
                    this.setState({
                        gameName: data.game
                    })
                }
                else{
                    this.setState({
                        gameName: null
                    })
                }
            }
            else{
                console.log("Warning: unsolicited status update request reply messsage received from server.")
            }
        })
        socket.on(Shared.ServerSocketEvent.LOBBYSTATE, function(data){
            if(data){
                this.setState({lobbyState: data})
            }
            else{
                console.log("Warning: received no data in message about lobby state.")
            }
        })
        socket.on(Shared.ServerSocketEvent.LOBBYUPDATESSUBSCRIBED, function(){
            if(!this.state.lobbyUpdatesSubscribed){
                this.setState({lobbyUpdatesSubscribed: true})
                if(!this.state.lobbyState){
                    this.state.socket.emit(Shared.ClientSocketEvent.LOBBYSTATEREQUEST)
                }
            }
            else{
                console.log("Info: possible race condition encountered. LOBBYUPDATESSUBSCRIBED message received from server at unexpected time.")
            }
        })
        socket.on(Shared.ServerSocketEvent.LOBBYUPDATESUNSUBSCRIBED, function(){
            if(this.state.lobbyUpdatesSubscribed){
                this.setState({lobbyUpdatesSubscribed: false})
            }
            else{
                console.log("Info: possible race condition encountered. LOBBYUPDATESUNSUBSCRIBED message received from server at unexpected time.")
            }
        })
        socket.on(Shared.ServerSocketEvent.LOBBYUPDATE, function(data){
            if(this.state.lobbyUpdatesSubscribed && this.state.lobbyState){
                if(data.type === Shared.LobbyUpdate.GAMECREATED){
                    if(data.game && data.numPlayers && data.numWerewolves && data.player){
                        const newLobbyState = {}
                        for(let gameName in Object.keys(this.state.lobbyState)){
                            newLobbyState[gameName] = this.cloneLobbyGameState(this.state.lobbyState[gameName])
                        }
                        newLobbyState[data.game] = Shared.LobbyGameState(data.numPlayers, data.numWerewolves)
                        newLobbyState[data.game].players.add(data.player)
                        this.setState({lobbyState: newLobbyState})
                    }
                    else{
                        console.log("Warning: \"game created\" lobby state update received without all expected fields.")
                    }
                }
                else if(data.type === Shared.LobbyUpdate.GAMEDELETED || data.type === Shared.LobbyUpdate.GAMESTARTED){
                    if(data.game){
                        const newLobbyState = {}
                        for(let gameName in Object.keys(this.state.lobbyState)){
                            if(gameName !== data.game){
                                newLobbyState[gameName] = this.cloneLobbyGameState(this.state.lobbyState[gameName])
                            }
                        }
                        this.setState({lobbyState: newLobbyState})
                    }
                    else{
                        console.log("Warning: \"game deleted\" lobby state update received without game name.")
                    }
                }
                else if(data.type === Shared.LobbyUpdate.PLAYERJOINED){
                    if(data.game && data.player){
                        const newLobbyState = {}
                        for(let gameName in Object.keys(this.state.lobbyState)){
                            if(gameName !== data.game){
                                newLobbyState[gameName] = this.cloneLobbyGameState(this.state.lobbyState[gameName])
                            }
                        }
                        if(newLobbyState[data.game]){
                            newLobbyState[data.game].players.add(data.player)
                        }
                        else{
                            console.log("Warning: game specified in \"player joined\" lobby update does not exist.")
                        }
                        this.setState({lobbyState: newLobbyState})
                    }
                    else{
                        console.log("Warning: \"player joined\" lobby state update received without all required fields.")
                    }
                }
                else if(data.type === Shared.LobbyUpdate.PLAYERLEFT){
                    if(data.game && data.player){
                        const newLobbyState = {}
                        for(let gameName in Object.keys(this.state.lobbyState)){
                            if(gameName !== data.game){
                                newLobbyState[gameName] = this.cloneLobbyGameState(this.state.lobbyState[gameName])
                            }
                        }
                        if(newLobbyState[data.game]){
                            newLobbyState[data.game].players.delete(data.player)
                        }
                        else{
                            console.log("Warning: game specified in \"player left\" lobby update does not exist.")
                        }
                        this.setState({lobbyState: newLobbyState})
                    }
                    else{
                        console.log("Warning: \"player left\" lobby state update received without all required fields.")
                    }
                }
                else{
                    console.log("Warning: unrecognized lobby state update message type received.")
                }
            }
        })
        this.setState({socket: socket})
    }
    componentWillUnmount(){
        if(this.state.socketConnected){
            this.state.socket.close()
        }
    }
    connectSocket(){
        this.state.socket.open()
    }
    handleMainMenu(){
        this.props.handleMainMenu()
    }
    handleContinue(){
        if(this.state.gameName){ // user in game already, request copy of game state
            this.state.socket.emit(Shared.ClientSocketEvent.GAMEACTION, Shared.ClientMessageType.GAMESTATEREQ)
        }
        else{ // no previous game, send user to lobby
            this.state.socket.emit(Shared.ClientSocketEvent.SUBSCRIBELOBBYUPDATES)
            this.setState({phase: GameContentPhase.INLOBBY})
        }
    }
    navigateCreate(){
        if(this.state.phase === GameContentPhase.INLOBBY){
            this.state.socket.emit(Shared.ClientSocketEvent.UNSUBSCRIBELOBBYUPDATES)
            this.setState({lobbyState: null})
            this.setState({phase: GameContentPhase.CREATEGAME})
        }
        else{
            console.log("Warning: attempt to enter create game interface from component when not in the lobby.")
        }
    }
    navigateLobbyFromCreate(){
        if(this.state.phase === GameContentPhase.CREATEGAME){
            this.state.socket.emit(Shared.ClientSocketEvent.SUBSCRIBELOBBYUPDATES)
            this.setState({phase: GameContentPhase.INLOBBY})
        }
        else{
            console.log("Warning: function to return to lobby from create game screen called when client was not in create game screen.")
        }
    }
    createGame(name, numPlayers, numWerewolves){
        //todo
    }
    joinGame(gameName){
        //todo
    }
    leaveGame(){
        //todo
    }
    cloneLobbyGameState(gameState){
        if(gameState){
            if(gameState.maxPlayers && gameState.numWerewolves && gameState.players){
                newGameState = new Shared.LobbyGameState(gameState.maxPlayers, gameState.numWerewolves)
                for(let player of gameState.players){
                    newGameState.players.add(player)
                }
                return newGameState
            }
            else{
                console.log("Warning: asked to clone lobby game state object that was malformed.")
                return null
            }
        }
        else{
            return null
        }
    }
    render(){
        switch(this.state.phase){
            case GameContentPhase.INITIAL:
                if(this.state.socketConnectError){
                    return(
                        <div>
                            <h2>Connect to the Game</h2>
                            <h3>Error connecting to server. You may try connecting again. If problem persists, please try again later.</h3>
                            <button type="button" onClick={this.connectSocket}>Retry Connection</button>
                            <button type="button" onClick={this.handleMainMenu}>Return to Main Menu</button>
                        </div>
                    )
                }
                else if(this.state.socketConnectTimeout){
                    return(
                        <div>
                            <h2>Connect to the Game</h2>
                            <h3>Attempt to connect to the server has timed out. You may try connecting again. If problem persists, please try again later.</h3>
                            <button type="button" onClick={this.connectSocket}>Retry Connection</button>
                            <button type="button" onClick={this.handleMainMenu}>Return to Main Menu</button>
                        </div>
                    )
                }
                else{
                    return(
                        <div>
                            <h2>Connect to the Game</h2>
                            <button type="button" onClick={this.connectSocket}>Connect</button>
                            <button type="button" onClick={this.handleMainMenu}>Return to Main Menu</button>
                        </div>
                    )
                }
            case GameContentPhase.AWAITINGINITIALSTATUS:
                return(
                    <div>
                        <h2>Connection Established</h2>
                        <h3>Requested player status from server. Awaiting response...</h3>
                        <button type="button" onClick={this.handleMainMenu}>Return to Main Menu</button>
                    </div>
                )
            case GameContentPhase.PREVIOUSSTATUSPAGE:
                if(this.state.gameName){ // splash screen to inform user that they were previously in a game and will be returned to that game
                    return(
                        <div>
                            <h2>Welcome back!</h2>
                            <h3>Our records show that you were previously in the game {this.state.gameName}</h3>
                            <button type="button" onClick={this.handleContinue}>Continue</button>
                        </div>
                    )
                }
                else{
                    return(
                        <div>
                            <h2>Entering Lobby</h2>
                            <h3>It looks like you are not part of an existing game. Click the button below to enter the lobby where you can create a new game or join an existing game.</h3>
                            <button type="button" onClick={this.handleContinue}>Continue</button>
                        </div>
                    )
                }
            case GameContentPhase.INLOBBY:
                return <Lobby lobbyGames={this.state.lobbyState} navigateCreate={this.navigateCreate} joinGame={this.joinGame} />
            case GameContentPhase.CREATEGAME:
                return <CreateGame navigateLobby={this.navigateLobbyFromCreate} createGame={this.createGame} />    
            case GameContentPhase.INLOBBYGAME:
                return <LobbyGameWaiting gameName={this.state.gameName} gameState={this.state.lobbyGameState} leaveGame={this.leaveGame} />
            case GameContentPhase.DISCONNECTED:
                return(
                    <div>
                        <h2>Disconnected</h2>
                        <h3>You have been disconnected. You may attempt to reconnect. If you are unable to do so, please try again later.</h3>
                        <button type="button" onClick={this.connectSocket}>Connect</button>
                        <button type="button" onClick={this.handleMainMenu}>Return to Main Menu</button>
                    </div>
                )
            default:
                return(
                    <div>
                        <h2>Error</h2>
                        <h3>Internal error with the client application. Please try again later.</h3>
                    </div>
                )
        }
    }
}

export default GameContent