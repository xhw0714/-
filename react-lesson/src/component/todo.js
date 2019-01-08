import React from 'react'
import {connect} from '../react-redux'
import * as actions from '../action'

class todo extends React.Component{
    handle = (e) =>{
        this.props.add(this.refs.myInput.value)
    }

    render() {
        return (
            <div>
                <input type="text" ref="myInput" />
                <button onClick={this.handle}>添加</button>
            </div>
        )
    }
}

let mapStateToProps = (state) => {
    return {
        todo:state.todo
    }
}

export default connect(mapStateToProps,actions)(todo)
