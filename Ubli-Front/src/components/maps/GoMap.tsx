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
import { AnimatePresence, motion } from "framer-motion";
import ImageCarousel from "@/components/ImageCarousel";

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
  name?: string;
  vicinity?: string;
  formatted_address?: string;
  types?: string[];
  address_components?: any[];
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

// Novo tipo para uma avaliação individual
export type PlaceReview = {
  id: string; // ID único da avaliação
  author: string; // Nome do autor
  rating: number; // Avaliação de 1 a 5
  comment: string; // Comentário em texto
  date: string; // Data da avaliação em formato ISO
};

export type AccessibilityData = {
  features: AccessibilityFeatures;
  reviews: PlaceReview[];
  tipo: string;
  images?: string[];
};

function GoMap() {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyCh0P28cr395a0_mzOCw9ZO3BsHhO22dCY", // Lembre-se de usar uma variável de ambiente para a chave
    libraries: ["places"],
    language: "pt-BR",
    region: "BR",
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [mapCenter, setMapCenter] = useState(center);
  const [markerIcons, setMarkerIcons] = useState<any>(null);
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
  const [isSaving, setIsSaving] = useState(false);

  // --- ADIÇÃO 1: Estado para controlar a busca responsiva ---
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    if (isLoaded && window.google) {
      setMarkerIcons({
        green: {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: "#4CAF50",
          fillOpacity: 1,
          strokeWeight: 1,
          strokeColor: "#ffffff",
          scale: 8,
        },
        yellow: {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: "#FFC107",
          fillOpacity: 1,
          strokeWeight: 1,
          strokeColor: "#ffffff",
          scale: 8,
        },
        red: {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: "#F44336",
          fillOpacity: 1,
          strokeWeight: 1,
          strokeColor: "#ffffff",
          scale: 8,
        },
        user: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: "#4285F4",
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: "white",
        },
      });
    }
  }, [isLoaded]);

  const mapOptions = {
    minZoom: 5,
    fullscreenControl: false,
    streetViewControl: true,
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

  const getMarkerColor = (
    accessibilityData: AccessibilityData | null
  ): string => {
    if (!accessibilityData) return "red";
    const features = accessibilityData.features;
    const totalFeatures = Object.keys(features).length;
    const trueFeatures = Object.values(features).filter((v) => v).length;
    if (trueFeatures === 0) return "red";
    if (trueFeatures < totalFeatures / 2) return "yellow";
    return "green";
  };

  useEffect(() => {
    const savedData = localStorage.getItem("accessibilityData");
    if (savedData) {
      try {
        setAccessibilityData(JSON.parse(savedData));
      } catch (error) {
        console.error("Erro ao carregar dados do localStorage:", error);
      }
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        "accessibilityData",
        JSON.stringify(accessibilityData)
      );
    } catch (error) {
      console.error("Erro ao salvar no localStorage:", error);
    }
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
                "address_components",
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
                  name: place.name,
                  vicinity: place.vicinity,
                  formatted_address: place.formatted_address,
                  types: place.types,
                  address_components: place.address_components,
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
        name: place.name,
        vicinity: place.vicinity,
        formatted_address: place.formatted_address,
        types: place.types,
        address_components: place.address_components,
      });
      loadNearbyPlaces(location);

      //  Fecha o campo de busca no mobile
      setIsSearchOpen(false);
    }
  };

  const handleManualSearch = () => {
    const query = inputRef.current?.value;
    if (!query || !map) return;
    const service = new google.maps.places.PlacesService(map);
    const request = {
      query,
      fields: [
        "name",
        "geometry",
        "place_id",
        "formatted_address",
        "types",
        "vicinity",
        "address_components",
      ],
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
          name: place.name,
          vicinity: place.vicinity,
          formatted_address: place.formatted_address,
          types: place.types,
          address_components: place.address_components,
        });
        loadNearbyPlaces(location);

        // Fecha o campo de busca no mobile
        setIsSearchOpen(false);
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleManualSearch();
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
            formatted_address:
              results[0].formatted_address || "Endereço não disponível",
          });
          setShowSidebar(true);
          setShowAddOptions(false);
          setShowAddressSearch(false);
        }
      }
    );
  };

  const handleSaveData = async (placeId: string, data: AccessibilityData) => {
    if (!selectedPlace) {
      console.error("Nenhum local selecionado para salvar.");
      return false;
    }
    setIsSaving(true);
    try {
      const hasLargeImages = data.images?.some(
        (img) => img.startsWith("data:") && img.length > 5 * 1024 * 1024
      );
      if (hasLargeImages) {
        throw new Error("Algumas imagens são muito grandes (limite de 5MB)");
      }
      const newData = {
        ...data,
        images: data.images?.filter((img) => img) || [],
      };
      const newAccessibilityData = { ...accessibilityData, [placeId]: newData };
      setAccessibilityData(newAccessibilityData);
      setNearbyPlaces((currentPlaces) => {
        const placeExists = currentPlaces.some((p) => p.place_id === placeId);
        if (placeExists) {
          return currentPlaces;
        }
        const newPlaceForMap = {
          place_id: placeId,
          geometry: {
            location: {
              lat: () => selectedPlace.lat,
              lng: () => selectedPlace.lng,
            },
          },
          name: placeDetails?.name || "Local Adicionado",
          vicinity:
            placeDetails?.formatted_address || "Endereço não disponível",
          types: placeDetails?.types || [],
        };
        return [...currentPlaces, newPlaceForMap];
      });
      try {
        localStorage.setItem(
          "accessibilityData",
          JSON.stringify(newAccessibilityData)
        );
      } catch (e) {
        console.warn("Não foi possível salvar no localStorage:", e);
      }
      return true;
    } catch (error) {
      console.error("Erro ao salvar dados:", error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  if (loadError) return <div>Erro ao carregar o Google Maps</div>;

  if (!isLoaded || !markerIcons) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Carregando mapa...</p>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "100%" }}
      center={mapCenter}
      zoom={15}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={mapOptions}
    >
      {/* Botão flutuante para adicionar novo local */}
      <div className="absolute bottom-40 right-2 z-[1000]">
        <button
          onClick={() => setShowAddOptions(!showAddOptions)}
          className="p-1 w-12 h-12 bg-white text-black rounded-full shadow-lg hover:bg-gray-200 transition flex items-center justify-center"
        >
          <span className="material-icons text-2x1">
            <img className="" src={addButtonIcon} alt="Adicionar" />
          </span>
        </button>
      </div>

      {/* Legenda dos marcadores */}
      <div className="absolute bottom-5 left-4 z-[1000] bg-white p-4 rounded shadow">
        <span>
          <b>Legenda dos marcadores:</b>{" "}
        </span>
        <div className="flex items-center mt-2 mb-2">
          <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
          <span className="text-sm">Acessível</span>
        </div>
        <div className="flex items-center mb-2">
          <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
          <span className="text-sm">Parcialmente acessível</span>
        </div>
        <div className="flex items-center mb-2">
          <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
          <span className="text-sm">Sem acessibilidade</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
          <span className="text-sm">Sua localização</span>
        </div>
      </div>

      {/* Popup de opções para adicionar */}
      {showAddOptions && (
        <div className="absolute bottom-30 right-15 z-[1000] bg-white p-4 rounded-lg shadow-lg w-64">
          {!showAddressSearch ? (
            <>
              <h3 className="font-semibold mb-3 text-gray-800">
                Adicionar acessibilidade
              </h3>
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

      {/* --- SUBSTITUIÇÃO: Campo de Busca Responsivo --- */}
      <div className="absolute top-4 right-4 md:right-20 z-[1000]">
        {/* Ícone de Busca (Mobile) */}
        <div className={`${isSearchOpen ? "hidden" : "block"} md:hidden`}>
          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg"
            aria-label="Abrir busca"
          >
            <svg
              className="w-6 h-6 text-gray-700"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>

        {/* Campo de Busca Autocomplete (Desktop ou Mobile aberto) */}
        <div className={`w-80 ${isSearchOpen ? "block" : "hidden"} md:block`}>
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
      </div>

      <div className="absolute top-20 left-4 z-[3]">
        <SidebarTrigger className="bg-white text-black p-2 rounded shadow" />
      </div>

      {userLocation && (
        <Marker position={userLocation} icon={markerIcons.user} />
      )}

      {nearbyPlaces.map((place) => {
        const placeId = place.place_id;
        const accessibility = placeId ? accessibilityData[placeId] : null;
        const color = getMarkerColor(accessibility || null);
        return (
          <Marker
            key={place.place_id}
            position={{
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            }}
            icon={markerIcons[color]}
            onClick={() => {
              setSelectedPlace({
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
                placeId: place.place_id,
              });
              setPlaceDetails({
                name: place.name || "Local desconhecido",
                formatted_address: place.vicinity || "Endereço não disponível",
                types: place.types,
              });
            }}
          />
        );
      })}

      {selectedPlace && placeDetails && (
        <InfoWindow
          position={selectedPlace}
          onCloseClick={() => {
            setSelectedPlace(null);
            setPlaceDetails(null);
          }}
          options={{
            disableAutoPan: false,
            maxWidth: 350,
            pixelOffset: new window.google.maps.Size(0, -40),
          }}
        >
          <div className="p-3 min-w-[200px]">
            {selectedPlace.placeId &&
              accessibilityData[selectedPlace.placeId]?.images &&
              accessibilityData[selectedPlace.placeId].images.length > 0 && (
                <div className="mb-3">
                  <ImageCarousel
                    images={accessibilityData[selectedPlace.placeId].images}
                    className="max-h-48"
                  />
                </div>
              )}
            <h3 className="font-semibold text-lg mb-2 text-gray-800">
              {placeDetails.name}
            </h3>
            {placeDetails.formatted_address && (
              <p className="text-sm text-gray-600 mb-3">
                {placeDetails.formatted_address}
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
        <AnimatePresence>
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute top-0 right-0 w-full max-w-md h-full bg-white z-[2000] shadow-xl overflow-y-auto"
          >
            <SidebarForm
              onClose={() => setShowSidebar(false)}
              selectedLocation={selectedPlace}
              placeDetails={placeDetails}
              existingData={
                selectedPlace.placeId
                  ? accessibilityData[selectedPlace.placeId]
                  : null
              }
              onSave={handleSaveData}
            />
          </motion.div>
        </AnimatePresence>
      )}

      {isSaving && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[3000]">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm">
            <div className="flex items-center space-x-4">
              <svg
                className="animate-spin h-8 w-8 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <div>
                <h3 className="text-lg font-medium">Salvando dados...</h3>
                <p className="text-sm text-gray-600">Por favor, aguarde.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </GoogleMap>
  );
}

export default React.memo(GoMap);
