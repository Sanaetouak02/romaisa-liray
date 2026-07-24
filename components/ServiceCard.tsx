import Image from 'next/image'

export default function ServiceCard({
  icon,
  title,
  description,
}: {
  icon: string
  title: string
  description: string
}) {
  return (
    <div className="card flex flex-col gap-5">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary">
        <Image src={icon} alt={title} width={40} height={40} />
      </div>
      <div>
        <h3 className="text-xl font-bold text-darkGray">{title}</h3>
        <p className="mt-3 text-sm leading-7 text-gray-600">{description}</p>
      </div>
    </div>
  )
}
