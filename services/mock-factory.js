module.exports = function MockFactory(pool) {

    function helloWorld() {
        try {
            return "Hello World!"
        } catch (err) {
            next(err);
        }
    }

    return {
        helloWorld
    }
}