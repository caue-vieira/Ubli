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
import addButtonIcon from "@/images/add-button.png";

const center = {
  lat: -3.745,
  lng: -38.523,
};

type PlaceLocation = {
  lat: number;
  lng: number;
  placeId?: string;
};

type PlaceDetails = {
  name: string;
  address: string;
  types?: string[];
};

type AccessibilityFeatures = {
  rampa: boolean;
  elevador: boolean;
  banheiro_acessivel: boolean;
  sinalizacao_tatil: boolean;
  vaga_especial: boolean;
  piso_tatil: boolean;
  acesso_cadeirantes: boolean;
  audio_descricao: boolean;
  braille: boolean;
};

type AccessibilityData = {
  features: AccessibilityFeatures;
  observations: string;
  tipo: string;
  images?: string[];
};

function GoMap() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyCh0P28cr395a0_mzOCw9ZO3BsHhO22dCY",
    libraries: ["places"],
    language: "pt-BR",
    region: "BR",
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [mapCenter, setMapCenter] = useState(center);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<PlaceLocation | null>(
    null
  );
  const [placeDetails, setPlaceDetails] = useState<PlaceDetails | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [userLocation, setUserLocation] =
    useState<google.maps.LatLngLiteral | null>(null);
  const [nearbyPlaces, setNearbyPlaces] = useState<any[]>([]);
  const [showAddOptions, setShowAddOptions] = useState(false);
  const [showAddressSearch, setShowAddressSearch] = useState(false);
  const addressSearchInputRef = useRef<HTMLInputElement | null>(null);
  const [accessibilityData, setAccessibilityData] = useState<
    Record<string, AccessibilityData>
  >({});

  const mapOptions = {
    clickableIcons: true,
    styles: [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "on" }],
      },
      {
        featureType: "poi",
        elementType: "labels.icon",
        stylers: [{ visibility: "on" }],
      },
    ],
  };

  useEffect(() => {
    const savedData = localStorage.getItem("accessibilityData");
    if (savedData) {
      setAccessibilityData(JSON.parse(savedData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "accessibilityData",
      JSON.stringify(accessibilityData)
    );
  }, [accessibilityData]);

  const loadNearbyPlaces = useCallback(
    (location: google.maps.LatLngLiteral) => {
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
    },
    [map]
  );

  const onLoad = useCallback(
    (map: google.maps.Map) => {
      const bounds = new window.google.maps.LatLngBounds(center);
      map.fitBounds(bounds);
      setMap(map);

      const clickListener = map.addListener("click", (event) => {
        if (event.placeId) {
          event.stop();

          const service = new window.google.maps.places.PlacesService(map);
          service.getDetails(
            {
              placeId: event.placeId,
              fields: [
                "name",
                "formatted_address",
                "geometry",
                "types",
                "vicinity",
              ],
            },
            (place, status) => {
              if (status === "OK" && place.geometry?.location) {
                const location = {
                  lat: place.geometry.location.lat(),
                  lng: place.geometry.location.lng(),
                  placeId: event.placeId,
                };
                setSelectedPlace(location);
                setPlaceDetails({
                  name: place.name || "Local desconhecido",
                  address:
                    place.vicinity ||
                    place.formatted_address ||
                    "Endereço não disponível",
                  types: place.types,
                });
              }
            }
          );
        } else {
          setSelectedPlace(null);
        }
      });

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

      return () => {
        google.maps.event.removeListener(clickListener);
      };
    },
    [loadNearbyPlaces]
  );

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
      const location = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      setMapCenter(location);
      map?.panTo(location);
      map?.setZoom(18);
      setSelectedPlace({
        ...location,
        placeId: place.place_id,
      });
      setPlaceDetails({
        name: place.name || "Local desconhecido",
        address: place.formatted_address || "Endereço não disponível",
        types: place.types,
      });
      loadNearbyPlaces(location);
    }
  };

  const handleManualSearch = () => {
    const query = inputRef.current?.value;
    if (!query || !map) return;

    const service = new google.maps.places.PlacesService(map);
    const request = {
      query,
      fields: ["name", "geometry", "place_id", "formatted_address", "types"],
    };

    service.findPlaceFromQuery(request, (results, status) => {
      if (
        status === google.maps.places.PlacesServiceStatus.OK &&
        results &&
        results[0].geometry?.location
      ) {
        const place = results[0];
        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        setMapCenter(location);
        map.panTo(location);
        map.setZoom(18);
        setSelectedPlace({
          ...location,
          placeId: place.place_id,
        });
        setPlaceDetails({
          name: place.name || "Local desconhecido",
          address: place.formatted_address || "Endereço não disponível",
          types: place.types,
        });
        loadNearbyPlaces(location);
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleManualSearch();
    }
  };

  const handleAddWithCurrentLocation = () => {
    if (userLocation) {
      setSelectedPlace(userLocation);
      setPlaceDetails({
        name: "Minha Localização",
        address: "Localização atual do usuário",
      });
      setShowSidebar(true);
      setShowAddOptions(false);
    }
  };

  const handleAddressSearch = () => {
    if (!addressSearchInputRef.current?.value || !map) return;

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode(
      { address: addressSearchInputRef.current.value },
      (results, status) => {
        if (status === "OK" && results?.[0]?.geometry?.location) {
          const location = {
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng(),
          };
          setSelectedPlace(location);
          setPlaceDetails({
            name: results[0].formatted_address || "Endereço pesquisado",
            address: results[0].formatted_address || "Endereço não disponível",
          });
          setShowSidebar(true);
          setShowAddOptions(false);
          setShowAddressSearch(false);
        }
      }
    );
  };

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "100%" }}
      center={mapCenter}
      zoom={15}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={mapOptions}
    >
      {/* Botão flutuante para adicionar novo local */}
      <div className="absolute bottom-5 right-20 z-[1000]">
        <button
          onClick={() => setShowAddOptions(!showAddOptions)}
          className="p-1 w-15 h-15 bg-white text-black rounded-full shadow-lg hover:bg-gray-200 transition flex items-center justify-center"
        >
          <span className="material-icons text-2x1">
            <img className="" src={addButtonIcon} alt="Adicionar" />
          </span>
        </button>
      </div>

      {/* Popup de opções para adicionar */}
      {showAddOptions && (
        <div className="absolute bottom-20 right-6 z-[1000] bg-white p-4 rounded-lg shadow-lg w-64">
          {!showAddressSearch ? (
            <>
              <h3 className="font-semibold mb-3 text-gray-800">
                Adicionar acessibilidade
              </h3>
              <button
                onClick={handleAddWithCurrentLocation}
                className="w-full mb-2 p-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 flex items-center text-sm"
                disabled={!userLocation}
              >
                <span className="material-icons mr-2 text-base">
                  Localização atual
                </span>
              </button>
              <button
                onClick={() => setShowAddressSearch(true)}
                className="w-full p-2 bg-gray-50 text-gray-700 rounded hover:bg-gray-100 flex items-center text-sm"
              >
                <span className="material-icons mr-2 text-base">
                  Buscar por endereço
                </span>
              </button>
            </>
          ) : (
            <div className="space-y-3 z-5">
              <h3 className="font-semibold text-gray-800">Buscar endereço</h3>
              <input
                ref={addressSearchInputRef}
                type="text"
                placeholder="Digite o endereço completo"
                className="w-full p-2 border border-gray-300 rounded text-sm"
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleAddressSearch}
                  className="flex-1 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                >
                  Buscar
                </button>
                <button
                  onClick={() => setShowAddressSearch(false)}
                  className="p-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                >
                  Voltar
                </button>
              </div>
            </div>
          )}
        </div>
      )}

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

      {userLocation && (
        <Marker
          position={userLocation}
          icon={{
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: "#4285F4",
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: "white",
          }}
        />
      )}

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
              placeId: place.place_id,
            });
            setPlaceDetails({
              name: place.name || "Local desconhecido",
              address: place.vicinity || "Endereço não disponível",
              types: place.types,
            });
          }}
        />
      ))}

      {selectedPlace && placeDetails && (
        <InfoWindow
          position={selectedPlace}
          onCloseClick={() => {
            setSelectedPlace(null);
            setPlaceDetails(null);
          }}
          options={{
            disableAutoPan: false,
            maxWidth: 300,
            pixelOffset: new window.google.maps.Size(0, -40),
          }}
        >
          <div className="p-3 min-w-[200px]">
            <h3 className="font-semibold text-lg mb-2 text-gray-800">
              {placeDetails.name}
            </h3>

            {placeDetails.address && (
              <p className="text-sm text-gray-600 mb-3">
                {placeDetails.address}
              </p>
            )}

            {selectedPlace.placeId &&
              accessibilityData[selectedPlace.placeId] && (
                <div className="mb-3">
                  <h4 className="font-medium text-sm mb-1">Acessibilidades:</h4>
                  <ul className="space-y-1">
                    {Object.entries(
                      accessibilityData[selectedPlace.placeId].features
                    )
                      .filter(([_, value]) => value)
                      .map(([key]) => (
                        <li
                          key={key}
                          className="flex items-center text-sm py-1 px-2 bg-blue-50 rounded"
                        >
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                          <span className="capitalize">
                            {key.replace("_", " ")}
                          </span>
                        </li>
                      ))}
                  </ul>
                </div>
              )}

            <button
              onClick={() => setShowSidebar(true)}
              className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              {selectedPlace.placeId && accessibilityData[selectedPlace.placeId]
                ? "Editar informações"
                : "Adicionar informações"}
            </button>
          </div>
        </InfoWindow>
      )}

      {showSidebar && selectedPlace && (
        <div className="absolute top-0 right-0 w-full max-w-md h-full bg-white z-[2000] shadow-xl overflow-y-auto">
          <SidebarForm
            onClose={() => setShowSidebar(false)}
            selectedLocation={selectedPlace}
            placeDetails={placeDetails}
            existingData={
              selectedPlace.placeId
                ? accessibilityData[selectedPlace.placeId]
                : null
            }
            onSave={(placeId, data) => {
              setAccessibilityData((prev) => ({
                ...prev,
                [placeId]: data,
              }));
            }}
          />
        </div>
      )}
    </GoogleMap>
  ) : (
    <div className="flex items-center justify-center h-full">
      <p>Carregando mapa...</p>
    </div>
  );
}

export default React.memo(GoMap);
