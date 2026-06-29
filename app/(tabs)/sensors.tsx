import { ScrollView, Text, View, Pressable, FlatList } from "react-native";
import { useState, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useSystemSensors } from "@/hooks/use-system-sensors";
import * as Haptics from "expo-haptics";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function SensorsScreen() {
  const colors = useColors();
  const sensors = useSystemSensors();
  const [expandedSensor, setExpandedSensor] = useState<string | null>(null);

  const getIconName = (sensorId: string): any => {
    const iconMap: Record<string, any> = {
      battery: "battery-full",
      connectivity: "wifi",
      storage: "storage",
      device: "phone-iphone",
      humidity: "water-drop",
      gps: "location-on",
      motion: "trending-up",
      bluetooth: "bluetooth",
    };
    return iconMap[sensorId] || "info";
  };

  const getStatusColor = (status: "ok" | "warning" | "error") => {
    switch (status) {
      case "ok":
        return colors.success;
      case "warning":
        return colors.warning;
      case "error":
        return colors.error;
    }
  };

  const okSensors = sensors.getSensorsByStatus("ok");
  const warningSensors = sensors.getSensorsByStatus("warning");
  const errorSensors = sensors.getSensorsByStatus("error");

  const renderSensorCard = (sensor: any) => (
    <Pressable
      key={sensor.id}
      onPress={() => {
        setExpandedSensor(expandedSensor === sensor.id ? null : sensor.id);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }}
      style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
      className="mb-3"
    >
      <View
        className="bg-surface rounded-xl p-4 border-l-4"
        style={{ borderLeftColor: getStatusColor(sensor.status) }}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1 gap-3">
            <View
              className="w-12 h-12 rounded-full items-center justify-center"
              style={{ backgroundColor: getStatusColor(sensor.status) + "20" }}
            >
              <MaterialIcons
                name={getIconName(sensor.id)}
                size={24}
                color={getStatusColor(sensor.status)}
              />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-foreground">
                {sensor.name}
              </Text>
              <Text className="text-sm text-muted">{sensor.value}</Text>
            </View>
          </View>
          <View className="items-center">
            <View
              className="px-2 py-1 rounded-full"
              style={{ backgroundColor: getStatusColor(sensor.status) + "30" }}
            >
              <Text
                className="text-xs font-bold"
                style={{ color: getStatusColor(sensor.status) }}
              >
                {sensors.getStatusLabel(sensor.status)}
              </Text>
            </View>
          </View>
        </View>

        {expandedSensor === sensor.id && (
          <View className="mt-3 pt-3 border-t border-border">
            <Text className="text-sm text-muted leading-relaxed">
              {sensor.details}
            </Text>
            <Text className="text-xs text-muted mt-2">
              Atualizado: {new Date(sensor.lastUpdated).toLocaleTimeString("pt-BR")}
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="p-6 gap-6 flex-1">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">
              Monitoramento de Sensores
            </Text>
            <Text className="text-base text-muted">
              Status em tempo real do seu dispositivo
            </Text>
          </View>

          {/* Status Summary Card */}
          <View className="bg-gradient-to-r from-primary to-primary rounded-xl p-4 gap-3">
            <View className="flex-row justify-between">
              <View className="items-center">
                <Text className="text-3xl font-bold text-white">
                  {sensors.sensors.length}
                </Text>
                <Text className="text-xs text-white opacity-80 mt-1">
                  Sensores
                </Text>
              </View>
              <View className="items-center">
                <Text className="text-3xl font-bold text-white">
                  {okSensors.length}
                </Text>
                <Text className="text-xs text-white opacity-80 mt-1">OK</Text>
              </View>
              <View className="items-center">
                <Text className="text-3xl font-bold text-white">
                  {warningSensors.length}
                </Text>
                <Text className="text-xs text-white opacity-80 mt-1">
                  Avisos
                </Text>
              </View>
              <View className="items-center">
                <Text className="text-3xl font-bold text-white">
                  {errorSensors.length}
                </Text>
                <Text className="text-xs text-white opacity-80 mt-1">
                  Erros
                </Text>
              </View>
            </View>

            {sensors.hasErrors && (
              <View className="bg-white bg-opacity-20 rounded-lg p-2 flex-row items-center gap-2">
                <MaterialIcons name="warning" size={16} color="white" />
                <Text className="text-sm font-semibold text-white">
                  {sensors.errorCount} problema{sensors.errorCount !== 1 ? "s" : ""} detectado{sensors.errorCount !== 1 ? "s" : ""}
                </Text>
              </View>
            )}
          </View>

          {/* Sensors by Status */}
          {errorSensors.length > 0 && (
            <View className="gap-2">
              <View className="flex-row items-center gap-2">
                <MaterialIcons name="error" size={20} color={colors.error} />
                <Text className="text-lg font-bold text-foreground">
                  Erros ({errorSensors.length})
                </Text>
              </View>
              {errorSensors.map(renderSensorCard)}
            </View>
          )}

          {warningSensors.length > 0 && (
            <View className="gap-2">
              <View className="flex-row items-center gap-2">
                <MaterialIcons name="warning" size={20} color={colors.warning} />
                <Text className="text-lg font-bold text-foreground">
                  Avisos ({warningSensors.length})
                </Text>
              </View>
              {warningSensors.map(renderSensorCard)}
            </View>
          )}

          {okSensors.length > 0 && (
            <View className="gap-2">
              <View className="flex-row items-center gap-2">
                <MaterialIcons name="check-circle" size={20} color={colors.success} />
                <Text className="text-lg font-bold text-foreground">
                  Operacional ({okSensors.length})
                </Text>
              </View>
              {okSensors.map(renderSensorCard)}
            </View>
          )}

          {/* Last Update Info */}
          <View className="bg-surface rounded-lg p-3 mt-4">
            <Text className="text-xs text-muted text-center">
              Última atualização: {new Date(sensors.lastRefresh).toLocaleTimeString("pt-BR")}
            </Text>
            <Text className="text-xs text-muted text-center mt-1">
              Atualiza a cada 5 segundos
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
