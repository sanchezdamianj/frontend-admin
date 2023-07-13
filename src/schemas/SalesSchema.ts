import { z } from 'zod';

const PAYMENT_METHOD_TYPES = [
  'Credit Card',
  'Debit Card',
  'Debt Compensation',
] as const;

const TIME_UNITS = z.enum(['Days', 'Month', 'Years']);

const saleProductSchema = z.object({
  code: z.string(),
  name: z.string().optional(),
  quantity: z.number(),
  unit_price: z.number(),
  discount: z.number().optional(),
});
const salePaymentMethodSchema = z.object({
  method: z.string(),
  amount: z.number(),
  time_unit: z.string(),
  time_value: z.number(),
});

const saleSchema = z.object({
  operation_date: z.date(),
  products: z.array(saleProductSchema),
  client_document: z.string(),
  payment_method: z.array(salePaymentMethodSchema),
});

type Payment_method = z.infer<typeof salePaymentMethodSchema>;

type Sale = z.infer<typeof saleSchema>;
type ProductFormState = z.infer<typeof saleProductSchema>;

interface Product extends ProductFormState {
  supplier_cost: number;
  iva: number;
  micro: number;
  salvament_cost: number;
  profit_margin: number;
}
interface SaleFormProps {
  saleId?: string;
}

export {
  PAYMENT_METHOD_TYPES,
  TIME_UNITS,
  saleProductSchema,
  salePaymentMethodSchema,
  saleSchema,
  type ProductFormState,
  type Payment_method,
  type Sale,
  type Product,
  type SaleFormProps,
};
