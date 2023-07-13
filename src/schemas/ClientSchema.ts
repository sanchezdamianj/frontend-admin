import { z } from 'zod';

export const DOC_TYPES = ['RUC', 'CUIT', 'Cedula', 'Pasaporte'] as const;

export const ClientSchema = z.object({
  firstName: z.string().min(3, 'Must contain more than 3 characters'),
  lastName: z.string().min(3, 'Must contain more than 3 characters'),
  email: z.string().email('Email format invalid'),
  document_type: z.enum(DOC_TYPES),
  document_value: z.string().min(4, 'Minimum 4 characters'),
});

export type Client = z.infer<typeof ClientSchema>;

export interface ClientFormProps {
  clientId?: string;
}

export interface ClientFromDB extends Client {
  _id: string;
  sales?: {
    count: number;
    amount: number;
  };
}
export interface ClientListProps {
  clients: ClientFromDB[];
}
