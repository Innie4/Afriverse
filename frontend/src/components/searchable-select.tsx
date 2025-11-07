import { useEffect, useMemo, useRef, useState } from "react"
import { SelectOption } from "@/data/select-options"
import { cn } from "@/lib/utils"
import { Search } from "lucide-react"

interface SearchableSelectProps {
  name: string
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  disabled?: boolean
  helperText?: string
  emptyText?: string
}

export function SearchableSelect({
  name,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  disabled = false,
  helperText,
  emptyText = "No matches found",
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")
  const containerRef = useRef<HTMLDivElement | null>(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null)

  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options
    const query = search.toLowerCase()
    return options.filter((option) => option.label.toLowerCase().includes(query) || option.value.toLowerCase().includes(query) || option.meta?.toLowerCase().includes(query))
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

  const selectedOption = options.find((option) => option.value === value)

  const handleSelect = (nextValue: string) => {
    onChange(nextValue)
    setIsOpen(false)
    setSearch("")
    buttonRef.current?.focus()
  }

  return (
    <div ref={containerRef} className="relative">
      <input type="hidden" name={name} value={value} />
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "flex w-full items-center justify-between rounded-lg border border-border bg-background px-4 py-2 text-left text-sm transition-colors",
          disabled ? "cursor-not-allowed opacity-60" : "hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
        )}
      >
        <span className={cn("truncate", !selectedOption && "text-muted-foreground")}>{selectedOption?.label ?? placeholder}</span>
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
                const isSelected = option.value === value
                return (
                  <button
                    type="button"
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    className={cn(
                      "flex w-full flex-col items-start gap-1 px-4 py-2 text-left text-sm transition-colors",
                      isSelected ? "bg-primary/10 text-primary" : "hover:bg-muted"
                    )}
                  >
                    <span>{option.label}</span>
                    {option.meta && <span className="text-xs text-muted-foreground">{option.meta}</span>}
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}

