import React from "react";
import create from "zustand";

interface pdfFileState {
    pdfFileName: string;
    setPdfFileName: (name: string)=>void;
}

const useStore = create<pdfFileState>(
    set=>({
        pdfFileName: "",
        setPdfFileName: (name: string)=>set({pdfFileName: name})
    })
);

export default useStore;