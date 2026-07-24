export default function FeatureBlock({
  icon,
  title,
  text,
}: {
  icon: string
  title: string
  text: string
}) {
  return (
    <div className="card flex flex-col gap-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white">{icon}</div>
      <div>
        <h3 className="text-xl font-semibold text-darkGray">{title}</h3>
        <p className="mt-3 text-sm leading-7 text-gray-600">{text}</p>
      </div>
    </div>
  )
}
