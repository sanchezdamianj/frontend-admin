import {
  type ProductFormState,
  type Payment_method,
} from '~/schemas/SalesSchema';

interface DefaultValues {
  [key: string]: Payment_method | ProductFormState;
}

const DEFAULT_VALUES: DefaultValues = {
  payment_method: {
    method: 'Credit Card',
    amount: 0,
    time_unit: 'Days',
    time_value: 0,
  },
  products: {
    code: '',
    name: '',
    quantity: 0,
    unit_price: 0,
  },
};

export default DEFAULT_VALUES;
