import React from "react"
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
  Markers,
  Marker,
} from "react-simple-maps"

const wrapperStyles = {
  width: "100%",
  maxWidth: 980,
  margin: "0 auto",
}

// Object data for map markers
// markerOffset: 15 is text below, -35 for text above, coords are [long, lat]
const markers = [
  { markerOffset: 15, name: "", coordinates: [100.501762, 13.756331] }, //Bangkok
  { markerOffset: 15, name: "", coordinates: [-91.187149, 30.451468] }, //Baton Rouge
  { markerOffset: 15, name: "", coordinates: [19.040236, 47.497913] }, //Budapest
  { markerOffset: 15, name: "", coordinates: [-58.435446, -34.609255] }, //Buenos Aires
  { markerOffset: 15, name: "", coordinates: [-114.070847, 51.048615] }, //Calgary
  { markerOffset: 15, name: "", coordinates: [-49.271170, -25.432181] }, //Curitiba
  { markerOffset: 15, name: "", coordinates: [-96.796989, 32.776665] }, //Dallas
  { markerOffset: 15, name: "", coordinates: [-95.446443, 30.103018] }, //Houston
  { markerOffset: 15, name: "", coordinates: [-96.943707, 32.826970] }, //Irving
  { markerOffset: 15, name: "", coordinates: [101.686852, 3.139003] }, //Kuala Lumpur
  { markerOffset: 15, name: "", coordinates: [-0.331120, 51.296406] }, //Leatherhead
  { markerOffset: 15, name: "", coordinates: [4.435350, 50.912159] }, //Machelen
  { markerOffset: 15, name: "", coordinates: [103.819839, 1.352083] }, //Singapore
  { markerOffset: 15, name: "", coordinates: [-1.404351, 50.909698] }, //Southampton
]

const WorldMap = () => (
  <div style={wrapperStyles}>
    <ComposableMap
      projectionConfig={{
        scale: 205,
        rotation: [-11, 0, 0]
      }}
      width={980}
      height={551}
      style={{
        width: "100%",
        height: "auto"
      }}
    >
      <ZoomableGroup center={[0, 0]} disablePanning>
        <Geographies geography={/* Removed due to contract */}>
          {(geographies, projection) =>
            geographies.map(
              (geography, i) =>
                geography.id !== "ATA" && (
                  <Geography
                    key={i}
                    geography={geography}
                    projection={projection}
                    style={{
                      default: {
                        fill: "#FFFFFF",
                        stroke: "#002F6C",
                        strokeWidth: 0.75,
                        outline: "none"
                      },
                      hover: {
                        fill: "#FFFFFF",
                        stroke: "#002F6C",
                        strokeWidth: 0.75,
                        outline: "none"
                      },
                      pressed: {
                        fill: "#FFFFFF",
                        stroke: "#002F6C",
                        strokeWidth: 0.75,
                        outline: "none"
                      }
                    }}
                  />
                )
            )
          }
        </Geographies>
        <Markers>
          {markers.map((marker, i) => (
            <Marker
              key={i}
              scale={1.5}
              marker={marker}
              style={{
                default: { stroke: "#ED8B00", outline: "none" },
                hover: { stroke: "#ED8B00", outline: "none" },
                pressed: { stroke: "#ED8B00", outline: "none" },
              }}
              >
              <g transform="translate(-12, -24)">
                <path
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="square"
                  strokeMiterlimit="10"
                  strokeLinejoin="miter"
                  d="M20,9c0,4.9-8,13-8,13S4,13.9,4,9c0-5.1,4.1-8,8-8S20,3.9,20,9z"
                />
                <circle
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="square"
                  strokeMiterlimit="10"
                  strokeLinejoin="miter"
                  cx="12"
                  cy="9"
                  r="3"
                />
              </g>
              <text
                textAnchor="middle"
                y={marker.markerOffset}
                style={{
                  fontFamily: "Arial, sans-serif",
                  fill: "#FF5722",
                  stroke: "unset",
                }}
                >
                {marker.name}
              </text>
            </Marker>
          ))}
        </Markers>
      </ZoomableGroup>
    </ComposableMap>
  </div>
);

export default WorldMap;