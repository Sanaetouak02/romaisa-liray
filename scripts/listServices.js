const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main(){
  try{
    const services = await prisma.service.findMany()
    console.log('services count', services.length)
    console.log(services.map(s => ({ number: s.number, title: s.title })))
  }catch(e){
    console.error(e)
  }finally{
    await prisma.$disconnect()
  }
}

main()
