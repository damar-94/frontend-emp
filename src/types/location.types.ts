export interface SumopodProvince {
  id: string;
  name: string;
}

export interface SumopodCity {
  id: string;
  province_id: string;
  name: string;
}