export const parseNumber6 = (val) => {
    if (val == 0) {
        return 0
    }
    const temp = (+val).toFixed(8) + ''
    const split = temp.split('.')
    if (split.length === 2 && split[1].length >= 7) {
        const result = +temp.substring(0, split[0].length+7)
        console.log(`---${val}-${result}--`)
        return result
    }
    return +temp
}
export const parseNumber4 = (val) => {
    if (val == 0) {
        return 0
    }
    const temp = val.toFixed(5)
    const split = temp.split('.')
    if (split.length === 2 && split[1].length === 5) {
        return temp.substring(0, temp.length - 1)
    }
    return temp
}
