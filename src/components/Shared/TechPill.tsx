interface TechPillProps {
  label: string
}

function TechPill({ label }: TechPillProps) {
  return (
    <span className="inline-flex rounded-full bg-teal-300/10 px-3 py-1 text-xs font-medium text-teal-300">
      {label}
    </span>
  )
}

export default TechPill
