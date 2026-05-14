function factorial(n) {
    if (n === 0 || n === 1) {
        return 1;
    } else {
        return n * factorial(n - 1);
    }
}

module.exports = /*function() {
    return function(req, res, next) {
        setTimeout(() => {
            console.log('DONE');
            next();
        }, 5000);
    };
    */
function (durationInSeconds) {
    return function(req, res, next) {
        const startTime = Date.now();
        const endTime = startTime + durationInSeconds * 1000;

        while (Date.now() < endTime) {
            factorial(5000); // Adjust the parameter for higher or lower load
        }

        console.log('CPU load simulation complete.');
        return next();
    }
};
