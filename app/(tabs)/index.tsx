import { ScrollView, Text, View, TouchableOpacity, FlatList, Pressable, Alert } from "react-native";
import { useState, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useLocationHistory } from "@/hooks/use-location-history";
import { useHumiditySensor } from "@/hooks/use-humidity-sensor";
import * as Haptics from "expo-haptics";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function HomeScreen() {
  const colors = useColors();
  const locationHistory = useLocationHistory();
  const humiditySensor = useHumiditySensor();
  const [showHistory, setShowHistory] = useState(false);
  const [filterType, setFilterType] = useState<"all" | "gps" | "wifi" | "cellular">("all");

  const filteredLocations = locationHistory.getFilteredLocations(filterType);
  const selectedCount = locationHistory.getSelectedCount();

  // Inicializar com dados de exemplo na primeira vez
  useEffect(() => {
    if (!locationHistory.isLoading && locationHistory.locations.length === 0) {
      // Adicionar dados de exemplo
      locationHistory.addLocation("Rua das Flores, 123", "gps", -23.5505, -46.6333);
      locationHistory.addLocation("Avenida Principal, 456", "wifi");
      locationHistory.addLocation("Praça Central, 789", "cellular");
      locationHistory.addLocation("Parque Municipal", "gps", -23.5500, -46.6300);
      locationHistory.addLocation("Shopping Center", "wifi");
    }
  }, [locationHistory.isLoading]);

  const handleResetUSB = async () => {
    Alert.alert(
      "Limpar Cache USB",
      `Você tem certeza que deseja apagar ${locationHistory.locations.length} registros de localização?`,
      [
        { text: "Cancelar", onPress: () => {}, style: "cancel" },
        {
          text: "Apagar Tudo",
          onPress: async () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            await locationHistory.deleteAll();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert("Sucesso", "Todos os registros foram apagados!");
          },
          style: "destructive",
        },
      ]
    );
  };

  const handleResetHumidity = async () => {
    Alert.alert(
      "Resetar Sensor de Umidade",
      "Você tem certeza que deseja resetar o sensor de umidade?",
      [
        { text: "Cancelar", onPress: () => {}, style: "cancel" },
        {
          text: "Resetar",
          onPress: async () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            await humiditySensor.resetSensor();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert("Sucesso", `Sensor resetado!\n\nÚltimo reset: ${humiditySensor.getTimeSinceReset()}`);
          },
          style: "destructive",
        },
      ]
    );
  };

  const handleDeleteSelected = async () => {
    const deletedCount = await locationHistory.deleteSelected();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert("Sucesso", `${deletedCount} registros deletados!`);
  };

  const handleToggleLocation = (id: string) => {
    locationHistory.toggleSelection(id);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleSelectAll = () => {
    const allSelected = locationHistory.locations.every(l => l.selected);
    locationHistory.toggleSelectAll(!allSelected);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "gps":
        return "location-on";
      case "wifi":
        return "wifi";
      case "cellular":
        return "signal-cellular-alt";
      default:
        return "location-on";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "gps":
        return "GPS";
      case "wifi":
        return "WiFi";
      case "cellular":
        return "Célula";
      default:
        return "Desconhecido";
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - timestamp;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Agora";
    if (diffMins < 60) return `${diffMins}m atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays < 7) return `${diffDays}d atrás`;
    return date.toLocaleDateString("pt-BR");
  };

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        {!showHistory ? (
          <View className="flex-1 p-6 gap-6">
            {/* Header */}
            <View className="gap-2 mb-4">
              <Text className="text-3xl font-bold text-foreground">Location Cleaner</Text>
              <Text className="text-base text-muted">Gerencie seu histórico de localização e sensor de umidade</Text>
            </View>

            {/* Card Reset USB */}
            <Pressable
              onPress={handleResetUSB}
              style={({ pressed }) => [
                {
                  backgroundColor: colors.primary,
                  borderRadius: 16,
                  padding: 20,
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                },
              ]}
              className="shadow-md"
            >
              <View className="gap-3">
                <View className="flex-row items-center gap-3">
                  <MaterialIcons name="delete-sweep" size={32} color="white" />
                  <Text className="text-xl font-bold text-white flex-1">Limpar Cache USB</Text>
                </View>
                <Text className="text-sm text-white opacity-90">
                  Remove todo o histórico de localização armazenado
                </Text>
                <View className="mt-2 bg-white bg-opacity-20 px-3 py-2 rounded-lg">
                  <Text className="text-sm font-semibold text-white">
                    {locationHistory.locations.length} registros armazenados
                  </Text>
                </View>
              </View>
            </Pressable>

            {/* Card Reset Humidity */}
            <Pressable
              onPress={handleResetHumidity}
              style={({ pressed }) => [
                {
                  backgroundColor: colors.success,
                  borderRadius: 16,
                  padding: 20,
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                },
              ]}
              className="shadow-md"
            >
              <View className="gap-3">
                <View className="flex-row items-center gap-3">
                  <MaterialIcons name="water-drop" size={32} color="white" />
                  <Text className="text-xl font-bold text-white flex-1">Resetar Umidade</Text>
                </View>
                <Text className="text-sm text-white opacity-90">
                  Reinicia o sistema de detecção de umidade
                </Text>
                <View className="mt-2 bg-white bg-opacity-20 px-3 py-2 rounded-lg">
                  <Text className="text-sm font-semibold text-white">
                    Status: {humiditySensor.getStatusString()}
                  </Text>
                </View>
              </View>
            </Pressable>

            {/* Divider */}
            <View className="h-px bg-border my-2" />

            {/* Section: Selecionar Itens */}
            <View className="gap-3">
              <View className="flex-row items-center justify-between">
                <Text className="text-lg font-semibold text-foreground">Histórico de Localização</Text>
                <TouchableOpacity
                  onPress={() => setShowHistory(true)}
                  className="bg-surface px-3 py-2 rounded-lg"
                >
                  <Text className="text-sm font-semibold text-primary">Ver Tudo</Text>
                </TouchableOpacity>
              </View>

              <Text className="text-sm text-muted">
                Escolha quais registros deseja apagar individualmente
              </Text>

              {/* Filter Buttons */}
              <View className="flex-row gap-2 flex-wrap">
                {["all", "gps", "wifi", "cellular"].map((type) => (
                  <TouchableOpacity
                    key={type}
                    onPress={() => setFilterType(type as any)}
                    className={`px-3 py-2 rounded-full ${
                      filterType === type
                        ? "bg-primary"
                        : "bg-surface border border-border"
                    }`}
                  >
                    <Text
                      className={`text-xs font-semibold ${
                        filterType === type ? "text-white" : "text-foreground"
                      }`}
                    >
                      {type === "all" ? "Todos" : type === "gps" ? "GPS" : type === "wifi" ? "WiFi" : "Célula"}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Location List Preview */}
              <View className="bg-surface rounded-xl p-3 gap-2">
                {locationHistory.isLoading ? (
                  <Text className="text-center text-muted py-4">Carregando...</Text>
                ) : filteredLocations.length === 0 ? (
                  <Text className="text-center text-muted py-4">Nenhum registro encontrado</Text>
                ) : (
                  <>
                    {filteredLocations.slice(0, 3).map((loc) => (
                      <Pressable
                        key={loc.id}
                        onPress={() => handleToggleLocation(loc.id)}
                        style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                        className="flex-row items-center gap-3 p-2"
                      >
                        <View
                          className={`w-6 h-6 rounded border-2 items-center justify-center ${
                            loc.selected
                              ? "bg-primary border-primary"
                              : "border-border"
                          }`}
                        >
                          {loc.selected && (
                            <MaterialIcons name="check" size={16} color="white" />
                          )}
                        </View>
                        <MaterialIcons
                          name={getTypeIcon(loc.type)}
                          size={18}
                          color={colors.muted}
                        />
                        <View className="flex-1">
                          <Text className="text-sm font-medium text-foreground">
                            {loc.address}
                          </Text>
                          <Text className="text-xs text-muted">
                            {getTypeLabel(loc.type)} • {formatDate(loc.timestamp)}
                          </Text>
                        </View>
                      </Pressable>
                    ))}

                    {filteredLocations.length > 3 && (
                      <TouchableOpacity
                        onPress={() => setShowHistory(true)}
                        className="p-2 items-center"
                      >
                        <Text className="text-sm font-semibold text-primary">
                          +{filteredLocations.length - 3} mais
                        </Text>
                      </TouchableOpacity>
                    )}
                  </>
                )}
              </View>

              {/* Delete Selected Button */}
              {selectedCount > 0 && (
                <Pressable
                  onPress={handleDeleteSelected}
                  style={({ pressed }) => [
                    {
                      backgroundColor: colors.error,
                      transform: [{ scale: pressed ? 0.97 : 1 }],
                    },
                  ]}
                  className="p-3 rounded-lg items-center"
                >
                  <Text className="text-white font-semibold">
                    Deletar {selectedCount} Selecionado{selectedCount !== 1 ? "s" : ""}
                  </Text>
                </Pressable>
              )}
            </View>
          </View>
        ) : (
          /* Full History View */
          <View className="flex-1 p-6 gap-4">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-2xl font-bold text-foreground">Histórico Completo</Text>
              <TouchableOpacity onPress={() => setShowHistory(false)}>
                <MaterialIcons name="close" size={24} color={colors.foreground} />
              </TouchableOpacity>
            </View>

            {/* Filter Buttons */}
            <View className="flex-row gap-2 flex-wrap">
              {["all", "gps", "wifi", "cellular"].map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => setFilterType(type as any)}
                  className={`px-3 py-2 rounded-full ${
                    filterType === type
                      ? "bg-primary"
                      : "bg-surface border border-border"
                  }`}
                >
                  <Text
                    className={`text-xs font-semibold ${
                      filterType === type ? "text-white" : "text-foreground"
                    }`}
                  >
                    {type === "all" ? "Todos" : type === "gps" ? "GPS" : type === "wifi" ? "WiFi" : "Célula"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Select All */}
            <Pressable
              onPress={handleSelectAll}
              className="flex-row items-center gap-2 p-3 bg-surface rounded-lg"
            >
              <View
                className={`w-6 h-6 rounded border-2 items-center justify-center ${
                  locationHistory.locations.every(l => l.selected)
                    ? "bg-primary border-primary"
                    : "border-border"
                }`}
              >
                {locationHistory.locations.every(l => l.selected) && (
                  <MaterialIcons name="check" size={16} color="white" />
                )}
              </View>
              <Text className="text-sm font-semibold text-foreground">
                Selecionar Todos ({filteredLocations.length})
              </Text>
            </Pressable>

            {/* Full List */}
            {locationHistory.isLoading ? (
              <Text className="text-center text-muted py-8">Carregando...</Text>
            ) : filteredLocations.length === 0 ? (
              <Text className="text-center text-muted py-8">Nenhum registro encontrado</Text>
            ) : (
              <FlatList
                data={filteredLocations}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                renderItem={({ item: loc }) => (
                  <Pressable
                    onPress={() => handleToggleLocation(loc.id)}
                    style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                    className="flex-row items-center gap-3 p-3 bg-surface rounded-lg mb-2"
                  >
                    <View
                      className={`w-6 h-6 rounded border-2 items-center justify-center ${
                        loc.selected
                          ? "bg-primary border-primary"
                          : "border-border"
                      }`}
                    >
                      {loc.selected && (
                        <MaterialIcons name="check" size={16} color="white" />
                      )}
                    </View>
                    <MaterialIcons
                      name={getTypeIcon(loc.type)}
                      size={20}
                      color={colors.primary}
                    />
                    <View className="flex-1">
                      <Text className="text-sm font-medium text-foreground">
                        {loc.address}
                      </Text>
                      <Text className="text-xs text-muted">
                        {getTypeLabel(loc.type)} • {formatDate(loc.timestamp)}
                      </Text>
                    </View>
                  </Pressable>
                )}
              />
            )}

            {/* Delete Selected Button */}
            {selectedCount > 0 && (
              <Pressable
                onPress={handleDeleteSelected}
                style={({ pressed }) => [
                  {
                    backgroundColor: colors.error,
                    transform: [{ scale: pressed ? 0.97 : 1 }],
                  },
                ]}
                className="p-4 rounded-lg items-center mt-4"
              >
                <Text className="text-white font-bold text-base">
                  Deletar {selectedCount} Selecionado{selectedCount !== 1 ? "s" : ""}
                </Text>
              </Pressable>
            )}
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
