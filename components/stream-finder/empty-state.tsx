import { Search, Film } from "lucide-react"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  type: "no-search" | "no-results" | "no-availability"
  query?: string
  className?: string
}

export function EmptyState({ type, query, className }: EmptyStateProps) {
  const content = {
    "no-search": {
      icon: Search,
      title: "Start your search",
      description: "Type a movie or TV show name to find where to watch it",
    },
    "no-results": {
      icon: Film,
      title: "No results found",
      description: query
        ? `We couldn't find anything matching "${query}"`
        : "Try searching for something else",
    },
    "no-availability": {
      icon: Film,
      title: "No availability in this region",
      description: "This title may not be available for streaming in your selected country",
    },
  }

  const { icon: Icon, title, description } = content[type]

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-4 text-center",
        className
      )}
    >
      <div className="bg-secondary/50 rounded-full p-6 mb-6">
        <Icon className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-md">{description}</p>
    </div>
  )
}
