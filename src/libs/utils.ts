export class Utils {

    public static delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    public static paddingNewline(textContent: string, maxChar: number) {
        if (textContent.length <= maxChar)
            return textContent

        let newTextContent = ''
        let currentLineLength = 0
        for (let i = 0; i < textContent.length; i++) {
            newTextContent += textContent[i];
            currentLineLength++
            if (currentLineLength >= maxChar && textContent[i] === ' ') {
                newTextContent += '\n'
                currentLineLength = 0
            }
        }

        return newTextContent
    }
}
