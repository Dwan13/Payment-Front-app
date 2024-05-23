"use client";

import React, { useState, useEffect } from "react";
import { FaCreditCard } from "react-icons/fa";
import Style from "./PayLayout.module.sass";
import ChartComponent from "./chart";
import Paginator from "app/components/shared/Paginator"; // Asegúrate de tener este componente creado

interface Payment {
    new_primary_id: string
    Transaction_id: string
    secondary_id: string
    primary_id: string
    Inconsistency_description: string
    collector: string
    Collector_1: string
    Payer: string
    sizeRefundsGtw: number
    idRefundGtw: number
    AmountRefundGtw: number
    StatustRefundGtw: string
    transaction_amount: number
    amount: number
    Site: string
    currency: string
    USD_Amount: string
    Payment_type: string
    Payment_method: string
    Profile_id: string
    captured: boolean
    binary_mode: boolean
    product: string
    business_sub_unit: string
    dateCreatedPay: string
}

interface PagePayProps {
  data?: Payment[];
  userSecondaryId?: string; // Pasar el secondary_id del usuario autenticado como prop
}

export default function PayPage(props: PagePayProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const paymentsPerPage = 10; // Cantidad de pagos por página

  // Filtrar pagos según el secondary_id del usuario autenticado
  let userPayments = props.data;
  if (props.userSecondaryId) {
    userPayments = props.data?.filter(payment => payment.secondary_id === props.userSecondaryId);
  }
  // Lógica para limitar los pagos a mostrar en función de la página actual
  const startIndex = (currentPage - 1) * paymentsPerPage;
  const endIndex = startIndex + paymentsPerPage;
  const currentPayments = userPayments?.slice(startIndex, endIndex); // Utiliza optional chaining para evitar errores si userPayments es undefined

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className={Style.payLayout__content}>
      <div>
        <ul className={Style.payLayout__list}>
          {currentPayments?.map((payment: Payment) => ( // Utiliza optional chaining para evitar errores si currentPayments es undefined
            <li
              className={Style.payLayout__chip}
              key={payment.new_primary_id}
            >
              <div className={Style.payLayout__content_batch}>
                <strong>Site: {payment.Site}</strong>
                <span className={Style.divider} />
                <span>
                  <FaCreditCard /> Payment Type: {payment.Payment_type}{" "}
                </span>
                <span className={Style.divider} />
                <span>
                  ${payment.amount} -{" "}
                  {new Date(payment.dateCreatedPay).toLocaleDateString()}
                </span>
                <span className={Style.payLayout__batch}>
                  {payment.StatustRefundGtw}{" "}
                </span>
              </div>
            </li>
          ))}
        </ul>
        <Paginator
          totalItems={userPayments?.length || 0} // Utiliza optional chaining y el operador de fusión nulo para manejar el caso en que userPayments sea undefined
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
      <div className={Style.contentChart}>
        <ChartComponent data={currentPayments || []} /> {/* Pasa los datos correspondientes a la página actual */}
      </div>
    </div>
  );
}
