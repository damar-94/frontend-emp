export interface LocProvince {
  id: string;
  name: string;
}

export interface LocCity {
  id: string;
  province_id: string;
  name: string;
}