import {combineReducers} from './redux'

let todo = (state = [], action) => {
    switch (action.type) {
        case 'add':
            return [action.todo, ...state]
        default:
            return state
    }
}

export default combineReducers({
    todo
})
