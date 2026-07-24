const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main(){
  const adminCount = await prisma.adminUser.count();
  const phoneCount = await prisma.phoneNumber.count();
  const projectCount = await prisma.project.count();
  const referenceCount = await prisma.reference.count();
  console.log('adminCount', adminCount);
  console.log('phoneCount', phoneCount);
  console.log('projectCount', projectCount);
  console.log('referenceCount', referenceCount);
  await prisma.$disconnect();
}

main().catch(e=>{console.error(e);process.exit(1)});
