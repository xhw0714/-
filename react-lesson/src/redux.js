let createStore = (reducer) => {
    let state = {}
    let listener = []
    let getState = () => state
    let dispath = (action) => {
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
        dispath,
        subscribe
    }
}

export default {
    createStore
}
