import React from "react"
import {bindActionCreators} from "./redux"

let Context = React.createContext()

class Provider extends React.Component{
    render() {
        return (
            <Context.Provider value={this.props.store}>
                {this.props.children}
            </Context.Provider>
        )
    }
}


let connect = (mapStateToProps,mapDispatchToProps) => {
    return (Component) => {
        class Proxy extends React.Component {
            state = this.props.store.getState()
            componentDidMount() {
                this.unsub = this.props.store.subscribe(()=>{
                    this.setState(this.props.store.getState())
                })
            }

            componentWillUnmount() {
                this.unsub()
            }

            render() {
                let actions
                if (typeof mapDispatchToProps === 'function') {
                    actions = mapDispatchToProps(this.props.store.dispatch)
                } else {
                    actions = bindActionCreators(mapDispatchToProps,this.props.store.dispatch)
                }

                return (
                    <Component {...mapStateToProps(this.state)} {...actions}></Component>
                )
            }
        }
        return () => {
            return (
                <Context.Consumer>
                    {(store)=> <Proxy store={store}/>}
                </Context.Consumer>
            )
        }
    }
}







export {
    Provider,
    connect
}
