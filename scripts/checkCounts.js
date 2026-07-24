const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main(){
  try{
    try{ console.log('services', await prisma.service.count()) }catch(e){ console.log('services error', e.code || e.message) }
    try{ console.log('projects', await prisma.project.count()) }catch(e){ console.log('projects error', e.code || e.message) }
    try{ console.log('references', await prisma.reference.count()) }catch(e){ console.log('references error', e.code || e.message) }
    try{ console.log('clients', await prisma.client.count()) }catch(e){ console.log('clients error', e.code || e.message) }
    try{ console.log('phones', await prisma.phoneNumber.count()) }catch(e){ console.log('phones error', e.code || e.message) }
  }catch(e){
    console.error('unexpected', e)
  }finally{
    await prisma.$disconnect()
  }
}

main()
