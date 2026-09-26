import PlaceholderImage, { VARIANTS } from "./PlaceholderImage"

export default function ProjectThumb({ project, className = "", rounded = "rounded-3xl" }) {
  if (!project.image) {
    return (
      <PlaceholderImage
        tag={project.tag}
        variant={project.variant}
        className={className}
        rounded={rounded}
      />
    )
  }

  const isCover = project.imageFit === "cover"

  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br ${VARIANTS[project.variant] ?? VARIANTS.duo} ${rounded} ${className}`}
    >
      <img
        src={project.image}
        alt={project.title}
        className={`absolute inset-0 h-full w-full ${isCover ? "object-cover" : "object-contain p-4"}`}
      />
    </div>
  )
}
