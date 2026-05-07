import { z } from "zod";
import type { ContactMessageInput, VolunteerApplicationInput } from "@/lib/firebase/services";

export const contactSchema = z.object({
  name: z.string().min(2, "Ad Soyad en az 2 karakter olmalıdır.").max(100, "Ad Soyad en fazla 100 karakter olabilir."),
  email: z.string().email("Geçerli bir e-posta adresi girin.").max(254, "E-posta adresi çok uzun."),
  phone: z.string().max(20, "Telefon numarası en fazla 20 karakter olabilir.").optional().or(z.literal("")),
  message: z.string().min(10, "Mesaj en az 10 karakter olmalıdır.").max(2000, "Mesaj en fazla 2000 karakter olabilir."),
});
export type ContactFormValues = z.infer<typeof contactSchema>;

export const volunteerSchema = z.object({
  fullName: z.string().min(2, "Ad Soyad en az 2 karakter olmalıdır.").max(100, "Ad Soyad en fazla 100 karakter olabilir."),
  email: z.string().email("Geçerli bir e-posta adresi girin.").max(254, "E-posta adresi çok uzun."),
  phone: z.string().max(20, "Telefon numarası en fazla 20 karakter olabilir.").optional().or(z.literal("")),
  city: z.string().max(100, "Şehir en fazla 100 karakter olabilir.").optional().or(z.literal("")),
  motivation: z.string().min(10, "Motivasyon en az 10 karakter olmalıdır.").max(2000, "Motivasyon en fazla 2000 karakter olabilir."),
});
export type VolunteerFormValues = z.infer<typeof volunteerSchema>;

export function contactFormToInput(values: ContactFormValues): ContactMessageInput {
  return {
    senderName: values.name,
    senderEmail: values.email,
    senderPhone: values.phone || undefined,
    subject: "Web Sitesi İletişim Formu",
    messageBody: values.message,
  };
}

export function volunteerFormToInput(values: VolunteerFormValues): VolunteerApplicationInput {
  return {
    fullName: values.fullName,
    email: values.email,
    phone: values.phone || undefined,
    city: values.city || undefined,
    motivation: values.motivation,
  };
}
