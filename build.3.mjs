import fs from "fs"

if (fs.existsSync("./tmp")) {
  fs.mkdirSync("./tmp/public", { recursive: true })
  fs.mkdirSync("./tmp/src/pages", { recursive: true })

  fs.rmSync("./public", { recursive: true })
  fs.rmSync("./src/pages", { recursive: true })

  fs.cpSync("./tmp/public", "./public", { recursive: true })
  fs.cpSync("./tmp/src/pages", "./src/pages", { recursive: true })

  fs.rmSync("./tmp", { recursive: true })
}