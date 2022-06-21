import React, {useEffect} from "react";
import {Route, Routes} from "react-router-dom";
import MetaDataManagementPage from "./MetaDataManagementPage";

const DOCUMENT_TITLE = "AutoML - 메타데이터";

const MAIN_TITLE = "메타데이터"
const TAB_NAMES = ["관리"]

export default function MetaDataPage() {
  useEffect(() => {
    document.title = DOCUMENT_TITLE;
  })

  return (
    <Routes>
      <Route path="management" element={
        <MetaDataManagementPage
          mainTitle={MAIN_TITLE}
          tabNames={TAB_NAMES}
        />}/>
    </Routes>
  )
}
