"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableRow } from "./ui/table";
import { formatToPersianNumber } from "@/utils/formatToPersianNumber";
import { formatToPersianDate } from "@/utils/formatToPersianDate";
import { LoanApplication } from "@/types/types";

const UserLoans = () => {
  const [userLoans, setUserLoans] = useState<LoanApplication[]>([]);

  useEffect(() => {
    const savedLoans = localStorage.getItem("loanApplications");
    if (savedLoans) {
      setUserLoans(JSON.parse(savedLoans));
      console.log(savedLoans);
    }
  }, []);

  if (userLoans.length === 0) {
    return <p>هیچ درخواست تسهیلاتی یافت نشد.</p>;
  }

  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-4">درخواست‌های تسهیلات شما</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {userLoans.map((loan, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{loan.facilityType}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      نام و نام خانوادگی
                    </TableCell>
                    <TableCell>{`${loan.name} ${loan.surname}`}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">مبلغ وام</TableCell>
                    <TableCell>
                      {formatToPersianNumber(loan.amount)} ریال
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      دوره بازپرداخت
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {formatToPersianNumber(loan.repaymentPeriod)} ماهه
                      </Badge>
                    </TableCell>
                  </TableRow>
                  {loan.calculatedLoan && (
                    <TableRow>
                      <TableCell className="font-medium">قسط ماهانه</TableCell>
                      <TableCell>
                        {formatToPersianNumber(
                          loan.calculatedLoan.monthlyPayment
                        )}{" "}
                        ریال
                      </TableCell>
                    </TableRow>
                  )}
                  {loan.createdDate && (
                    <TableRow>
                      <TableCell className="font-medium">تاریخ ثبت</TableCell>
                      <TableCell>
                        {formatToPersianDate(loan.createdDate)}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default UserLoans;
