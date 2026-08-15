import type { MunicipalityShape } from "./fukuoka";

export interface MunicipalityMapModule {
  MUNICIPALITY_MAP_VIEWBOX: string;
  MUNICIPALITY_SHAPES: MunicipalityShape[];
  REMOTE_MUNICIPALITY_IDS: string[];
}

// 全都道府県分の市区町村地図データ。追加・更新するには
// scripts/build-municipality-map.js でデータを生成し、ここにエントリを足す。
export const MUNICIPALITY_MAP_REGISTRY: Record<string, () => Promise<MunicipalityMapModule>> = {
  hokkaido: () => import("./hokkaido"),
  aomori: () => import("./aomori"),
  iwate: () => import("./iwate"),
  miyagi: () => import("./miyagi"),
  akita: () => import("./akita"),
  yamagata: () => import("./yamagata"),
  fukushima: () => import("./fukushima"),
  ibaraki: () => import("./ibaraki"),
  tochigi: () => import("./tochigi"),
  gunma: () => import("./gunma"),
  saitama: () => import("./saitama"),
  chiba: () => import("./chiba"),
  tokyo: () => import("./tokyo"),
  kanagawa: () => import("./kanagawa"),
  niigata: () => import("./niigata"),
  toyama: () => import("./toyama"),
  ishikawa: () => import("./ishikawa"),
  fukui: () => import("./fukui"),
  yamanashi: () => import("./yamanashi"),
  nagano: () => import("./nagano"),
  gifu: () => import("./gifu"),
  shizuoka: () => import("./shizuoka"),
  aichi: () => import("./aichi"),
  mie: () => import("./mie"),
  shiga: () => import("./shiga"),
  kyoto: () => import("./kyoto"),
  osaka: () => import("./osaka"),
  hyogo: () => import("./hyogo"),
  nara: () => import("./nara"),
  wakayama: () => import("./wakayama"),
  tottori: () => import("./tottori"),
  shimane: () => import("./shimane"),
  okayama: () => import("./okayama"),
  hiroshima: () => import("./hiroshima"),
  yamaguchi: () => import("./yamaguchi"),
  tokushima: () => import("./tokushima"),
  kagawa: () => import("./kagawa"),
  ehime: () => import("./ehime"),
  kochi: () => import("./kochi"),
  fukuoka: () => import("./fukuoka"),
  saga: () => import("./saga"),
  nagasaki: () => import("./nagasaki"),
  kumamoto: () => import("./kumamoto"),
  oita: () => import("./oita"),
  miyazaki: () => import("./miyazaki"),
  kagoshima: () => import("./kagoshima"),
  okinawa: () => import("./okinawa"),
};

export function hasMunicipalityMap(prefId: string): boolean {
  return prefId in MUNICIPALITY_MAP_REGISTRY;
}
