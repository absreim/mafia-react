/*
Displays a single user-visible message in a
horizontal bar.
Required props:
message - the message to display
*/

import React, {Component} from "react"

class MessageBar extends Component{
    render(){
        return(
            <div><p>{this.props.message}</p></div>
        )
    }
}

export default MessageBar