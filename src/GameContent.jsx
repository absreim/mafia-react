/* High level component for contents of the game. */

import React, {Component} from "react"

class GameContent extends Component{
    constructor(props){
        super(props)
        this.handleMainMenu = this.handleMainMenu.bind(this)
    }
    handleMainMenu(){
        this.props.handleMainMenu()
    }
    render(){
        return(
            <div>
                <h2>Coming soon!</h2>
                <button onClick={this.handleMainMenu}>Main Menu</button>
            </div>
        )
    }
}

export default GameContent