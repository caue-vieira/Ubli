import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Tooltip,
  useMap,
} from "react-leaflet";
import { useEffect, useState } from "react";
import axios from "axios";
import L, { LatLngExpression, LatLngTuple, Icon } from "leaflet";

import { SidebarTrigger } from "@/components/ui/sidebar";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Corrige ícones padrão
delete (L.Icon.Default.prototype as unknown as { _getIconUrl: unknown })
  ._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Ícone vermelho para locais não acessíveis
const redIcon = new Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Componente auxiliar para mover o mapa dinamicamente
function RecenterMap({ coords }: { coords: LatLngExpression }) {
  const map = useMap();
  useEffect(() => {
    map.setView(coords, 15);
  }, [coords, map]);
  return null;
}

export default function MapComponent() {
  const [userPosition, setUserPosition] = useState<LatLngExpression | null>(
    null
  );
  const [mapCenter, setMapCenter] = useState<LatLngExpression>([
    -23.5505, -46.6333,
  ]);
  const [query, setQuery] = useState("");
  const [searchMarker, setSearchMarker] = useState<LatLngExpression | null>(
    null
  );
  const [selectedPlace, setSelectedPlace] = useState<{
    name: string;
    image: string;
  } | null>(null);

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}`
      );
      if (response.data && response.data.length > 0) {
        const { lat, lon } = response.data[0];
        const coords: LatLngExpression = [parseFloat(lat), parseFloat(lon)];
        setMapCenter(coords);
        setSearchMarker(coords);
      } else {
        alert("Endereço não encontrado.");
      }
    } catch (error) {
      console.error("Erro ao buscar o endereço:", error);
    }
  };

  {
    /*Locais para adicionar manualmente locais acessiveis*/
  }
  const accessiblePlaces: {
    position: LatLngTuple;
    name: string;
    image: string;
  }[] = [
    {
      position: [-23.55052, -46.633308],
      name: "Estação Central (acessível)",
      image: "https://via.placeholder.com/400x200.png?text=Estação+Central",
    },
    {
      position: [-23.552, -46.635],
      name: "Biblioteca Pública (acessível)",
      image: "https://via.placeholder.com/400x200.png?text=Biblioteca+Pública",
    },
  ];

  const nonAccessiblePlaces: {
    position: LatLngTuple;
    name: string;
    image: string;
  }[] = [
    {
      position: [-23.553, -46.637],
      name: "Loja Antiga (não acessível)",
      image: "https://via.placeholder.com/400x200.png?text=Loja+Antiga",
    },
    {
      position: [-23.554, -46.638],
      name: "Cinema Clássico (não acessível)",
      image: "https://via.placeholder.com/400x200.png?text=Cinema+Clássico",
    },
  ];

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const coords: LatLngExpression = [
          pos.coords.latitude,
          pos.coords.longitude,
        ];
        setUserPosition(coords);
        setMapCenter(coords); // apenas no carregamento inicial
      });
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="h-screen w-full relative">
      {/* Botão do menu */}
      <div className="absolute top-4 left-4 z-[1000]">
        <SidebarTrigger className="bg-white text-black p-2 rounded shadow" />
      </div>

      {/* Campo de busca  superior direito */}
      <div className="absolute top-4 right-4 z-[50] bg-white rounded-full shadow-md flex items-center px-4 py-2 w-80">
        <input
          type="text"
          placeholder="Buscar local..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 px-2 py-1 text-sm outline-none text-black"
        />
        <button
          onClick={handleSearch}
          className="ml-2 text-blue-700 hover:text-blue-900 font-semibold"
        >
          Buscar
        </button>
      </div>

      {/* Painel lateral ao clicar em um local */}
      {selectedPlace && (
        <div className="absolute top-0 right-0 h-full w-80 bg-white shadow-lg z-[60] p-4 overflow-auto">
          <button
            className="text-sm text-red-500 hover:underline mb-2"
            onClick={() => setSelectedPlace(null)}
          >
            Fechar
          </button>
          <h2 className="text-lg font-semibold mb-2">{selectedPlace.name}</h2>
          <img
            src={selectedPlace.image}
            alt={selectedPlace.name}
            className="rounded-lg w-full h-auto mb-4"
          />
          <p className="text-sm text-gray-700">
            Aqui poderá ir mais conteúdo sobre o local.
          </p>
        </div>
      )}

      {/* Mapa */}
      <MapContainer
        center={mapCenter}
        zoom={15}
        scrollWheelZoom
        className="h-full w-full z-0"
      >
        <RecenterMap coords={mapCenter} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        />

        {userPosition && (
          <Marker position={userPosition}>
            <Popup>Sua localização atual</Popup>
            <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent>
              Você
            </Tooltip>
          </Marker>
        )}

        {searchMarker && (
          <Marker position={searchMarker}>
            <Popup>Resultado da busca</Popup>
          </Marker>
        )}

        {accessiblePlaces.map((place, index) => (
          <Marker key={index} position={place.position}>
            <Popup>{place.name}</Popup>
            <Tooltip direction="top" offset={[0, -10]} opacity={0.9}>
              ✅ Acessível
            </Tooltip>
          </Marker>
        ))}

        {nonAccessiblePlaces.map((place, index) => (
          <Marker key={index} position={place.position} icon={redIcon}>
            <Popup>{place.name}</Popup>
            <Tooltip direction="top" offset={[0, -10]} opacity={0.9}>
              ❌ Não acessível
            </Tooltip>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
