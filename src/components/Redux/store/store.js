import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../slices/UserSlices";
import consultantReducer from "../slices/ConsultantSlices";
import socketReducer from "../slices/sokectSlice";
export const store = configureStore({
    reducer: {
        users: userReducer,
        consultants: consultantReducer,
        socket: socketReducer,
        // deletedConsultant: deletedConsultantReducer,    

    },
});
