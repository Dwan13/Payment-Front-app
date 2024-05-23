import { getPayments } from "app/services/mongo/consulta";
import data from "../mockdata";
import React, { useState } from 'react';
import Style from '../StoreLayout.module.sass';
import PayPage from "../payPage";

interface CategoryProps {
  searchParams?: string;
}

export default function Category(props: CategoryProps) {
  return (
    <div className={Style.StoreLayout}>
      <h1>Payments</h1>
      <PayPage data={data}/>
    </div>
  );
}
