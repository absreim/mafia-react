/* High level component for contents of the game. */

import React, {Component} from "react"
import io from "socket.io-client"

class GameContent extends Component{
    constructor(props){
        super(props)
        this.state = {
            socket: null,
            socketConnected: false,
            socketConnectError: null,
            socketConnectTimeout: null,
            socketGeneralError: null,
            awaitingStatus: false,
            gameState: null,
            lobbyState: null
        }
        this.handleMainMenu = this.handleMainMenu.bind(this)
        this.connectSocket = this.connectSocket.bind(this)
    }
    componentDidMount(){
        const socket = io("http://localhost:3001/socket.io",{
            autoConnect: false,
            reconnection: false
        })
        socket.on("connection", (function(){
            this.setState({
                socketConnected: true,
                socketConnectError: null,
                socketConnectTimeout: null,
                socketGeneralError: null,
                awaitingStatus: false
            })
            socket.emit(Shared.ClientSocketEvent.STATUSREQUEST)
            this.setState({awaitingStatus: true})
        }).bind(this))
        socket.on("disconnect", (function(){
            this.setState({
                socketConnected: false,
                socketConnectError: null,
                socketConnectTimeout: null,
                socketGeneralError: null,
                awaitingStatus: false
            })
        }).bind(this))
        socket.on("connect_error", (function(error){
            this.setState({
                socketConnectError: error,
                socketConnectTimeout: null,
                socketGeneralError: null,
                awaitingStatus: false
            })
            console.log("Error encountered while trying to establish socket.io connection: " + error)
        }).bind(this))
        socket.on("connect_timeout", (function(timeout){
            this.setState({
                socketConnectError: null,
                socketConnectTimeout: timeout,
                socketGeneralError: null,
                awaitingStatus: false
            })
            console.log("Timeout reached while trying to establish socket.io connection: " + timeout)
        }).bind(this))
        socket.on("error", (function(error){
            this.setState({
                socketConnectError: null,
                socketConnectTimeout: null,
                socketGeneralError: error,
                awaitingStatus: false
            })
            console.log("Error encountered by the socket.io client: " + error)
        }).bind(this))
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
    render(){
        if(this.state.socketConnected){
            if(this.state.awaitingStatus){
                return(
                    <div>
                        <h2>Connection Established</h2>
                        <h3>Requested player status from server. Awaiting response...</h3>
                        <button onClick={this.handleMainMenu}>Return to Main Menu</button>
                    </div>
                )
            }
            else{
                
            }
        }
        else{
            if(this.state.socketConnectError){
                return(
                    <div>
                        <h2>Connect to the Game</h2>
                        <h3>Error connecting to server. You may try connecting again. If problem persists, please try again later.</h3>
                        <button onClick={this.connectSocket}>Retry Connection</button>
                        <button onClick={this.handleMainMenu}>Return to Main Menu</button>
                    </div>
                )
            }
            else if(this.state.socketConnectTimeout){
                return(
                    <div>
                        <h2>Connect to the Game</h2>
                        <h3>Attempt to connect to the server has timed out. You may try connecting again. If problem persists, please try again later.</h3>
                        <button onClick={this.connectSocket}>Retry Connection</button>
                        <button onClick={this.handleMainMenu}>Return to Main Menu</button>
                    </div>
                )
            }
            else{
                return(
                    <div>
                        <h2>Connect to the Game</h2>
                        <button onClick={this.connectSocket}>Connect</button>
                        <button onClick={this.handleMainMenu}>Return to Main Menu</button>
                    </div>
                )
            }
        }
    }
}

export default GameContent