const fs = require('fs');

console.log(fs.existsSync('C:\\Users'));

console.log('started');

class Test {
    public start() {
        console.log('started');
    }
}

new Test().start();
