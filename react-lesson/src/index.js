import React from "react"
import {render} from "react-dom"
import Todo from "./component/todo"
import List from "./component/list"

class App extends React.Component{
    render(){
        return (
            <div>
                <Todo></Todo>
                <List></List>
            </div>
        )
    }
}

render(<App></App>,window.root)
