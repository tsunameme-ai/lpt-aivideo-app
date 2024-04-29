
export function preventEventDefault(e: any) {
    // console.log(e.evt)
    try {
        e.evt.preventDefault()
    }
    catch (error: any) {
        // console.log(error)
    }
}

