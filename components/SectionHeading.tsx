export default function SectionHeading({ title }: { title: string }) {
  return (
    <div className="mb-8 flex items-center gap-3">
      <div className="h-0.5 w-16 bg-primary" />
      <h2 className="text-3xl font-extrabold uppercase tracking-[0.12em] text-darkGray sm:text-4xl">{title}</h2>
    </div>
  )
}
