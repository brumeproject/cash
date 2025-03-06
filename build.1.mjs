import fs from "fs"

fs.mkdirSync("./tmp/public", { recursive: true })
fs.mkdirSync("./tmp/src/pages", { recursive: true })

fs.mkdirSync("./public", { recursive: true })
fs.mkdirSync("./src/pages", { recursive: true })

fs.cpSync("./public", "./tmp/public", { recursive: true })
fs.cpSync("./src/pages", "./tmp/src/pages", { recursive: true })

fs.rmSync("./src/pages/api", { recursive: true, force: true })