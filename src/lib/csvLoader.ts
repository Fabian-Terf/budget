import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system/legacy";
import Papa from "papaparse";
import { Platform } from "react-native";

export async function loadCsv(assetModule: number) {
  const asset = Asset.fromModule(assetModule);
  await asset.downloadAsync();

  // WEB → fetch
  if (Platform.OS === "web") {
    const response = await fetch(asset.uri);
    const csvString = await response.text();

    return Papa.parse(csvString, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
    }).data;
  }

  // MOBILE → FileSystem
  const csvString = await FileSystem.readAsStringAsync(asset.localUri!);

  return Papa.parse(csvString, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
  }).data;
}
