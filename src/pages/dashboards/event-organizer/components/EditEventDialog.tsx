import { getCitiesByProvince, getProvinces } from "@/api/locationApi";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useUpdateEvent } from "@/hooks/API/dashboard/organizerDashboard/useUpdateEvent";
import type { FindOrganizerEvents } from "@/types/dashboard";
import type { LocCity, LocProvince } from "@/types/location.types";
import { useEffect, useState, type FormEvent } from "react";

type OrganizerEvent = FindOrganizerEvents["data"][number];

interface EventCategory {
  id: number;
  name: string;
}

interface EditEventDialogProps {
  event: OrganizerEvent | null;
  categories: EventCategory[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface EditEventForm {
  categoryId: string;
  name: string;
  description: string;
  provinceId: string;
  cityName: string;
  totalSeat: string;
  startDate: string;
  endDate: string;
}

interface InitialLocation {
  cityName: string;
  provinceName: string;
}

const normalizeName = (value: string) =>
  value.trim().toLocaleLowerCase("id-ID");

function toDateTimeInputValue(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const offset = date.getTimezoneOffset() * 60_000;

  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function parseLocation(location: string): InitialLocation {
  const separatorIndex = location.lastIndexOf(",");

  if (separatorIndex === -1) {
    return {
      cityName: location.trim(),
      provinceName: "",
    };
  }

  return {
    cityName: location.slice(0, separatorIndex).trim(),
    provinceName: location.slice(separatorIndex + 1).trim(),
  };
}

function createInitialForm(event: OrganizerEvent): EditEventForm {
  return {
    categoryId: String(event.categoryId),
    name: event.name,
    description: event.description,
    provinceId: "",
    cityName: "",
    totalSeat: String(event.totalSeat),
    startDate: toDateTimeInputValue(event.startDate),
    endDate: toDateTimeInputValue(event.endDate),
  };
}

export default function EditEventDialog({
  event,
  categories,
  open,
  onOpenChange,
}: EditEventDialogProps) {
  const updateEvent = useUpdateEvent(event?.id ?? 0);

  const [provinces, setProvinces] = useState<LocProvince[]>([]);
  const [cities, setCities] = useState<LocCity[]>([]);
  const [locationToMatch, setLocationToMatch] = useState<InitialLocation>({
    cityName: "",
    provinceName: "",
  });

  const [form, setForm] = useState<EditEventForm>({
    categoryId: "",
    name: "",
    description: "",
    provinceId: "",
    cityName: "",
    totalSeat: "",
    startDate: "",
    endDate: "",
  });

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");

  const [provinceError, setProvinceError] = useState("");
  const [cityError, setCityError] = useState("");

  // Memuat daftar provinsi EMSIFA.
  useEffect(() => {
    let cancelled = false;

    const loadProvinces = async () => {
      try {
        setProvinceError("");

        const data = await getProvinces();

        if (!cancelled) {
          setProvinces(data);
        }
      } catch {
        if (!cancelled) {
          setProvinceError("Failed to load provinces.");
        }
      }
    };

    void loadProvinces();

    return () => {
      cancelled = true;
    };
  }, []);

  // Mengisi form berdasarkan event yang dipilih.
  useEffect(() => {
    if (!event || !open || provinces.length === 0) return;

    const parsedLocation = parseLocation(event.location);

    const matchedProvince = provinces.find(
      (province) =>
        normalizeName(province.name) ===
        normalizeName(parsedLocation.provinceName),
    );

    setLocationToMatch(parsedLocation);
    setForm({
      ...createInitialForm(event),
      provinceId: matchedProvince?.id ?? "",
      cityName: "",
    });

    setThumbnailFile(null);
    setFileError("");
    updateEvent.reset();
  }, [event, open, provinces]);

  // Memuat kota berdasarkan provinsi yang dipilih.
  useEffect(() => {
    if (!open || !form.provinceId) {
      setCities([]);
      setCityError("");
      return;
    }

    let cancelled = false;

    const loadCities = async () => {
      try {
        setCityError("");
        setCities([]);

        const data = await getCitiesByProvince(form.provinceId);

        if (cancelled) return;

        setCities(data);

        const selectedProvince = provinces.find(
          (province) => province.id === form.provinceId,
        );

        const isOriginalProvince =
          normalizeName(selectedProvince?.name ?? "") ===
          normalizeName(locationToMatch.provinceName);

        if (isOriginalProvince) {
          const matchedCity = data.find(
            (city) =>
              normalizeName(city.name) ===
              normalizeName(locationToMatch.cityName),
          );

          if (matchedCity) {
            setForm((current) => ({
              ...current,
              cityName: matchedCity.name,
            }));
          }
        }
      } catch {
        if (!cancelled) {
          setCityError("Failed to load cities. Please try again.");
        }
      }
    };

    void loadCities();

    return () => {
      cancelled = true;
    };
  }, [open, form.provinceId, provinces, locationToMatch]);

  const handleChange = (field: keyof EditEventForm, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleProvinceChange = (provinceId: string) => {
    setForm((current) => ({
      ...current,
      provinceId,
      cityName: "",
    }));

    setCities([]);
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;

    setFileError("");
    setThumbnailFile(null);

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setFileError("Please use a JPG, PNG, or WebP image.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFileError("Image size must not exceed 5 MB.");
      e.target.value = "";
      return;
    }

    setThumbnailFile(file);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!event) return;

    if (
      !form.name.trim() ||
      !form.description.trim() ||
      !form.cityName ||
      !form.provinceId ||
      !form.startDate ||
      !form.endDate
    ) {
      return;
    }

    const startDate = new Date(form.startDate);
    const endDate = new Date(form.endDate);
    const totalSeat = Number(form.totalSeat);
    const categoryId = Number(form.categoryId);

    if (
      Number.isNaN(startDate.getTime()) ||
      Number.isNaN(endDate.getTime()) ||
      endDate < startDate
    ) {
      return;
    }

    if (
      !Number.isInteger(categoryId) ||
      categoryId <= 0 ||
      !Number.isInteger(totalSeat) ||
      totalSeat < event.totalSeat
    ) {
      return;
    }

    if (fileError) return;

    const selectedProvince = provinces.find(
      (province) => province.id === form.provinceId,
    );

    if (!selectedProvince) return;

    // Lokasi mengikuti format CreateEventPage.
    const location = `${form.cityName}, ${selectedProvince.name}`;

    // Data event dikirim sebagai JSON string.
    const payload = {
      categoryId,
      name: form.name.trim(),
      description: form.description.trim(),
      location,
      totalSeat,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };

    const formData = new FormData();

    // Thumbnail hanya dikirim jika pengguna memilih file baru.
    if (thumbnailFile) {
      formData.append("thumbnail", thumbnailFile);
    }

    formData.append("data", JSON.stringify(payload));

    updateEvent.mutate(formData, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  const endDateInvalid =
    Boolean(form.startDate) &&
    Boolean(form.endDate) &&
    new Date(form.endDate) < new Date(form.startDate);

  const totalSeatInvalid =
    Boolean(form.totalSeat) &&
    (!Number.isInteger(Number(form.totalSeat)) ||
      Number(form.totalSeat) < (event?.totalSeat ?? 1));

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (updateEvent.isPending) return;
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
          <DialogDescription>
            Update the event information below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="event-name" className="text-sm font-medium">
              Event Name
            </label>
            <Input
              id="event-name"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
              className="focus-visible:ring-[#f4917b] focus-visible:border-[#f4917b] border-input text-[#3d312e]"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="event-category" className="text-sm font-medium">
              Category
            </label>
            <select
              id="event-category"
              value={form.categoryId}
              onChange={(e) => handleChange("categoryId", e.target.value)}
              required
              className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus-visible:ring-[#f4917b] focus-visible:border-[#f4917b] border-input text-[#3d312e] focus-visible:ring-2 "
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="event-description" className="text-sm font-medium">
              Description
            </label>
            <textarea
              id="event-description"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              required
              rows={4}
              className="focus-visible:ring-[#f4917b] focus-visible:border-[#f4917b] border-input text-[#3d312e] flex w-full rounded-md border  bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 "
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="event-province" className="text-sm font-medium">
              Province
            </label>
            <select
              id="event-province"
              value={form.provinceId}
              onChange={(e) => handleProvinceChange(e.target.value)}
              required
              className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus-visible:ring-[#f4917b] focus-visible:border-[#f4917b] border-input text-[#3d312e] focus-visible:ring-2"
            >
              <option value="" disabled>
                Select a province
              </option>
              {provinces.map((province) => (
                <option key={province.id} value={province.id}>
                  {province.name}
                </option>
              ))}
            </select>
            {provinceError && (
              <p role="alert" className="text-sm text-destructive">
                {provinceError}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="event-city" className="text-sm font-medium">
              City / Regency
            </label>
            <select
              id="event-city"
              value={form.cityName}
              onChange={(e) => handleChange("cityName", e.target.value)}
              required
              disabled={!form.provinceId || cities.length === 0}
              className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus-visible:ring-[#f4917b] focus-visible:border-[#f4917b] border-input text-[#3d312e] focus-visible:ring-2"
            >
              <option value="" disabled>
                {!form.provinceId
                  ? "Select a province first"
                  : cityError
                    ? "Failed to load cities"
                    : cities.length === 0
                      ? "Loading cities..."
                      : "Select a city / regency"}
              </option>
              {cities.map((city) => (
                <option key={city.id} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
            {cityError && (
              <p role="alert" className="text-sm text-destructive">
                {cityError}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="event-thumbnail" className="text-sm font-medium ">
              Event Image
            </label>
            <Input
              id="event-thumbnail"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleThumbnailChange}
              className="focus:outline-none focus-visible:ring-[#f4917b] focus-visible:border-[#f4917b] border-input text-[#3d312e] focus-visible:ring-2"
            />
            <p className="text-xs text-muted-foreground">
              JPG, PNG, or WebP. Maximum size: 5 MB. Leave empty to keep the
              existing image.
            </p>
            {fileError && (
              <p role="alert" className="text-sm text-destructive">
                {fileError}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="event-total-seat" className="text-sm font-medium">
              Total Seats
            </label>
            <Input
              id="event-total-seat"
              type="number"
              min={event?.totalSeat ?? 1}
              step={1}
              value={form.totalSeat}
              onChange={(e) => handleChange("totalSeat", e.target.value)}
              required
              className="focus:outline-none focus-visible:ring-[#f4917b] focus-visible:border-[#f4917b] border-input text-[#3d312e] focus-visible:ring-2"
            />
            <p className="text-xs text-muted-foreground">
              Capacity cannot be less than {event?.totalSeat ?? 0}.
            </p>
            {totalSeatInvalid && (
              <p className="text-sm text-destructive">
                Total seats must be a whole number and cannot be lower than the
                current capacity.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="event-start-date" className="text-sm font-medium">
              Start Date and Time
            </label>
            <Input
              id="event-start-date"
              type="datetime-local"
              value={form.startDate}
              onChange={(e) => handleChange("startDate", e.target.value)}
              required
              className="focus:outline-none focus-visible:ring-[#f4917b] focus-visible:border-[#f4917b] border-input text-[#3d312e] focus-visible:ring-2"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="event-end-date" className="text-sm font-medium">
              End Date and Time
            </label>
            <Input
              id="event-end-date"
              type="datetime-local"
              value={form.endDate}
              onChange={(e) => handleChange("endDate", e.target.value)}
              min={form.startDate || undefined}
              required
              className="focus:outline-none focus-visible:ring-[#f4917b] focus-visible:border-[#f4917b] border-input text-[#3d312e] focus-visible:ring-2"
            />
            {endDateInvalid && (
              <p className="text-sm text-destructive">
                End time cannot be earlier than start time.
              </p>
            )}
          </div>

          {updateEvent.isError && (
            <p role="alert" className="text-sm text-destructive">
              {updateEvent.error instanceof Error
                ? updateEvent.error.message
                : "Failed to update the event."}
            </p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={updateEvent.isPending}
              className="text-[#f4917b] "
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={
                updateEvent.isPending ||
                !event ||
                Boolean(provinceError) ||
                Boolean(cityError) ||
                categories.length === 0 ||
                !form.categoryId ||
                !form.provinceId ||
                !form.cityName ||
                provinces.length === 0 ||
                endDateInvalid ||
                totalSeatInvalid ||
                Boolean(fileError)
                
              }
              className="bg-[#f4917b] "
            >
              {updateEvent.isPending
                ? "Uploading and saving..."
                : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
