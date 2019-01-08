export let add = (todo) => {
    return {type:'add', todo}
}

export let remove = (index) => {
    return {type:'remove', index}
}
