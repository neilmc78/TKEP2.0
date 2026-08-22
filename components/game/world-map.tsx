"use client"

import { useRef, useEffect, useState } from "react"
import * as d3 from "d3"
import * as topojson from "topojson-client"

interface CountryData {
  id: string
  name: string
  initial_population: number
  current_population: number
  is_cleared: boolean
  order_index: number
}

interface WorldMapProps {
  allCountries: CountryData[]
  currentCountryId: string | null
  userProgress: any // User progress data
}

export function WorldMap({ allCountries, currentCountryId, userProgress }: WorldMapProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [tooltipContent, setTooltipContent] = useState<string | null>(null)
  const [tooltipX, setTooltipX] = useState(0)
  const [tooltipY, setTooltipY] = useState(0)

  useEffect(() => {
    const svg = d3.select(svgRef.current)
    const width = svg.node()?.getBoundingClientRect().width || 800
    const height = svg.node()?.getBoundingClientRect().height || 600

    svg.selectAll("*").remove() // Clear SVG on re-render

    const projection = d3
      .geoMercator()
      .scale(150)
      .center([0, 0])
      .translate([width / 2, height / 2])
    const path = d3.geoPath().projection(projection)

    // Fetch TopoJSON data
    // IMPORTANT: Replace this with a valid URL to a TopoJSON file (e.g., from Natural Earth Data)
    // Example: "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"
    d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json").then((world: any) => {
      const countries = topojson.feature(world, world.objects.countries) as any

      // Filter countries to only show cleared ones and the current one
      const visibleCountries = countries.features.filter((d: any) => {
        const country = allCountries.find((c) => c.id === d.id)
        return country && (country.is_cleared || country.id === currentCountryId)
      })

      svg
        .append("g")
        .selectAll("path")
        .data(visibleCountries)
        .join("path")
        .attr("d", path as any)
        .attr("fill", (d: any) => {
          const country = allCountries.find((c) => c.id === d.id)
          if (!country) return "#333" // Fallback for unknown countries
          if (country.id === currentCountryId) return "#dc2626" // Red for current target
          if (country.is_cleared) return "#16a34a" // Green for cleared
          return "#333" // Default for other visible countries (shouldn't be many)
        })
        .attr("stroke", "#1f2937")
        .attr("stroke-width", 0.5)
        .attr("class", "country-path transition-all duration-300")
        .on("mouseover", (event, d: any) => {
          const country = allCountries.find((c) => c.id === d.id)
          if (country) {
            setTooltipContent(
              `
              <div class="p-2 bg-gray-700 text-gray-100 rounded-md shadow-lg text-sm">
                <h3 class="font-bold text-white">${country.name}</h3>
                <p>Population: ${country.current_population.toLocaleString()}</p>
                <p>Removed: ${(country.initial_population - country.current_population).toLocaleString()}</p>
                ${country.id === currentCountryId ? '<p class="text-red-400">Current Target</p>' : ""}
                ${country.is_cleared ? '<p class="text-green-400">Cleared!</p>' : ""}
              </div>
              `,
            )
            setTooltipX(event.pageX + 10)
            setTooltipY(event.pageY - 10)
          }
        })
        .on("mouseout", () => {
          setTooltipContent(null)
        })
    })
  }, [allCountries, currentCountryId, userProgress])

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg ref={svgRef} className="w-full h-full bg-gray-900 rounded-lg" />
      {tooltipContent && (
        <div
          className="absolute pointer-events-none z-50"
          style={{ left: tooltipX, top: tooltipY }}
          dangerouslySetInnerHTML={{ __html: tooltipContent }}
        />
      )}
    </div>
  )
}
