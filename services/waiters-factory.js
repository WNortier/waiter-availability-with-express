module.exports = function WaiterFactory(pool) {

    function helloWorld() {
        return "Hello World!"
    }

    return {
        helloWorld
    }
}