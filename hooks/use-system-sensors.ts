import { useState, useEffect, useCallback } from "react";
import * as Battery from "expo-battery";
import * as Network from "expo-network";
import * as Device from "expo-device";
import * as FileSystem from "expo-file-system/legacy";

export interface SensorStatus {
  id: string;
  name: string;
  icon: string;
  status: "ok" | "warning" | "error";
  value: string;
  details: string;
  lastUpdated: number;
}

export interface SystemSensorsState {
  sensors: SensorStatus[];
  isLoading: boolean;
  lastRefresh: number;
  hasErrors: boolean;
  errorCount: number;
}

const SIMULATED_SENSORS: SensorStatus[] = [
  {
    id: "humidity",
    name: "Umidade",
    icon: "water-drop",
    status: "ok",
    value: "65%",
    details: "Sensor calibrado | Temperatura: 28°C",
    lastUpdated: Date.now(),
  },
  {
    id: "gps",
    name: "GPS",
    icon: "location-on",
    status: "ok",
    value: "Ativo",
    details: "Precisão: 5m | Satélites: 12",
    lastUpdated: Date.now(),
  },
  {
    id: "motion",
    name: "Acelerômetro",
    icon: "trending-up",
    status: "ok",
    value: "Ativo",
    details: "X: 0.2 | Y: 0.1 | Z: 9.8 m/s²",
    lastUpdated: Date.now(),
  },
  {
    id: "bluetooth",
    name: "Bluetooth",
    icon: "bluetooth",
    status: "ok",
    value: "Desativado",
    details: "Nenhum dispositivo pareado",
    lastUpdated: Date.now(),
  },
];

export function useSystemSensors() {
  const [state, setState] = useState<SystemSensorsState>({
    sensors: [],
    isLoading: true,
    lastRefresh: Date.now(),
    hasErrors: false,
    errorCount: 0,
  });

  const updateSensors = useCallback(async () => {
    try {
      const sensors: SensorStatus[] = [...SIMULATED_SENSORS];

      // 1. Bateria
      try {
        const batteryLevel = await Battery.getBatteryLevelAsync();
        const batteryState = await Battery.getBatteryStateAsync();
        const isLow = batteryLevel < 0.2;
        const isCritical = batteryLevel < 0.1;

        sensors.push({
          id: "battery",
          name: "Bateria",
          icon: "battery-full",
          status: isCritical ? "error" : isLow ? "warning" : "ok",
          value: `${Math.round(batteryLevel * 100)}%`,
          details: `Estado: ${batteryState === Battery.BatteryState.CHARGING ? "Carregando" : batteryState === Battery.BatteryState.FULL ? "Completa" : "Descarregando"}`,
          lastUpdated: Date.now(),
        });
      } catch (e) {
        console.log("Erro ao ler bateria:", e);
      }

      // 2. Conectividade
      try {
        const networkState = await Network.getNetworkStateAsync();

        let connStatus: "ok" | "warning" | "error" = "error";
        let connDetails = "Sem conexão";

        if (networkState.isConnected) {
          connStatus = "ok";
          if (networkState.isInternetReachable) {
            const typeStr = String(networkState.type);
            connDetails = `WiFi: ${typeStr.includes("wifi") ? "Conectado" : "Não"} | Móvel: ${typeStr.includes("cellular") ? "Conectado" : "Não"}`;
          } else {
            connStatus = "warning";
            connDetails = "Conectado mas sem internet";
          }
        }

        sensors.push({
          id: "connectivity",
          name: "Conectividade",
          icon: "wifi",
          status: connStatus,
          value: networkState.isConnected ? "Conectado" : "Desconectado",
          details: connDetails,
          lastUpdated: Date.now(),
        });
      } catch (e) {
        console.log("Erro ao ler conectividade:", e);
      }

      // 3. Armazenamento
      try {
        const storageInfo = await FileSystem.getFreeDiskStorageAsync();
        const totalStorage = await FileSystem.getTotalDiskCapacityAsync();
        const percentFree = (storageInfo / totalStorage) * 100;
        const isCritical = percentFree < 5;
        const isLow = percentFree < 15;

        sensors.push({
          id: "storage",
          name: "Armazenamento",
          icon: "storage",
          status: isCritical ? "error" : isLow ? "warning" : "ok",
          value: `${Math.round(percentFree)}% livre`,
          details: `Livre: ${(storageInfo / 1024 / 1024 / 1024).toFixed(1)}GB / Total: ${(totalStorage / 1024 / 1024 / 1024).toFixed(1)}GB`,
          lastUpdated: Date.now(),
        });
      } catch (e) {
        console.log("Erro ao ler armazenamento:", e);
      }

      // 4. Informações do Dispositivo
      try {
        const manufacturer = Device.manufacturer || "Desconhecido";
        const modelName = Device.modelName || "Desconhecido";
        const osVersion = Device.osVersion || "Desconhecido";

        sensors.push({
          id: "device",
          name: "Dispositivo",
          icon: "phone-iphone",
          status: "ok",
          value: `${manufacturer} ${modelName}`,
          details: `Sistema: Android ${osVersion}`,
          lastUpdated: Date.now(),
        });
      } catch (e) {
        console.log("Erro ao ler informações do dispositivo:", e);
      }

      const errorCount = sensors.filter((s) => s.status === "error").length;
      const hasErrors = errorCount > 0;

      setState({
        sensors,
        isLoading: false,
        lastRefresh: Date.now(),
        hasErrors,
        errorCount,
      });
    } catch (error) {
      console.error("Erro ao atualizar sensores:", error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
      }));
    }
  }, []);

  // Atualizar sensores ao montar e a cada 5 segundos
  useEffect(() => {
    updateSensors();
    const interval = setInterval(updateSensors, 5000);
    return () => clearInterval(interval);
  }, [updateSensors]);

  const getSensorsByStatus = (status: "ok" | "warning" | "error") => {
    return state.sensors.filter((s) => s.status === status);
  };

  const getAlertCount = () => {
    return state.sensors.filter((s) => s.status !== "ok").length;
  };

  const getStatusColor = (status: "ok" | "warning" | "error") => {
    switch (status) {
      case "ok":
        return "#22C55E"; // Verde
      case "warning":
        return "#F59E0B"; // Amarelo
      case "error":
        return "#EF4444"; // Vermelho
    }
  };

  const getStatusLabel = (status: "ok" | "warning" | "error") => {
    switch (status) {
      case "ok":
        return "OK";
      case "warning":
        return "Aviso";
      case "error":
        return "Erro";
    }
  };

  return {
    ...state,
    updateSensors,
    getSensorsByStatus,
    getAlertCount,
    getStatusColor,
    getStatusLabel,
  };
}
