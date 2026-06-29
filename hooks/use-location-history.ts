import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface LocationRecord {
  id: string;
  timestamp: number;
  address: string;
  type: "gps" | "wifi" | "cellular";
  latitude?: number;
  longitude?: number;
  selected: boolean;
}

const STORAGE_KEY = "@location_cleaner:history";
const MAX_RECORDS = 1000;

export function useLocationHistory() {
  const [locations, setLocations] = useState<LocationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar histórico do AsyncStorage
  const loadHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setLocations(parsed);
      }
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Salvar histórico no AsyncStorage
  const saveHistory = useCallback(async (newLocations: LocationRecord[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newLocations));
    } catch (error) {
      console.error("Erro ao salvar histórico:", error);
    }
  }, []);

  // Adicionar novo registro de localização
  const addLocation = useCallback(
    async (address: string, type: "gps" | "wifi" | "cellular", latitude?: number, longitude?: number) => {
      const newRecord: LocationRecord = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        address,
        type,
        latitude,
        longitude,
        selected: false,
      };

      const updated = [newRecord, ...locations].slice(0, MAX_RECORDS);
      setLocations(updated);
      await saveHistory(updated);
    },
    [locations, saveHistory]
  );

  // Deletar todos os registros
  const deleteAll = useCallback(async () => {
    setLocations([]);
    await saveHistory([]);
  }, [saveHistory]);

  // Deletar registros selecionados
  const deleteSelected = useCallback(async () => {
    const updated = locations.filter((loc) => !loc.selected);
    setLocations(updated);
    await saveHistory(updated);
    return locations.length - updated.length;
  }, [locations, saveHistory]);

  // Deletar um registro específico
  const deleteLocation = useCallback(
    async (id: string) => {
      const updated = locations.filter((loc) => loc.id !== id);
      setLocations(updated);
      await saveHistory(updated);
    },
    [locations, saveHistory]
  );

  // Alternar seleção de um registro
  const toggleSelection = useCallback((id: string) => {
    setLocations((prev) =>
      prev.map((loc) =>
        loc.id === id ? { ...loc, selected: !loc.selected } : loc
      )
    );
  }, []);

  // Selecionar/desselecionar todos
  const toggleSelectAll = useCallback((selectAll: boolean) => {
    setLocations((prev) =>
      prev.map((loc) => ({ ...loc, selected: selectAll }))
    );
  }, []);

  // Obter registros filtrados
  const getFilteredLocations = useCallback(
    (type: "all" | "gps" | "wifi" | "cellular") => {
      if (type === "all") return locations;
      return locations.filter((loc) => loc.type === type);
    },
    [locations]
  );

  // Contar registros selecionados
  const getSelectedCount = useCallback(() => {
    return locations.filter((loc) => loc.selected).length;
  }, [locations]);

  // Limpar tudo (reset completo)
  const clearAll = useCallback(async () => {
    setLocations([]);
    await AsyncStorage.removeItem(STORAGE_KEY);
  }, []);

  // Carregar histórico ao montar o componente
  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return {
    locations,
    isLoading,
    addLocation,
    deleteAll,
    deleteSelected,
    deleteLocation,
    toggleSelection,
    toggleSelectAll,
    getFilteredLocations,
    getSelectedCount,
    clearAll,
    saveHistory,
  };
}
