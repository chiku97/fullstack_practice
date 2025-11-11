import app from "./index.js"
const PORT = process.env.PORT || 3001

app.listen(PORT, ()=>{
    console.log(`Your server is running at http://localhost:${PORT}`)
})