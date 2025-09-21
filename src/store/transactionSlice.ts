import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TransactionState {
  id: number | null;
  method: number | null;
  requisite: string;
  amount: string;
}

const initialState: TransactionState = {
  id: null,
  method: null,
  requisite: '',
  amount: '',
};

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    setTransaction(state, action: PayloadAction<TransactionState>) {
      state.id = action.payload.id;
      state.method = action.payload.method;
      state.requisite = action.payload.requisite;
      state.amount = action.payload.amount;
    },
    clearTransaction(state) {
      state.id = null;
      state.method = null;
      state.requisite = '';
      state.amount = '';
    },
  },
});

export const { setTransaction, clearTransaction } = transactionSlice.actions;
export default transactionSlice.reducer;
