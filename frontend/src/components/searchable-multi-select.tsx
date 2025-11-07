import { useEffect, useMemo, useRef, useState } from "react"
import { Search, Check } from "lucide-react"
import { SelectOption } from "@/data/select-options"
import { cn } from "@/lib/utils"

interface SearchableMultiSelectProps {
  name: string
  values: string[]
  onChange: (values: string[]) => void
  options: SelectOption[]
  placeholder?: string
  helperText?: string
  emptyText?: string
  disabled?: boolean
}

export function SearchableMultiSelect({
  name,
  values,
  onChange,
  options,
  placeholder = "Select options",
  helperText,
  emptyText = "No matches found",
  disabled = false,
}: SearchableMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")
  const containerRef = useRef<HTMLDivElement | null>(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null)

  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options
    const query = search.toLowerCase()
    return options.filter((option) =>
      option.label.toLowerCase().includes(query) || option.value.toLowerCase().includes(query) || option.meta?.toLowerCase().includes(query)
    )
  }, [options, search])

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (!containerRef.current) return
      if (containerRef.current.contains(event.target as Node)) return
      setIsOpen(false)
      setSearch("")
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick)
    }

    return () => document.removeEventListener("mousedown", handleOutsideClick)
  }, [isOpen])

  const toggleValue = (value: string) => {
    if (values.includes(value)) {
      onChange(values.filter((selected) => selected !== value))
    } else {
      onChange([...values, value])
    }
  }

  const selectedLabels = useMemo(() => {
    if (values.length === 0) return placeholder
    if (values.length === 1) {
      const option = options.find((opt) => opt.value === values[0])
      return option?.label ?? placeholder
    }
    return `${values.length} selected`
  }, [values, options, placeholder])

  return (
    <div ref={containerRef} className="relative">
      <input type="hidden" name={name} value={values.join(",")} />
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((previous) => !previous)}
        className={cn(
          "flex w-full items-center justify-between rounded-lg border border-border bg-background px-4 py-2 text-left text-sm transition-colors",
          disabled ? "cursor-not-allowed opacity-60" : "hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
        )}
      >
        <span className={cn("truncate", values.length === 0 && "text-muted-foreground")}>{selectedLabels}</span>
        <svg
          aria-hidden="true"
          className={cn("ml-2 h-4 w-4 transition-transform", isOpen ? "rotate-180" : "rotate-0")}
          fill="none"
          height="24"
          viewBox="0 0 24 24"
          width="24"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {helperText && <p className="mt-2 text-xs text-muted-foreground">{helperText}</p>}

      {isOpen && (
        <div className="absolute z-50 mt-2 w-full rounded-lg border border-border bg-card shadow-xl">
          <div className="flex items-center gap-2 border-b border-border px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              autoFocus
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <div className="max-h-64 overflow-y-auto py-2">
            {filteredOptions.length === 0 ? (
              <p className="px-4 py-2 text-sm text-muted-foreground">{emptyText}</p>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = values.includes(option.value)
                return (
                  <button
                    type="button"
                    key={option.value}
                    onClick={() => toggleValue(option.value)}
                    className={cn(
                      "flex w-full items-center gap-2 px-4 py-2 text-left text-sm transition-colors",
                      isSelected ? "bg-primary/10 text-primary" : "hover:bg-muted"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-4 w-4 items-center justify-center rounded border",
                        isSelected ? "border-primary bg-primary text-primary-foreground" : "border-border"
                      )}
                    >
                      {isSelected && <Check size={12} />}
                    </span>
                    <div className="flex flex-col">
                      <span>{option.label}</span>
                      {option.meta && <span className="text-xs text-muted-foreground">{option.meta}</span>}
                    </div>
                  </button>
                )
              })
            )}
          </div>
          <div className="flex items-center justify-between border-t border-border px-4 py-2 text-xs text-muted-foreground">
            <span>{values.length} selected</span>
            <button
              type="button"
              onClick={() => {
                onChange([])
                setSearch("")
              }}
              className="text-primary hover:underline"
            >
              Clear all
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

