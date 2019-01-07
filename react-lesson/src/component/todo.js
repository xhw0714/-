import React from 'react'

class todo extends React.Component{
    handle = (e) =>{
        console.log(this.refs.myInput.value)
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

export default todo
