"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { LoanFacility } from "@/types/types";
import loanFacilitiesData from "@/data/facilityData.json";
const loanFacilities: LoanFacility[] = loanFacilitiesData.data;

// Define the form schema
const formSchema = z.object({
  facilityType: z.string().nonempty("لطفاً نوع تسهیلات را انتخاب کنید"),
  name: z.string().nonempty("نام الزامی است"),
  surname: z.string().nonempty("نام خانوادگی الزامی است"),
  nationalCode: z.string().length(10, "کد ملی باید 10 رقم باشد"),
  dateOfBirth: z.string().nonempty("تاریخ تولد الزامی است"),
  contactNumber: z.string().min(10, "شماره تماس باید حداقل 10 رقم باشد"),
  accountNumber: z.string().nonempty("شماره حساب الزامی است"),
  shabaNumber: z.string().length(24, "شماره شبا باید 24 رقم باشد"),
  averageAnnualBalance: z
    .string()
    .refine(
      (val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0,
      "میانگین موجودی سالانه باید عدد مثبت باشد"
    ),
  amount: z
    .string()
    .refine(
      (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
      "مبلغ وام باید بیشتر از صفر باشد"
    ),
  repaymentPeriod: z
    .string()
    .refine(
      (val) => !isNaN(parseInt(val)) && parseInt(val) > 0,
      "دوره بازپرداخت باید بیشتر از صفر باشد"
    ),
});

type FormValues = z.infer<typeof formSchema>;

const LoanApplicationForm: React.FC = () => {
  const [step, setStep] = useState(0);
  const [calculatedLoan, setCalculatedLoan] = useState<any>(null);
  const [selectedFacility, setSelectedFacility] = useState<LoanFacility | null>(
    null
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      facilityType: "",
      name: "",
      surname: "",
      nationalCode: "",
      dateOfBirth: "",
      contactNumber: "",
      accountNumber: "",
      shabaNumber: "",
      averageAnnualBalance: "",
      amount: "",
      repaymentPeriod: "",
    },
  });

  useEffect(() => {
    const savedData = localStorage.getItem("loanApplicationData");
    if (savedData) {
      form.reset(JSON.parse(savedData));
    }
  }, []);

  const onSubmit = (data: FormValues) => {
    const parsedData = {
      ...data,
      averageAnnualBalance: parseFloat(data.averageAnnualBalance),
      amount: parseFloat(data.amount),
      repaymentPeriod: parseInt(data.repaymentPeriod),
    };

    if (step < 3) {
      setStep(step + 1);
    } else {
      // Calculate loan details
      let calculatedLoanDetails = null;
      if (selectedFacility) {
        const interestRate =
          selectedFacility.percentageRate || selectedFacility.interestRate || 0;
        const monthlyInterestRate = interestRate / 12 / 100;
        const totalMonths = parsedData.repaymentPeriod;
        const loanAmount = parsedData.amount;

        // Calculate monthly payment using the formula
        const monthlyPayment =
          (loanAmount *
            monthlyInterestRate *
            Math.pow(1 + monthlyInterestRate, totalMonths)) /
          (Math.pow(1 + monthlyInterestRate, totalMonths) - 1);
        const totalPayment = monthlyPayment * totalMonths;
        const totalInterest = totalPayment - loanAmount;
        const lateFee = loanAmount * (selectedFacility.penaltyRate / 100);

        calculatedLoanDetails = {
          monthlyPayment: Math.round(monthlyPayment),
          totalPayment: Math.round(totalPayment),
          totalInterest: Math.round(totalInterest),
          annualInterestRate: interestRate,
          lateFee: Math.round(lateFee),
        };

        setCalculatedLoan(calculatedLoanDetails);
      }

      // Prepare the new loan application object
      const newLoanApplication = {
        ...parsedData,
        calculatedLoan: calculatedLoanDetails,
        createdDate: new Date().toISOString(),
      };

      // Retrieve existing loans from localStorage
      const existingLoansJSON = localStorage.getItem("loanApplications");
      let existingLoans = existingLoansJSON
        ? JSON.parse(existingLoansJSON)
        : [];

      // Ensure existingLoans is an array
      if (!Array.isArray(existingLoans)) {
        existingLoans = [];
      }

      // Add the new loan application to the array
      existingLoans.push(newLoanApplication);

      // Save the updated array back to localStorage
      localStorage.setItem("loanApplications", JSON.stringify(existingLoans));

      setStep(4);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <>
            <CardTitle>انتخاب نوع تسهیلات</CardTitle>
            <FormField
              control={form.control}
              name="facilityType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نوع تسهیلات</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedFacility(
                        loanFacilities.find((f) => f.id === value) || null
                      );
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="انتخاب نوع تسهیلات" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {loanFacilities.map((facility) => (
                        <SelectItem key={facility.id} value={facility.id}>
                          {facility.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );
      case 1:
        return (
          <>
            <CardTitle>اطلاعات شخصی</CardTitle>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نام</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="surname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نام خانوادگی</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nationalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>کد ملی</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>تاریخ تولد</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>شماره تماس</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );
      case 2:
        return (
          <>
            <CardTitle>اطلاعات بانکی</CardTitle>
            <FormField
              control={form.control}
              name="accountNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>شماره حساب</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shabaNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>شماره شبا</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="averageAnnualBalance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>میانگین موجودی سالانه (ریال)</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      inputMode="numeric"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );
      case 3:
        return (
          <>
            <CardTitle>جزئیات وام</CardTitle>
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>مبلغ وام (ریال)</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      inputMode="numeric"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="repaymentPeriod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>دوره بازپرداخت</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="انتخاب دوره بازپرداخت" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {selectedFacility?.repaymentType.map((type) => (
                        <SelectItem
                          key={type.value}
                          value={type.value.toString()}
                        >
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );
      case 4:
        return (
          <>
            <CardTitle>نتیجه درخواست</CardTitle>
            {calculatedLoan && (
              <div>
                <p>مبلغ قسط ماهانه: {calculatedLoan.monthlyPayment} ریال</p>
                <p>کل مبلغ بازپرداخت: {calculatedLoan.totalPayment} ریال</p>
                <p>کل سود: {calculatedLoan.totalInterest} ریال</p>
                <p>نرخ سود سالانه: {calculatedLoan.annualInterestRate}%</p>
                <p>جریمه دیرکرد: {calculatedLoan.lateFee} ریال</p>
              </div>
            )}
            <p>درخواست شما با موفقیت ثبت شد.</p>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>درخواست تسهیلات</CardTitle>
          </CardHeader>
          <CardContent>{renderStep()}</CardContent>
          <CardFooter className="flex justify-between">
            {step > 0 && (
              <Button type="button" onClick={() => setStep(step - 1)}>
                قبلی
              </Button>
            )}
            {step < 4 ? (
              <Button type="submit">
                {step === 3 ? "محاسبه و ثبت" : "بعدی"}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={() => console.log("Form finalized")}
              >
                ثبت نهایی
              </Button>
            )}
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default LoanApplicationForm;
