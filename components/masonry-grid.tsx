"use client"

import type { ReactNode } from "react"

interface MasonryGridProps {
  children: ReactNode
  columns?: number
}

export function MasonryGrid({ children, columns = 3 }: MasonryGridProps) {
  return (
    <div
      className="grid gap-4"
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gridAutoRows: "min-content",
      }}
    >
      {children}
    </div>
  )
}
