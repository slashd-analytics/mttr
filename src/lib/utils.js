

export const random = (_min, _max) => {

    let min = _max ? _min : 0
    let max = _max ? _max : _min

    let v = Math.random() * (max-min) + min

    return v
}


export const int = n => Number.parseInt(n)


export const map = (x, a1, a2, b1, b2) => {
    return ((x - a1) / (a2 - a1)) * (b2 - b1) + b1
}