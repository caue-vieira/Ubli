import React, { useRef, useState, useCallback, useEffect } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Autocomplete,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { SidebarTrigger } from "@/components/ui/sidebar";
import SidebarForm from "@/components/SidebarForm.tsx";

const center = {
  lat: -3.745,
  lng: -38.523,
};

function GoMap() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyCh0P28cr395a0_mzOCw9ZO3BsHhO22dCY",
    libraries: ["places"],
    language: "pt-BR", // idioma português
    region: "BR", // região Brasil
  });

  // estados
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [mapCenter, setMapCenter] = useState(center);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.LatLngLiteral | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [userLocation, setUserLocation] =
    useState<google.maps.LatLngLiteral | null>(null);

  // Novo estado para lugares próximos
  const [nearbyPlaces, setNearbyPlaces] = useState<any[]>([]);

  // Sua função onLoad original com pequena adição
  const onLoad = useCallback((map: google.maps.Map) => {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    setMap(map);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(location);
          setMapCenter(location);
          map.panTo(location);
          map.setZoom(17);
          loadNearbyPlaces(location);
        },
        () => {
          console.error("Erro ao obter localização do usuário.");
        }
      );
    }
  }, []);

  // função para carregar lugares próximos
  const loadNearbyPlaces = (location: google.maps.LatLngLiteral) => {
    if (!map) return;

    const service = new google.maps.places.PlacesService(map);
    service.nearbySearch(
      {
        location: new google.maps.LatLng(location.lat, location.lng),
        radius: 500,
        type: ["store", "restaurant", "hospital"],
      },
      (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          setNearbyPlaces(results);
        }
      }
    );
  };

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
      map?.setZoom(18);
      setSelectedPlace(latLng);
      loadNearbyPlaces(latLng); // Atualiza lugares ao buscar novo local
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
        map.setZoom(18);
        setSelectedPlace(latLng);
        loadNearbyPlaces(latLng); // Atualiza lugares ao buscar manualmente
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleManualSearch();
    }
  };

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "100%" }}
      center={mapCenter}
      zoom={15}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      {/* conteúdo */}
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

      <div className="absolute top-20 left-4 z-[3]">
        <SidebarTrigger className="bg-white text-black p-2 rounded shadow" />
      </div>

      {/* Marcador do usuário */}
      {userLocation && <Marker position={userLocation} />}

      {/* Marcadores de lugares próximos adicionados */}
      {nearbyPlaces.map((place) => (
        <Marker
          key={place.place_id}
          position={{
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          }}
          onClick={() => {
            setSelectedPlace({
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            });
          }}
        />
      ))}

      {/*InfoWindow*/}
      {selectedPlace && (
        <InfoWindow
          position={selectedPlace}
          onCloseClick={() => setSelectedPlace(null)}
        >
          <div className="flex items-center space-x-2">
            <p>Deseja cadastrar acessibilidade aqui?</p>
            <button
              onClick={() => setShowSidebar(true)}
              className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
            >
              <span className="material-icons">add</span>
            </button>
          </div>
        </InfoWindow>
      )}

      {/* Sidebar */}
      {showSidebar && (
        <div className="absolute top-0 right-0 w-full max-w-md h-full bg-white z-[2000] shadow-xl overflow-y-auto">
          <SidebarForm
            onClose={() => setShowSidebar(false)}
            selectedLocation={selectedPlace}
          />
        </div>
      )}
    </GoogleMap>
  ) : (
    <></>
  );
}

export default React.memo(GoMap);
