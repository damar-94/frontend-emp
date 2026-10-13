import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { axiosInstance } from "@/lib/axios";
import type { LocCity, LocProvince } from "@/types/location.types";
import { Plus, Trash2, Upload } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { getCitiesByProvince, getProvinces } from "../api/sumopodApi";

interface FormValues {
  name: string;
  categoryId: number;
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
  const [provinces, setProvinces] = useState<LocProvince[]>([]);
  const [cities, setCities] = useState<LocCity[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      categoryId: 1,
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

  useEffect(() => {
    getProvinces().then(setProvinces);
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      getCitiesByProvince(selectedProvince).then(setCities);
    }
  }, [selectedProvince]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (values: FormValues) => {
    if (!selectedFile) {
      alert("Event thumbnail image is required.");
      return;
    }

    try {
      setLoading(true);
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

      await axiosInstance.post("/events", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Event successfully created!");
      window.location.href = "/events";
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#fbf7f4]">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-10 ">
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
                {...register("categoryId")}
                className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#f4917b] outline-none"
              >
                <option value="1">Music</option>
                <option value="2">Technology</option>
                <option value="3">Workshop</option>
                <option value="4">Sports</option>
              </select>
            </div>

            {/*  Location Pickers */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Province
              </label>
              <select
                {...register("provinceId", { required: true })}
                className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#f4917b] outline-none"
              >
                <option value="">Select Province</option>
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
                disabled={!cities.length}
                className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#f4917b] outline-none"
              >
                <option value="">Select City</option>
                {cities.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Start Date & Time
              </label>
              <input
                type="datetime-local"
                {...register("startDate", { required: true })}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#f4917b] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                End Date & Time
              </label>
              <input
                type="datetime-local"
                {...register("endDate", { required: true })}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#f4917b] outline-none"
              />
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
            <div className="flex gap-3 items-center px-3 py-2 text-xs font-semibold text-slate-600">
              <div className="flex-1">Ticket Name</div>
              <div className="w-32">Price</div>
              <div className="w-24">Seat Quota</div>
              {fields.length > 1 && <div className="w-4" />}{" "}
            </div>

            <div className="space-y-3">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex gap-3 items-center  p-3 rounded-lg border border-[#ffc7b9]"
                >
                  <input
                    placeholder="Ticket Name (e.g. VIP / Free Pass)"
                    {...register(`tickets.${index}.name` as const, {
                      required: true,
                    })}
                    className="flex-1 px-3 py-1.5 border rounded text-xs bg-white"
                  />
                  <input
                    type="number"
                    placeholder="Price (0 for Free)"
                    {...register(`tickets.${index}.price` as const, {
                      required: true,
                      valueAsNumber: true,
                    })}
                    className="w-32 px-3 py-1.5 border rounded text-xs bg-white"
                  />
                  <input
                    type="number"
                    placeholder="Seat Quota"
                    {...register(`tickets.${index}.totalSeat` as const, {
                      required: true,
                      valueAsNumber: true,
                    })}
                    className="w-24 px-3 py-1.5 border rounded text-xs bg-white"
                  />
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4  rounded-xl border border-[#ffc7b9]">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Voucher Code
                  </label>
                  <input
                    {...register("voucher.code")}
                    placeholder="e.g. EARLYBIRD2026"
                    className="w-full px-3 py-2 border rounded-lg text-sm bg-white uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Discount Amount (IDR)
                  </label>
                  <input
                    type="number"
                    {...register("voucher.discountValue", {
                      valueAsNumber: true,
                    })}
                    placeholder="50000"
                    className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Max Usages
                  </label>
                  <input
                    type="number"
                    {...register("voucher.maxUsage", { valueAsNumber: true })}
                    placeholder="50"
                    className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Start Date
                  </label>
                  <input
                    type="datetime-local"
                    {...register("voucher.startAt")}
                    className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Expiration Date
                  </label>
                  <input
                    type="datetime-local"
                    {...register("voucher.expiresAt")}
                    className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                  />
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#f4917b] hover:bg-[#ffc7b9] text-white font-bold py-3 rounded-lg text-sm transition"
          >
            {loading ? "Publishing Event..." : "Publish Event"}
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};
