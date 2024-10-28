const http=require('http')
const axios=require('axios')
const uri='https://jsonplaceholder.typicode.com/users'

const fetchFunc=async()=>{
    let link=axios.get(uri)
    link.then(res=>{
        console.log(res)
    })
}

fetchFunc();