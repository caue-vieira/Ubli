import React, { useRef, useState, useCallback, useEffect } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Autocomplete,
  Marker,
} from "@react-google-maps/api";
import { SidebarTrigger } from "@/components/ui/sidebar";

const center = {
  lat: -3.745,
  lng: -38.523,
};

function GoMap() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyCh0P28cr395a0_mzOCw9ZO3BsHhO22dCY",
    libraries: ["places"],
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [mapCenter, setMapCenter] = useState(center);
  const [userLocation, setUserLocation] =
    useState<google.maps.LatLngLiteral | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const onAutocompleteLoad = (
    autocomplete: google.maps.places.Autocomplete
  ) => {
    autocompleteRef.current = autocomplete;
  };

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current?.getPlace();
    if (place?.geometry?.location) {
      const location = place.geometry.location;
      const latLng = {
        lat: location.lat(),
        lng: location.lng(),
      };
      setMapCenter(latLng);
      map?.panTo(latLng);
    }
  };

  const handleManualSearch = () => {
    const query = inputRef.current?.value;
    if (!query || !map) return;

    const service = new google.maps.places.PlacesService(map);
    const request = {
      query,
      fields: ["name", "geometry"],
    };

    service.findPlaceFromQuery(request, (results, status) => {
      if (
        status === google.maps.places.PlacesServiceStatus.OK &&
        results &&
        results[0].geometry?.location
      ) {
        const location = results[0].geometry.location;
        const latLng = {
          lat: location.lat(),
          lng: location.lng(),
        };
        setMapCenter(latLng);
        map.panTo(latLng);
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleManualSearch(); // aciona busca manual ao pressionar enter
    }
  };

  // Localização do usuário
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(coords);
          setMapCenter(coords);
          map?.panTo(coords);
        },
        (error) => {
          console.error("Erro ao obter localização do usuário:", error);
        }
      );
    }
  }, [map]);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "100%" }}
      center={mapCenter}
      zoom={15}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      {/* Campo de busca */}
      <div className="absolute top-4 right-20 z-[1000] w-80">
        <Autocomplete
          onLoad={onAutocompleteLoad}
          onPlaceChanged={handlePlaceChanged}
        >
          <input
            ref={inputRef}
            type="text"
            onKeyDown={handleKeyDown}
            placeholder="Buscar por endereço ou local..."
            className="w-full px-4 py-3 rounded-full shadow-lg text-black bg-white outline-none border border-gray-300 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
        </Autocomplete>
      </div>

      {/* Botão abre/fecha menu lateral */}
      <div className="absolute top-20 left-4 z-[3]">
        <SidebarTrigger className="bg-white text-black p-2 rounded shadow" />
      </div>

      {/* Marcador de localização do usuário */}
      {userLocation && (
        <Marker
          position={userLocation}
          icon={{
            url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
          }}
          title="Sua localização"
        />
      )}
    </GoogleMap>
  ) : (
    <></>
  );
}

export default React.memo(GoMap);
