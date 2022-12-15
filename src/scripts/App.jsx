import React from 'react';

import Layout from "../pages/Layout";
import Home from "../pages/Home";
import Books from "../pages/Books";
import Manga from "../pages/Manga";
import List from "../pages/List";
import NoPage from "../pages/NoPage";

import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/index.html" element={<Home />} />
          <Route path="/books" element={<Books />} />
          <Route path="/manga/:id" element={<Manga />} />
          <Route path="/list/" element={<List />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
