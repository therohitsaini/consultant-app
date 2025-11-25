import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../slices/UserSlices";
import consultantReducer from "../slices/ConsultantSlices";
export const store = configureStore({
    reducer: {
        users: userReducer,
        consultants: consultantReducer,
        // deletedConsultant: deletedConsultantReducer,    

    },
});
