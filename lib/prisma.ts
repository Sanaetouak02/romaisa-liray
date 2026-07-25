import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

function createSafeWrapper<T extends object>(obj: T): T {
  const handler: ProxyHandler<any> = {
    get(target, prop) {
      const value = Reflect.get(target, prop)
      if (typeof value === 'function') {
        return (...args: any[]) => {
          try {
            const res = value.apply(target, args)
            if (res && typeof res.then === 'function') {
              return res.catch((err: any) => {
                // Log the error and return sensible defaults for common read methods
                // eslint-disable-next-line no-console
                console.error(`Prisma error (caught) on ${String(prop)}:`, err)
                if (String(prop) === 'findMany') return []
                if (String(prop) === 'findFirst' || String(prop) === 'findUnique') return null
                if (String(prop) === 'count') return 0
                return null
              })
            }
            return res
          } catch (err) {
            // eslint-disable-next-line no-console
            console.error(`Prisma sync error (caught) on ${String(prop)}:`, err)
            return null
          }
        }
      }
      if (value && typeof value === 'object') {
        return new Proxy(value, handler)
      }
      return value
    }
  }
  return new Proxy(obj, handler)
}

const rawPrisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = rawPrisma
}

const prisma = createSafeWrapper(rawPrisma)

export default prisma
