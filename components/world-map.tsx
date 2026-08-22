"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import * as d3 from "d3"
import * as topojson from "topojson-client"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, RotateCcw, Target } from "lucide-react"

/* ---------- Complete country mapping from our DB codes to TopoJSON properties ---------- */
const countryMapping: Record<string, { iso_a2?: string; iso_a3?: string; name_patterns?: string[] }> = {
  VA: { iso_a2: "VA", iso_a3: "VAT", name_patterns: ["vatican", "holy see"] },
  NR: { iso_a2: "NR", iso_a3: "NRU", name_patterns: ["nauru"] },
  TV: { iso_a2: "TV", iso_a3: "TUV", name_patterns: ["tuvalu"] },
  SM: { iso_a2: "SM", iso_a3: "SMR", name_patterns: ["san marino"] },
  LI: { iso_a2: "LI", iso_a3: "LIE", name_patterns: ["liechtenstein"] },
  MC: { iso_a2: "MC", iso_a3: "MCO", name_patterns: ["monaco"] },
  MH: { iso_a2: "MH", iso_a3: "MHL", name_patterns: ["marshall"] },
  KN: { iso_a2: "KN", iso_a3: "KNA", name_patterns: ["saint kitts", "st. kitts"] },
  AD: { iso_a2: "AD", iso_a3: "AND", name_patterns: ["andorra"] },
  DM: { iso_a2: "DM", iso_a3: "DMA", name_patterns: ["dominica"] },
  AG: { iso_a2: "AG", iso_a3: "ATG", name_patterns: ["antigua"] },
  SC: { iso_a2: "SC", iso_a3: "SYC", name_patterns: ["seychelles"] },
  GD: { iso_a2: "GD", iso_a3: "GRD", name_patterns: ["grenada"] },
  VC: { iso_a2: "VC", iso_a3: "VCT", name_patterns: ["saint vincent", "st. vincent"] },
  TO: { iso_a2: "TO", iso_a3: "TON", name_patterns: ["tonga"] },
  FM: { iso_a2: "FM", iso_a3: "FSM", name_patterns: ["micronesia"] },
  WS: { iso_a2: "WS", iso_a3: "WSM", name_patterns: ["samoa"] },
  KI: { iso_a2: "KI", iso_a3: "KIR", name_patterns: ["kiribati"] },
  ST: { iso_a2: "ST", iso_a3: "STP", name_patterns: ["sao tome"] },
  VU: { iso_a2: "VU", iso_a3: "VUT", name_patterns: ["vanuatu"] },
  LC: { iso_a2: "LC", iso_a3: "LCA", name_patterns: ["saint lucia", "st. lucia"] },
  FJ: { iso_a2: "FJ", iso_a3: "FJI", name_patterns: ["fiji"] },
  CY: { iso_a2: "CY", iso_a3: "CYP", name_patterns: ["cyprus"] },
  QA: { iso_a2: "QA", iso_a3: "QAT", name_patterns: ["qatar"] },
  KW: { iso_a2: "KW", iso_a3: "KWT", name_patterns: ["kuwait"] },
  IE: { iso_a2: "IE", iso_a3: "IRL", name_patterns: ["ireland"] },
  NO: { iso_a2: "NO", iso_a3: "NOR", name_patterns: ["norway"] },
  NZ: { iso_a2: "NZ", iso_a3: "NZL", name_patterns: ["new zealand"] },
  SG: { iso_a2: "SG", iso_a3: "SGP", name_patterns: ["singapore"] },
  FI: { iso_a2: "FI", iso_a3: "FIN", name_patterns: ["finland"] },
  DK: { iso_a2: "DK", iso_a3: "DNK", name_patterns: ["denmark"] },
  SK: { iso_a2: "SK", iso_a3: "SVK", name_patterns: ["slovakia"] },
  CR: { iso_a2: "CR", iso_a3: "CRI", name_patterns: ["costa rica"] },
  LB: { iso_a2: "LB", iso_a3: "LBN", name_patterns: ["lebanon"] },
  OM: { iso_a2: "OM", iso_a3: "OMN", name_patterns: ["oman"] },
  PA: { iso_a2: "PA", iso_a3: "PAN", name_patterns: ["panama"] },
  HR: { iso_a2: "HR", iso_a3: "HRV", name_patterns: ["croatia"] },
  GE: { iso_a2: "GE", iso_a3: "GEO", name_patterns: ["georgia"] },
  MD: { iso_a2: "MD", iso_a3: "MDA", name_patterns: ["moldova"] },
  LT: { iso_a2: "LT", iso_a3: "LTU", name_patterns: ["lithuania"] },
  LV: { iso_a2: "LV", iso_a3: "LVA", name_patterns: ["latvia"] },
  EE: { iso_a2: "EE", iso_a3: "EST", name_patterns: ["estonia"] },
  SI: { iso_a2: "SI", iso_a3: "SVN", name_patterns: ["slovenia"] },
  MK: { iso_a2: "MK", iso_a3: "MKD", name_patterns: ["macedonia", "north macedonia"] },
  AL: { iso_a2: "AL", iso_a3: "ALB", name_patterns: ["albania"] },
  BA: { iso_a2: "BA", iso_a3: "BIH", name_patterns: ["bosnia"] },
  MN: { iso_a2: "MN", iso_a3: "MNG", name_patterns: ["mongolia"] },
  UY: { iso_a2: "UY", iso_a3: "URY", name_patterns: ["uruguay"] },
  PR: { iso_a2: "PR", iso_a3: "PRI", name_patterns: ["puerto rico"] },
  JM: { iso_a2: "JM", iso_a3: "JAM", name_patterns: ["jamaica"] },
  US: { iso_a2: "US", iso_a3: "USA", name_patterns: ["united states", "america"] },
  CN: { iso_a2: "CN", iso_a3: "CHN", name_patterns: ["china"] },
  IN: { iso_a2: "IN", iso_a3: "IND", name_patterns: ["india"] },
  BB: { iso_a2: "BB", iso_a3: "BRB", name_patterns: ["barbados"] },
  IS: { iso_a2: "IS", iso_a3: "ISL", name_patterns: ["iceland"] },
  MT: { iso_a2: "MT", iso_a3: "MLT", name_patterns: ["malta"] },
  BN: { iso_a2: "BN", iso_a3: "BRN", name_patterns: ["brunei"] },
  BH: { iso_a2: "BH", iso_a3: "BHR", name_patterns: ["bahrain"] },
  DJ: { iso_a2: "DJ", iso_a3: "DJI", name_patterns: ["djibouti"] },
  BT: { iso_a2: "BT", iso_a3: "BTN", name_patterns: ["bhutan"] },
  KM: { iso_a2: "KM", iso_a3: "COM", name_patterns: ["comoros"] },
  GQ: { iso_a2: "GQ", iso_a3: "GNQ", name_patterns: ["equatorial guinea"] },
  MU: { iso_a2: "MU", iso_a3: "MUS", name_patterns: ["mauritius"] },
  SZ: { iso_a2: "SZ", iso_a3: "SWZ", name_patterns: ["eswatini", "swaziland"] },
  TT: { iso_a2: "TT", iso_a3: "TTO", name_patterns: ["trinidad"] },
  GW: { iso_a2: "GW", iso_a3: "GNB", name_patterns: ["guinea-bissau"] },
  LS: { iso_a2: "LS", iso_a3: "LSO", name_patterns: ["lesotho"] },
  BW: { iso_a2: "BW", iso_a3: "BWA", name_patterns: ["botswana"] },
  GM: { iso_a2: "GM", iso_a3: "GMB", name_patterns: ["gambia"] },
  AM: { iso_a2: "AM", iso_a3: "ARM", name_patterns: ["armenia"] },
  LR: { iso_a2: "LR", iso_a3: "LBR", name_patterns: ["liberia"] },
  CF: { iso_a2: "CF", iso_a3: "CAF", name_patterns: ["central african"] },
  MR: { iso_a2: "MR", iso_a3: "MRT", name_patterns: ["mauritania"] },
  TM: { iso_a2: "TM", iso_a3: "TKM", name_patterns: ["turkmenistan"] },
  SL: { iso_a2: "SL", iso_a3: "SLE", name_patterns: ["sierra leone"] },
  TG: { iso_a2: "TG", iso_a3: "TGO", name_patterns: ["togo"] },
  CH: { iso_a2: "CH", iso_a3: "CHE", name_patterns: ["switzerland"] },
  HN: { iso_a2: "HN", iso_a3: "HND", name_patterns: ["honduras"] },
  AE: { iso_a2: "AE", iso_a3: "ARE", name_patterns: ["united arab emirates", "uae"] },
  AT: { iso_a2: "AT", iso_a3: "AUT", name_patterns: ["austria"] },
  BY: { iso_a2: "BY", iso_a3: "BLR", name_patterns: ["belarus"] },
  TJ: { iso_a2: "TJ", iso_a3: "TJK", name_patterns: ["tajikistan"] },
  HU: { iso_a2: "HU", iso_a3: "HUN", name_patterns: ["hungary"] },
  JO: { iso_a2: "JO", iso_a3: "JOR", name_patterns: ["jordan"] },
  AZ: { iso_a2: "AZ", iso_a3: "AZE", name_patterns: ["azerbaijan"] },
  PT: { iso_a2: "PT", iso_a3: "PRT", name_patterns: ["portugal"] },
  CZ: { iso_a2: "CZ", iso_a3: "CZE", name_patterns: ["czech", "czechia"] },
  GR: { iso_a2: "GR", iso_a3: "GRC", name_patterns: ["greece"] },
  DO: { iso_a2: "DO", iso_a3: "DOM", name_patterns: ["dominican republic"] },
  CU: { iso_a2: "CU", iso_a3: "CUB", name_patterns: ["cuba"] },
  HT: { iso_a2: "HT", iso_a3: "HTI", name_patterns: ["haiti"] },
  BE: { iso_a2: "BE", iso_a3: "BEL", name_patterns: ["belgium"] },
  BO: { iso_a2: "BO", iso_a3: "BOL", name_patterns: ["bolivia"] },
  TN: { iso_a2: "TN", iso_a3: "TUN", name_patterns: ["tunisia"] },
  BF: { iso_a2: "BF", iso_a3: "BFA", name_patterns: ["burkina faso"] },
  SO: { iso_a2: "SO", iso_a3: "SOM", name_patterns: ["somalia"] },
  SN: { iso_a2: "SN", iso_a3: "SEN", name_patterns: ["senegal"] },
  TD: { iso_a2: "TD", iso_a3: "TCD", name_patterns: ["chad"] },
  ZW: { iso_a2: "ZW", iso_a3: "ZWE", name_patterns: ["zimbabwe"] },
  GN: { iso_a2: "GN", iso_a3: "GIN", name_patterns: ["guinea"] },
  RW: { iso_a2: "RW", iso_a3: "RWA", name_patterns: ["rwanda"] },
  BJ: { iso_a2: "BJ", iso_a3: "BEN", name_patterns: ["benin"] },
  BI: { iso_a2: "BI", iso_a3: "BDI", name_patterns: ["burundi"] },
  SS: { iso_a2: "SS", iso_a3: "SSD", name_patterns: ["south sudan"] },
  NL: { iso_a2: "NL", iso_a3: "NLD", name_patterns: ["netherlands"] },
  KZ: { iso_a2: "KZ", iso_a3: "KAZ", name_patterns: ["kazakhstan"] },
  GT: { iso_a2: "GT", iso_a3: "GTM", name_patterns: ["guatemala"] },
  EC: { iso_a2: "EC", iso_a3: "ECU", name_patterns: ["ecuador"] },
  SY: { iso_a2: "SY", iso_a3: "SYR", name_patterns: ["syria"] },
  ML: { iso_a2: "ML", iso_a3: "MLI", name_patterns: ["mali"] },
  MW: { iso_a2: "MW", iso_a3: "MWI", name_patterns: ["malawi"] },
  CL: { iso_a2: "CL", iso_a3: "CHL", name_patterns: ["chile"] },
  ZM: { iso_a2: "ZM", iso_a3: "ZMB", name_patterns: ["zambia"] },
  NE: { iso_a2: "NE", iso_a3: "NER", name_patterns: ["niger"] },
  LK: { iso_a2: "LK", iso_a3: "LKA", name_patterns: ["sri lanka"] },
  RO: { iso_a2: "RO", iso_a3: "ROU", name_patterns: ["romania"] },
  MZ: { iso_a2: "MZ", iso_a3: "MOZ", name_patterns: ["mozambique"] },
  MG: { iso_a2: "MG", iso_a3: "MDG", name_patterns: ["madagascar"] },
  CM: { iso_a2: "CM", iso_a3: "CMR", name_patterns: ["cameroon"] },
  CI: { iso_a2: "CI", iso_a3: "CIV", name_patterns: ["ivory coast", "côte d'ivoire"] },
  AU: { iso_a2: "AU", iso_a3: "AUS", name_patterns: ["australia"] },
  TW: { iso_a2: "TW", iso_a3: "TWN", name_patterns: ["taiwan"] },
  VE: { iso_a2: "VE", iso_a3: "VEN", name_patterns: ["venezuela"] },
  NP: { iso_a2: "NP", iso_a3: "NPL", name_patterns: ["nepal"] },
  UZ: { iso_a2: "UZ", iso_a3: "UZB", name_patterns: ["uzbekistan"] },
  PE: { iso_a2: "PE", iso_a3: "PER", name_patterns: ["peru"] },
  MY: { iso_a2: "MY", iso_a3: "MYS", name_patterns: ["malaysia"] },
  AF: { iso_a2: "AF", iso_a3: "AFG", name_patterns: ["afghanistan"] },
  SA: { iso_a2: "SA", iso_a3: "SAU", name_patterns: ["saudi arabia"] },
  UG: { iso_a2: "UG", iso_a3: "UGA", name_patterns: ["uganda"] },
  IQ: { iso_a2: "IQ", iso_a3: "IRQ", name_patterns: ["iraq"] },
  CA: { iso_a2: "CA", iso_a3: "CAN", name_patterns: ["canada"] },
  PL: { iso_a2: "PL", iso_a3: "POL", name_patterns: ["poland"] },
  MA: { iso_a2: "MA", iso_a3: "MAR", name_patterns: ["morocco"] },
  DZ: { iso_a2: "DZ", iso_a3: "DZA", name_patterns: ["algeria"] },
  AR: { iso_a2: "AR", iso_a3: "ARG", name_patterns: ["argentina"] },
  SD: { iso_a2: "SD", iso_a3: "SDN", name_patterns: ["sudan"] },
  UA: { iso_a2: "UA", iso_a3: "UKR", name_patterns: ["ukraine"] },
  KE: { iso_a2: "KE", iso_a3: "KEN", name_patterns: ["kenya"] },
  ES: { iso_a2: "ES", iso_a3: "ESP", name_patterns: ["spain"] },
  TZ: { iso_a2: "TZ", iso_a3: "TZA", name_patterns: ["tanzania"] },
  ZA: { iso_a2: "ZA", iso_a3: "ZAF", name_patterns: ["south africa"] },
  MM: { iso_a2: "MM", iso_a3: "MMR", name_patterns: ["myanmar", "burma"] },
  KR: { iso_a2: "KR", iso_a3: "KOR", name_patterns: ["south korea", "korea"] },
  CO: { iso_a2: "CO", iso_a3: "COL", name_patterns: ["colombia"] },
  IT: { iso_a2: "IT", iso_a3: "ITA", name_patterns: ["italy"] },
  GB: { iso_a2: "GB", iso_a3: "GBR", name_patterns: ["united kingdom", "britain"] },
  FR: { iso_a2: "FR", iso_a3: "FRA", name_patterns: ["france"] },
  TH: { iso_a2: "TH", iso_a3: "THA", name_patterns: ["thailand"] },
  DE: { iso_a2: "DE", iso_a3: "DEU", name_patterns: ["germany"] },
  TR: { iso_a2: "TR", iso_a3: "TUR", name_patterns: ["turkey"] },
  IR: { iso_a2: "IR", iso_a3: "IRN", name_patterns: ["iran"] },
  CD: { iso_a2: "CD", iso_a3: "COD", name_patterns: ["democratic republic", "congo", "drc"] },
  VN: { iso_a2: "VN", iso_a3: "VNM", name_patterns: ["vietnam"] },
  PH: { iso_a2: "PH", iso_a3: "PHL", name_patterns: ["philippines"] },
  ET: { iso_a2: "ET", iso_a3: "ETH", name_patterns: ["ethiopia"] },
  EG: { iso_a2: "EG", iso_a3: "EGY", name_patterns: ["egypt"] },
  JP: { iso_a2: "JP", iso_a3: "JPN", name_patterns: ["japan"] },
  MX: { iso_a2: "MX", iso_a3: "MEX", name_patterns: ["mexico"] },
  RU: { iso_a2: "RU", iso_a3: "RUS", name_patterns: ["russia"] },
  BD: { iso_a2: "BD", iso_a3: "BGD", name_patterns: ["bangladesh"] },
  NG: { iso_a2: "NG", iso_a3: "NGA", name_patterns: ["nigeria"] },
  BR: { iso_a2: "BR", iso_a3: "BRA", name_patterns: ["brazil"] },
  PK: { iso_a2: "PK", iso_a3: "PAK", name_patterns: ["pakistan"] },
  ID: { iso_a2: "ID", iso_a3: "IDN", name_patterns: ["indonesia"] },
}

