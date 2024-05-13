import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser:null,
    error:null,
    loading:false,
};

const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        signInStart: (state)=>{
            state.loading = true;
        },
        signInSuccess:(state, action)=>{
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        sigInFailure: (state,action)=>{
            state.error = action.payload;
            state.loading = false;
        },
        updateUserStart:(state)=>{
            state.loading = true;
        },
        updateUserSuccess: (state, action)=>{
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        updateUserFailure : (state, action)=>{
            state.error = action.payload;
            state.loading = false;
        },
        deletUserStart: (state)=>{
            state.loading = true;
        },
        deletUserSuccess: (state)=>{
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        },
        deletUserFailure: (state, action)=>{
            state.error = action.payload;
            state.loading = false;
        },
    }
})

export const {
    signInFailure, 
    signInStart, 
    signInSuccess, 
    updateUserFailure, 
    updateUserSuccess, 
    updateUserStart, 
    deletUserFailure, 
    deletUserStart, 
    deletUserSuccess
} = userSlice.actions;
export default userSlice.reducer;