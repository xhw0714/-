import React from "react"
import {render} from "react-dom"
import Todo from "./component/todo"
import List from "./component/list"
import {Provider} from "./react-redux"
import store from './store'

class App extends React.Component{
    render(){
        return (
            <Provider store={store}>
                <div>
                    <Todo></Todo>
                    <List></List>
                </div>
            </Provider>
        )
    }
}



render(<App></App>,window.root)