/* ---------- Types ---------- */
interface Country {
  id: string
  name: string
  initial_population: number
  current_population: number
  is_cleared: boolean
  order_index: number
}

interface Props {
  currentCountry: Country | null
  clearedCountries: Country[]
}

/* ---------- Helper functions ---------- */
function matchCountryToFeature(countryId: string, feature: any): boolean {
  const mapping = countryMapping[countryId]
  if (!mapping) return false

  const props = feature.properties
  if (!props) return false

  // Try ISO codes first (most reliable)
  if (mapping.iso_a2 && (props.ISO_A2 === mapping.iso_a2 || props.ISO_A2_EH === mapping.iso_a2)) {
    return true
  }
  if (mapping.iso_a3 && (props.ISO_A3 === mapping.iso_a3 || props.ISO_A3_EH === mapping.iso_a3)) {
    return true
  }

  // Name-pattern fallback. The bundled world-atlas 110m dataset only exposes
  // `properties.name` (plus a numeric `id`), so include that first. Guard
  // against an empty feature name, otherwise `pattern.includes("")` matches
  // everything and every feature resolves to the first game country.
  if (mapping.name_patterns) {
    const featureName = (props.name || props.NAME || props.NAME_EN || props.ADMIN || "").toLowerCase().trim()
    if (!featureName) return false
    return mapping.name_patterns.some((pattern) => {
      const p = pattern.toLowerCase()
      return featureName === p || featureName.includes(p) || p.includes(featureName)
    })
  }

  return false
}

