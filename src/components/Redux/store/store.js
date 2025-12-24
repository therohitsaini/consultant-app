import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../slices/UserSlices";
import consultantReducer from "../slices/ConsultantSlices";
import socketReducer from "../slices/sokectSlice";
import callReducer from "../slices/callSlice";

export const store = configureStore({
    reducer: {
        users: userReducer,
        consultants: consultantReducer,
        socket: socketReducer,
        call: callReducer,
        // deletedConsultant: deletedConsultantReducer,    

    },
});
