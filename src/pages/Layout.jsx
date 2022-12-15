import React from 'react';
import { Outlet, Link } from "react-router-dom";

import Header from '../components/Header';

function Layout() {
  return (
    <section>
      <Header />
      <Outlet />
    </section>
  )
};

export default Layout;
