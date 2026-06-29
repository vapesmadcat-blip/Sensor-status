import { useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface HumidityState {
  isActive: boolean;
  lastReset: number | null;
  currentLevel: number;
  calibrated: boolean;
}

const STORAGE_KEY = "@location_cleaner:humidity";

const DEFAULT_STATE: HumidityState = {
  isActive: true,
  lastReset: null,
  currentLevel: 0,
  calibrated: false,
};

export function useHumiditySensor() {
  const [state, setState] = useState<HumidityState>(DEFAULT_STATE);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar estado do sensor
  const loadState = useCallback(async () => {
    try {
      setIsLoading(true);
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setState(parsed);
      }
    } catch (error) {
      console.error("Erro ao carregar estado do sensor:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Salvar estado do sensor
  const saveState = useCallback(async (newState: HumidityState) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      setState(newState);
    } catch (error) {
      console.error("Erro ao salvar estado do sensor:", error);
    }
  }, []);

  // Resetar sensor de umidade
  const resetSensor = useCallback(async () => {
    const newState: HumidityState = {
      ...state,
      isActive: true,
      lastReset: Date.now(),
      currentLevel: 0,
      calibrated: true,
    };
    await saveState(newState);
    return newState;
  }, [state, saveState]);

  // Atualizar nível de umidade (simulado)
  const updateHumidityLevel = useCallback(
    async (level: number) => {
      const newState: HumidityState = {
        ...state,
        currentLevel: Math.max(0, Math.min(100, level)),
      };
      await saveState(newState);
    },
    [state, saveState]
  );

  // Calibrar sensor
  const calibrateSensor = useCallback(async () => {
    const newState: HumidityState = {
      ...state,
      calibrated: true,
      currentLevel: 50,
    };
    await saveState(newState);
    return newState;
  }, [state, saveState]);

  // Desativar sensor
  const deactivateSensor = useCallback(async () => {
    const newState: HumidityState = {
      ...state,
      isActive: false,
    };
    await saveState(newState);
  }, [state, saveState]);

  // Ativar sensor
  const activateSensor = useCallback(async () => {
    const newState: HumidityState = {
      ...state,
      isActive: true,
    };
    await saveState(newState);
  }, [state, saveState]);

  // Obter tempo desde o último reset
  const getTimeSinceReset = useCallback(() => {
    if (!state.lastReset) return null;
    const now = Date.now();
    const diff = now - state.lastReset;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);

    if (days > 0) return `${days}d atrás`;
    if (hours > 0) return `${hours}h atrás`;
    if (minutes > 0) return `${minutes}m atrás`;
    return "Agora";
  }, [state.lastReset]);

  // Obter status do sensor como string
  const getStatusString = useCallback(() => {
    if (!state.isActive) return "Inativo";
    if (!state.calibrated) return "Não calibrado";
    return `${state.currentLevel}% ✓`;
  }, [state.isActive, state.calibrated, state.currentLevel]);

  return {
    state,
    isLoading,
    resetSensor,
    updateHumidityLevel,
    calibrateSensor,
    deactivateSensor,
    activateSensor,
    getTimeSinceReset,
    getStatusString,
    loadState,
  };
}
