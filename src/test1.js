const arr = {
    a: 1,
    b: 2,
    c: 3,
}

const { a, ...narr } = { ...arr };

console.log(narr);

const myObject = { ircEvent: "PRIVMSG", method: "newURI", regex: "^http://.*" };
const { regex, ...newObject } = myObject;
console.log(newObject);