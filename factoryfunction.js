module.exports = function mockFactory() {

    var theGreeting = ""

    function greet(name) {
        theGreeting = "Hello " + name
        return theGreeting
    }

    function getGreet() {
        return theGreeting
    }
    
        return {
        greet,
        getGreet
    }
}