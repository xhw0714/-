import React from "react"
import {connect} from "../react-redux";
import * as actions from "../action";

class list extends React.Component {
    render() {
        let list = this.props.todo || []
        return (
            <ul>
                {list.map((e,i) => {
                    return <li key={i}>{e}</li>
                })}
            </ul>
        )
    }
}
let mapStateToProps = (state) => {
    return {
        todo:state.todo
    }
}


export default connect(mapStateToProps,actions)(list)
