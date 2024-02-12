import '@testing-library/jest-dom'
describe('<dumb> unit', () => {
    test('renders', () => {
        // const a = 1 + 2
        // expect(a).toEqual(3)
        const text = 'hello world\nOnce upon a time'
        console.log(text)
        const words = text.split('\n')
        console.log('???split')
        console.log(words)
    });
});