import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OcrPassportData } from '../services/api';

interface IIdentificationImages {
  front: File | null;
  back: File | null;
  selfie: File | null;
}

interface OcrState {
  passportData: OcrPassportData | null;
  images: IIdentificationImages;
}

const initialState: OcrState = {
  passportData: null,
  images: {
    front: null,
    back: null,
    selfie: null,
  },
};

const ocrSlice = createSlice({
  name: 'ocr',
  initialState,
  reducers: {
    setPassportData(state, action: PayloadAction<OcrPassportData>) {
      state.passportData = action.payload;
    },
    clearPassportData(state) {
      state.passportData = null;
    },
    setIdentificationImages: (
      state,
      action: PayloadAction<IIdentificationImages>
    ) => {
      state.images = action.payload;
    },
  },
});

export const { setPassportData, clearPassportData, setIdentificationImages } = ocrSlice.actions;
export default ocrSlice.reducer;
