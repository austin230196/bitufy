const fs = require("fs");
const path = require("path");

const getEnv = () => {
    const filePath = path.join(__dirname, "..", ".env");
    const content = fs.readFileSync(filePath, "utf8");
    const newContent = content.split("\n")
    newContent.forEach(k => {
        importEnv(k)
    })
}


const importEnv = env => {
    const [key, value] = env.split("=")
    return process.env[key] = value;
}



module.exports = getEnv