function findCountryFeature(countryId: string, features: any[]): any {
  return features.find((feature) => matchCountryToFeature(countryId, feature))
}

function getCountryFromFeature(feature: any, allCountries: Country[]): Country | null {
  return allCountries.find((country) => matchCountryToFeature(country.id, feature)) || null
}

function safeCentroid(path: d3.GeoPath, feature: any): [number, number] | null {
  try {
    const centroid = path.centroid(feature)
    if (centroid && centroid.length === 2 && Number.isFinite(centroid[0]) && Number.isFinite(centroid[1])) {
      return centroid as [number, number]
    }
  } catch (error) {
    console.warn("Error calculating centroid:", error)
  }
  return null
}

function safeBounds(path: d3.GeoPath, feature: any): [[number, number], [number, number]] | null {
  try {
    const bounds = path.bounds(feature)
    if (
      bounds &&
      bounds.length === 2 &&
      bounds[0].length === 2 &&
      bounds[1].length === 2 &&
      bounds.every((bound) => bound.every((coord) => Number.isFinite(coord)))
    ) {
      return bounds as [[number, number], [number, number]]
    }
  } catch (error) {
    console.warn("Error calculating bounds:", error)
  }
  return null
}

/* ---------- Component ---------- */
export function WorldMap({ currentCountry, clearedCountries }: Props) {
  const svgRef = useRef<SVGSVGElement>(null)
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null)
  const [features, setFeatures] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // All countries for matching
  const allCountries = [...clearedCountries, ...(currentCountry ? [currentCountry] : [])]

  /* ---- Load TopoJSON data ---- */
  useEffect(() => {
    setLoading(true)
    // Served locally from /public so the app has no runtime CDN dependency
    // (important for self-hosting / offline use).
    d3.json("/countries-110m.json")
      .then((world: any) => {
        const countries = topojson.feature(world, world.objects.countries) as any

        // Filter out features with invalid geometry
        const validFeatures = countries.features.filter((feature: any) => {
          try {
            return feature?.geometry && feature.geometry.coordinates && feature.geometry.coordinates.length > 0
          } catch {
            return false
          }
        })

        console.log(`Loaded ${validFeatures.length} valid country features`)
        setFeatures(validFeatures)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error loading world data:", error)
        setLoading(false)
      })
  }, [])

  /* ---- Render map ---- */
  useEffect(() => {
    if (!features.length || !svgRef.current || loading) return

    const width = 800
    const height = 500
    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    // Setup projection and path
    const projection = d3
      .geoNaturalEarth1()
      .scale(130)
      .translate([width / 2, height / 2])

    const path = d3.geoPath().projection(projection)

    // Setup zoom behavior
    if (!zoomRef.current) {
      zoomRef.current = d3
        .zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.5, 8])
        .on("zoom", (event) => {
          const { transform } = event
          svg.select(".map-group").attr("transform", transform)

          // Scale crosshair elements with zoom
          svg.selectAll(".crosshair-line").attr("stroke-width", 4 / transform.k)
          svg.selectAll(".crosshair-circle").attr("stroke-width", 2 / transform.k)
          svg.selectAll(".crosshair-bg").attr("stroke-width", 3 / transform.k)
        })
    }
    svg.call(zoomRef.current as any)

    // Create map group
    const mapGroup = svg.append("g").attr("class", "map-group")

    // Draw countries
    mapGroup
      .selectAll("path")
      .data(features)
      .join("path")
      .attr("d", (feature: any) => {
        try {
          return path(feature) || ""
        } catch {
          return ""
        }
      })
      .attr("fill", (feature: any) => {
        const country = getCountryFromFeature(feature, allCountries)
        if (!country) return "#374151" // Gray for non-game countries

        // Check if this specific country is in the cleared countries array
        const isCleared = clearedCountries.some((cleared) => cleared.id === country.id)

        if (currentCountry && country.id === currentCountry.id) return "#dc2626" // Red for current target
        if (isCleared) return "#16a34a" // Green ONLY for actually cleared countries

        // All other countries (including game countries that aren't cleared yet) should be gray
        return "#374151"
      })
      .attr("stroke", "#1f2937")
      .attr("stroke-width", 0.5)
      .attr("opacity", (feature: any) => {
        const country = getCountryFromFeature(feature, allCountries)
        if (!country) return 0.3 // Dim for non-game countries

        // Game countries should be fully visible
        return 1
      })

    // Draw crosshair for current country
    if (currentCountry) {
      const feature = findCountryFeature(currentCountry.id, features)
      if (feature) {
        const centroid = safeCentroid(path, feature)
        if (centroid) {
          const [cx, cy] = centroid
          const crosshairGroup = svg.append("g").attr("class", "crosshair-group")

          // Background circle
          crosshairGroup
            .append("circle")
            .attr("class", "crosshair-bg")
            .attr("cx", cx)
            .attr("cy", cy)
            .attr("r", 20)
            .attr("fill", "rgba(255, 255, 255, 0.9)")
            .attr("stroke", "#000000")
            .attr("stroke-width", 3)

          // Crosshair lines
          const lineLength = 35
          crosshairGroup
            .append("line")
            .attr("class", "crosshair-line")
            .attr("x1", cx - lineLength)
            .attr("x2", cx + lineLength)
            .attr("y1", cy)
            .attr("y2", cy)
            .attr("stroke", "#000000")
            .attr("stroke-width", 4)

          crosshairGroup
            .append("line")
            .attr("class", "crosshair-line")
            .attr("x1", cx)
            .attr("x2", cx)
            .attr("y1", cy - lineLength)
            .attr("y2", cy + lineLength)
            .attr("stroke", "#000000")
            .attr("stroke-width", 4)

          // Center dot
          crosshairGroup
            .append("circle")
            .attr("class", "crosshair-circle")
            .attr("cx", cx)
            .attr("cy", cy)
            .attr("r", 6)
            .attr("fill", "#dc2626")
            .attr("stroke", "#ffffff")
            .attr("stroke-width", 2)

          console.log(`Crosshair drawn for ${currentCountry.name} at [${cx}, ${cy}]`)
        } else {
          console.warn(`Could not calculate centroid for ${currentCountry.name}`)
        }
      } else {
        console.warn(`Could not find map feature for ${currentCountry.name} (${currentCountry.id})`)
      }
    }
  }, [features, currentCountry, clearedCountries, loading])

  /* ---- Zoom controls ---- */
  const safeZoom = useCallback((fn: (zoom: any, svg: any) => void) => {
    if (zoomRef.current && svgRef.current) {
      fn(zoomRef.current, d3.select(svgRef.current))
    }
  }, [])

  const zoomToCountry = useCallback(() => {
    if (!currentCountry || !features.length) return

    const feature = findCountryFeature(currentCountry.id, features)
    if (!feature) return

    const projection = d3.geoNaturalEarth1().scale(130).translate([400, 250])
    const path = d3.geoPath().projection(projection)
    const bounds = safeBounds(path, feature)

    if (!bounds) return

    safeZoom((zoom, svg) => {
      const [[x0, y0], [x1, y1]] = bounds
      const dx = x1 - x0
      const dy = y1 - y0
      const x = (x0 + x1) / 2
      const y = (y0 + y1) / 2

      // Calculate scale more aggressively for small countries
      const scale = Math.min(8, Math.max(2, 0.8 / Math.max(dx / 800, dy / 500)))
      const translate = [400 - scale * x, 250 - scale * y]

      console.log(`Zooming to ${currentCountry.name}: scale=${scale}, translate=[${translate[0]}, ${translate[1]}]`)

      svg
        .transition()
        .duration(1000)
        .call(zoom.transform, d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale))
    })
  }, [currentCountry, features, safeZoom])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[500px] bg-gray-900 rounded-lg">
        <div className="text-white">Loading world map...</div>
      </div>
    )
  }

  return (
    <div className="relative w-full">
      {/* Zoom controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => safeZoom((zoom, svg) => svg.call(zoom.scaleBy, 1.5))}
          title="Zoom in"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => safeZoom((zoom, svg) => svg.call(zoom.scaleBy, 1 / 1.5))}
          title="Zoom out"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => safeZoom((zoom, svg) => svg.call(zoom.transform, d3.zoomIdentity))}
          title="Reset zoom"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        {currentCountry && (
          <Button size="sm" variant="secondary" onClick={zoomToCountry} title="Zoom to current target">
            <Target className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Map SVG */}
      <svg
        ref={svgRef}
        width="100%"
        height="500"
        viewBox="0 0 800 500"
        className="bg-gray-900 rounded-lg border border-gray-700"
      />

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-red-600 rounded" />
          <span>Current Target</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-green-600 rounded" />
          <span>Cleared</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-gray-600 rounded opacity-30" />
          <span>Other Countries</span>
        </div>
        {currentCountry && (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 relative bg-white rounded-full border-2 border-black flex items-center justify-center">
              <div className="w-3 h-0.5 bg-black absolute"></div>
              <div className="w-0.5 h-3 bg-black absolute"></div>
              <div className="w-2 h-2 bg-red-600 rounded-full absolute"></div>
            </div>
            <span>Target Crosshair</span>
          </div>
        )}
      </div>
    </div>
  )
}
