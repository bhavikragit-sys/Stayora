const { z } = require("zod");

const createBookingSchema = z.object({
  checkIn: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid check-in date",
    }),

  checkOut: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid check-out date",
    }),

  guests: z
    .number()
    .int("Guests must be a whole number")
    .min(1, "At least 1 guest is required"),
});

module.exports = {
  createBookingSchema,
};