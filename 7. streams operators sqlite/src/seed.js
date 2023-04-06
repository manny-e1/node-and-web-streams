import sqlite3 from 'sqlite3'
import { faker } from '@faker-js/faker'
import {promisify} from 'node:util'
import { log } from 'node:console'

const Connection = sqlite3.verbose()
const db = new Connection.Database('./data/db')

 const seriliazeAsync = promisify(db.serialize.bind(db))
 const runAsync = promisify(db.run.bind(db))

console.time('db-insert')
await seriliazeAsync

//await runAsync('CREATE TABLE users (id TEXT, name TEXT, age NUMBER, company TEXT)')

function generateUser() {
    const user = {
        id: faker.datatype.uuid(),
        name: faker.internet.userName(),
        age: faker.datatype.number({min:18,max:60}),
        company: faker.company.name()
    }
    return [user.id,user.name,user.age,user.company]
}
const promises = []
for (let i = 0; i < 1000; i++){
    const user = generateUser()
    promises.push(runAsync(`INSERT INTO users (id,name,age,company) VALUES(?,?,?,?)`,user))
}

await Promise.all(promises)
log("finished inserting data", promises.length, "item")

db.all("SELECT COUNT(rowid) as counter FROM users",(err,row)=>{
    if (err){
        console.error(err)
        return
    }
    log(row)
    
    console.timeEnd('db-insert')
})
