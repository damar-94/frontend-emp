import type { LocCity, LocProvince } from "@/types/location.types";
import axios from "axios";

const regionalApi = axios.create({
  baseURL: "https://www.emsifa.com/api-wilayah-indonesia/api",
});

export const getProvinces = async (): Promise<LocProvince[]> => {
  try {
    const res = await regionalApi.get("/provinces.json");
    return res.data;
  } catch {
    // Fallback data jika API gagal diakses
    return [
      { id: "1", name: "DKI Jakarta" },
      { id: "2", name: "Jawa Barat" },
      { id: "3", name: "Bali" },
    ];
  }
};

export const getCitiesByProvince = async (
  provinceId: string,
): Promise<LocCity[]> => {
  try {
    const res = await regionalApi.get(`/regencies/${provinceId}.json`);

    return res.data.map((city: LocCity) => ({
      id: city.id,
      province_id: city.province_id,
      name: city.name,
    }));
  } catch {
    return [
      { id: "101", province_id: "1", name: "Jakarta Pusat" },
      { id: "102", province_id: "1", name: "Jakarta Selatan" },
      { id: "201", province_id: "2", name: "Kota Bandung" },
      { id: "301", province_id: "3", name: "Kota Denpasar" },
    ].filter((city) => city.province_id === provinceId);
  }
};
