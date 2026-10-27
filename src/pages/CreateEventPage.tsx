import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { axiosInstance } from "@/lib/axios";
import type { LocCity, LocProvince } from "@/types/location.types";
import { Plus, Trash2, Upload } from "lucide-react";
import React, { useState, useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { getCitiesByProvince, getProvinces } from "../api/locationApi";
import { useCategories } from "@/hooks/API/category/useGetCategories";

interface FormValues {
  name: string;
  categoryId: number | undefined;
  provinceId: string;
  cityName: string;
  startDate: string;
  endDate: string;
  description: string;
  tickets: { name: string; price: number; totalSeat: number }[];
  enablePromotion: boolean;
  voucher: {
    code: string;
    discountValue: number;
    maxUsage: number;
    startAt: string;
    expiresAt: string;
    notes: string;
  };
}

export const CreateEventPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // 1. Fetch Categories via TanStack Query hook
  const {
    data: categories,
    isPending: isCategoriesPending,
    isError: isCategoriesError,
  } = useCategories();

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      categoryId: undefined,
      tickets: [{ name: "Regular Entry", price: 0, totalSeat: 100 }],
      enablePromotion: false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "tickets",
  });

  const selectedProvince = watch("provinceId");
  const enablePromotion = watch("enablePromotion");

  // Watched date values for dynamic calendar boundaries
  const watchStartDate = watch("startDate");
  const watchEndDate = watch("endDate");
  const watchVoucherStart = watch("voucher.startAt");

  // 2. Fetch Provinces via TanStack useQuery
  const { data: provinces = [], isPending: isProvincesPending } = useQuery<
    LocProvince[]
  >({
    queryKey: ["provinces"],
    queryFn: async () => {
      try {
        return await getProvinces();
      } catch (err) {
        toast.error("Failed to load provinces.");
        throw err;
      }
    },
  });

  // 3. Fetch Cities via TanStack useQuery (runs automatically when selectedProvince is chosen)
  const { data: cities = [], isPending: isCitiesPending } = useQuery<LocCity[]>(
    {
      queryKey: ["cities", selectedProvince],
      queryFn: async () => {
        try {
          return await getCitiesByProvince(selectedProvince);
        } catch (err) {
          toast.error("Failed to load cities.");
          throw err;
        }
      },
      enabled: Boolean(selectedProvince),
    },
  );

  // 4. Create Event via TanStack useMutation
  const createEventMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await axiosInstance.post("/events", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast.success("Event successfully created!");
      navigate("/events");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || "Failed to create event");
    },
  });

  // Helper to format Date into YYYY-MM-DDTHH:mm for datetime-local min/max
  const formatDateTimeLocal = (date: Date) => {
    const pad = (n: number) => String(n).padStart(2, "0");
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Get current timestamp formatted for input min
  const currentDateTimeString = useMemo(
    () => formatDateTimeLocal(new Date()),
    [],
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const onSubmit = (values: FormValues) => {
    if (!selectedFile) {
      toast.warning("Event thumbnail image is required.");
      return;
    }

    const provinceObj = provinces.find((p) => p.id === values.provinceId);
    const location = `${values.cityName}, ${provinceObj ? provinceObj.name : ""}`;

    const payload = {
      name: values.name,
      categoryId: Number(values.categoryId),
      description: values.description,
      location,
      startDate: values.startDate,
      endDate: values.endDate,
      tickets: values.tickets,
      voucher: values.enablePromotion ? values.voucher : undefined,
    };

    const formData = new FormData();
    formData.append("thumbnail", selectedFile);
    formData.append("data", JSON.stringify(payload));

    createEventMutation.mutate(formData);
  };

  return (
    <div className="bg-[#fbf7f4]">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">
          Create New <span className="text-[#f4917b]">Event</span>
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8 bg-white p-6 rounded-xl border border-[#f4917b] shadow-sm"
        >
          {/* Banner Upload */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Event Poster
            </label>
            <div className="flex items-center gap-4">
              <label className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-[#f4917b] rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 overflow-hidden">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 text-slate-400 mb-2" />
                    <p className="text-sm text-slate-500">
                      Click to upload poster (Max 5MB)
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>

          {/* Core Event Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Event Title
              </label>
              <input
                {...register("name", { required: "Title is required" })}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#f4917b] outline-none"
                placeholder="e.g. Jakarta Rock Wave 2026"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Category
              </label>

              <select
                {...register("categoryId", {
                  required: "Please select a category",
                  valueAsNumber: true,
                })}
                className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#f4917b] outline-none"
                disabled={
                  isCategoriesPending ||
                  isCategoriesError ||
                  !categories?.length
                }
              >
                <option value="">
                  {isCategoriesPending
                    ? "Loading categories..."
                    : isCategoriesError
                      ? "Failed to load categories"
                      : "Select Category"}
                </option>

                {categories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              {errors.categoryId && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.categoryId.message}
                </p>
              )}
            </div>

            {/* Location Pickers */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Province
              </label>
              <select
                {...register("provinceId", { required: true })}
                disabled={isProvincesPending}
                className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#f4917b] outline-none"
              >
                <option value="">
                  {isProvincesPending
                    ? "Loading provinces..."
                    : "Select Province"}
                </option>
                {provinces.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                City / Regency
              </label>
              <select
                {...register("cityName", { required: true })}
                disabled={
                  !selectedProvince || isCitiesPending || !cities.length
                }
                className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#f4917b] outline-none"
              >
                <option value="">
                  {isCitiesPending ? "Loading cities..." : "Select City"}
                </option>
                {cities.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Event Start Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Start Date & Time
              </label>
              <input
                type="datetime-local"
                min={currentDateTimeString}
                {...register("startDate", {
                  required: "Start date is required",
                  validate: (value) =>
                    new Date(value) >= new Date() ||
                    "Start date cannot be in the past",
                })}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#f4917b] outline-none"
              />
              {errors.startDate && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.startDate.message}
                </p>
              )}
            </div>

            {/* Event End Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                End Date & Time
              </label>
              <input
                type="datetime-local"
                min={watchStartDate || currentDateTimeString}
                {...register("endDate", {
                  required: "End date is required",
                  validate: (value) => {
                    if (!watchStartDate) return true;
                    return (
                      new Date(value) >= new Date(watchStartDate) ||
                      "End date must be after start date"
                    );
                  },
                })}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#f4917b] outline-none"
              />
              {errors.endDate && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.endDate.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Event Description
            </label>
            <textarea
              rows={4}
              {...register("description", { required: true })}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#f4917b] outline-none"
              placeholder="Details, lineup, house rules..."
            />
          </div>

          {/* Dynamic Ticket Types */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-slate-900 text-sm">
                Ticket Types & Pricing
              </h3>
              <button
                type="button"
                onClick={() => append({ name: "", price: 0, totalSeat: 50 })}
                className="text-xs flex items-center gap-1 text-[#f4917b] font-bold hover:underline"
              >
                <Plus className="w-3.5 h-3.5" /> Add Tier
              </button>
            </div>

            {/* Header Tabel: disembunyikan di mobile (hidden), muncul di layar >= sm (sm:flex) */}
            <div className="hidden sm:flex gap-3 items-center px-3 py-2 text-xs font-semibold text-slate-600">
              <div className="flex-1 min-w-0">Ticket Name</div>
              <div className="w-32">Price</div>
              <div className="w-24">Seat Quota</div>
              {fields.length > 1 && <div className="w-6" />}
            </div>

            <div className="space-y-3">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex flex-col sm:flex-row gap-3 sm:items-center p-3 rounded-lg border border-[#ffc7b9] bg-white/50"
                >
                  {/* 1. Input Ticket Name (Full width di mobile, flex-1 di desktop) */}
                  <div className="w-full sm:flex-1 min-w-0">
                    <label className="block sm:hidden text-[11px] font-semibold text-slate-600 mb-1">
                      Ticket Name
                    </label>
                    <input
                      placeholder="Ticket Name (e.g. VIP / Free Pass)"
                      {...register(`tickets.${index}.name` as const, {
                        required: true,
                      })}
                      className="w-full px-3 py-1.5 border rounded text-xs bg-white outline-none focus:ring-1 focus:ring-[#f4917b]"
                    />
                  </div>

                  {/* 2. Wrapper Price, Seat Quota & Tombol Hapus (Sebaris rapi di mobile & desktop) */}
                  <div className="flex items-end sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
                    {/* Input Price */}
                    <div className="flex-1 sm:flex-none sm:w-32 min-w-0">
                      <label className="block sm:hidden text-[11px] font-semibold text-slate-600 mb-1">
                        Price (IDR)
                      </label>
                      <input
                        type="number"
                        placeholder="Price (0 for Free)"
                        {...register(`tickets.${index}.price` as const, {
                          required: true,
                          valueAsNumber: true,
                        })}
                        className="w-full px-3 py-1.5 border rounded text-xs bg-white outline-none focus:ring-1 focus:ring-[#f4917b]"
                      />
                    </div>

                    {/* Input Seat Quota */}
                    <div className="flex-1 sm:flex-none sm:w-24 min-w-0">
                      <label className="block sm:hidden text-[11px] font-semibold text-slate-600 mb-1">
                        Seat Quota
                      </label>
                      <input
                        type="number"
                        placeholder="Seat Quota"
                        {...register(`tickets.${index}.totalSeat` as const, {
                          required: true,
                          valueAsNumber: true,
                        })}
                        className="w-full px-3 py-1.5 border rounded text-xs bg-white outline-none focus:ring-1 focus:ring-[#f4917b]"
                      />
                    </div>

                    {/* Tombol Hapus Tier */}
                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="p-1.5 sm:p-1 text-red-500 hover:text-red-700 shrink-0 mb-0.5 sm:mb-0"
                        title="Remove ticket tier"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Limited-time Promotion Voucher */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register("enablePromotion")}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm font-semibold text-slate-900">
                Create Event-Specific Discount Voucher
              </span>
            </label>

            {enablePromotion && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl border border-[#ffc7b9]">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Voucher Code
                  </label>
                  <input
                    {...register("voucher.code", {
                      required: enablePromotion
                        ? "Voucher code is required"
                        : false,
                    })}
                    placeholder="e.g. EARLYBIRD2026"
                    className="w-full px-3 py-2 border rounded-lg text-sm bg-white uppercase"
                  />
                  {errors.voucher?.code && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.voucher.code.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Discount Amount (IDR)
                  </label>
                  <input
                    type="number"
                    {...register("voucher.discountValue", {
                      required: enablePromotion
                        ? "Discount amount is required"
                        : false,
                      valueAsNumber: true,
                    })}
                    placeholder="50000"
                    className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                  />
                  {errors.voucher?.discountValue && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.voucher.discountValue.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Max Usages
                  </label>
                  <input
                    type="number"
                    {...register("voucher.maxUsage", {
                      required: enablePromotion
                        ? "Max usages is required"
                        : false,
                      valueAsNumber: true,
                    })}
                    placeholder="50"
                    className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                  />
                  {errors.voucher?.maxUsage && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.voucher.maxUsage.message}
                    </p>
                  )}
                </div>

                {/* Voucher Start Date */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Voucher Start Date
                  </label>
                  <input
                    type="datetime-local"
                    min={currentDateTimeString}
                    max={watchEndDate || undefined}
                    {...register("voucher.startAt", {
                      required: enablePromotion
                        ? "Voucher start date is required"
                        : false,
                      validate: (value) => {
                        if (!enablePromotion || !value) return true;
                        if (new Date(value) < new Date()) {
                          return "Voucher start date cannot be in the past";
                        }
                        if (
                          watchEndDate &&
                          new Date(value) > new Date(watchEndDate)
                        ) {
                          return "Voucher cannot start after the event ends";
                        }
                        return true;
                      },
                    })}
                    className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#f4917b] outline-none"
                  />
                  {errors.voucher?.startAt && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.voucher.startAt.message}
                    </p>
                  )}
                </div>

                {/* Voucher Expiration Date */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Voucher Expiration Date
                  </label>
                  <input
                    type="datetime-local"
                    min={
                      watchVoucherStart && watchStartDate
                        ? watchVoucherStart > watchStartDate
                          ? watchVoucherStart
                          : watchStartDate
                        : watchVoucherStart ||
                          watchStartDate ||
                          currentDateTimeString
                    }
                    {...register("voucher.expiresAt", {
                      required: enablePromotion
                        ? "Expiration date is required"
                        : false,
                      validate: (value) => {
                        if (!enablePromotion || !value) return true;
                        const expDate = new Date(value);

                        if (
                          watchVoucherStart &&
                          expDate < new Date(watchVoucherStart)
                        ) {
                          return "Expiration date cannot be earlier than voucher start date";
                        }

                        if (
                          watchStartDate &&
                          expDate < new Date(watchStartDate)
                        ) {
                          return "Expiration date cannot be earlier than event start date";
                        }

                        return true;
                      },
                    })}
                    className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#f4917b] outline-none"
                  />
                  {errors.voucher?.expiresAt && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.voucher.expiresAt.message}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={createEventMutation.isPending}
            className="w-full bg-[#f4917b] hover:bg-[#ffc7b9] text-white font-bold py-3 rounded-lg text-sm transition disabled:opacity-50"
          >
            {createEventMutation.isPending
              ? "Publishing Event..."
              : "Publish Event"}
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};
