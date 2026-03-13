import { useState, useEffect, useRef } from "react"

export default function useTickerSearch(onAnalyze) {

  const [ticker, setTicker] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [popular, setPopular] = useState([])
  const [loadingSuggest, setLoadingSuggest] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  const debounceRef = useRef(null)

  useEffect(() => {
    fetch("http://localhost:8000/popular")
      .then(r => r.json())
      .then(d => setPopular(d.results || []))
      .catch(() => {})
  }, [])


  const handleInput = (val) => {

    const upper = val.toUpperCase()

    setTicker(upper)
    setShowDropdown(true)

    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (upper.length < 2) {
      setSuggestions([])
      return
    }

    debounceRef.current = setTimeout(async () => {

      setLoadingSuggest(true)

      try {

        const res = await fetch(`http://localhost:8000/search?q=${upper}`)
        const data = await res.json()

        setSuggestions(data.results || [])

      } catch {

        setSuggestions([])

      } finally {

        setLoadingSuggest(false)

      }

    }, 350)

  }


  const handleSearch = () => {

    const clean = ticker.trim().toUpperCase()

    if (!clean) return

    setSuggestions([])
    setShowDropdown(false)

    onAnalyze(clean)

  }


  const handleSelect = (symbol) => {

    const clean = symbol.toUpperCase()

    setTicker(clean)
    setSuggestions([])
    setShowDropdown(false)

    onAnalyze(clean)

  }


  const dropItems =
    suggestions.length > 0
      ? suggestions
      : popular
          .filter(p =>
            ticker.length === 0 ||
            p.symbol.includes(ticker) ||
            p.name.toLowerCase().includes(ticker.toLowerCase())
          )
          .slice(0, 8)


  return {
    ticker,
    setTicker,
    suggestions,
    popular,
    dropItems,
    loadingSuggest,
    showDropdown,
    setShowDropdown,
    handleInput,
    handleSearch,
    handleSelect
  }
}