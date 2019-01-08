let createStore = (reducer) => {
    let state = {}
    let listener = []
    let getState = () => state
    let dispatch = (action) => {
        state = reducer(state, action)
        listener.forEach(fn => fn())
    }
    let subscribe = (fn) => {
        listener.push(fn)
        return () => {
            listener = listener.filter(e => e !== fn)
        }
    }
    return {
        getState,
        dispatch,
        subscribe
    }
}

let combineReducers = (reducers) => {
    return (state = {}, action) => {
         for (let key in reducers) {
             state[key] = reducers[key](state[key], action)
         }
         return state
    }
}

let bindActionCreators = (actions, dispatch) => {
    let obj = {}
    for (let key in actions) {
        obj[key] = (val) => dispatch(actions[key](val))
    }
    return obj
}

export {
    createStore,
    combineReducers,
    bindActionCreators
}
