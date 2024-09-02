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
import { TEXT } from "@/constants/textConstants";
import { formSchema } from "@/schema/form";
const loanFacilities: LoanFacility[] = loanFacilitiesData.data;

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
            <CardTitle>{TEXT.HOME.LOAN_FORM.FACILITY_TYPE.LABEL}</CardTitle>
            <FormField
              control={form.control}
              name="facilityType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {TEXT.HOME.LOAN_FORM.FACILITY_TYPE.LABEL}
                  </FormLabel>
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
                        <SelectValue
                          placeholder={
                            TEXT.HOME.LOAN_FORM.FACILITY_TYPE.PLACEHOLDER
                          }
                        />
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
            <CardTitle>{TEXT.HOME.LOAN_FORM.PERSONAL_INFO.TITLE}</CardTitle>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {TEXT.HOME.LOAN_FORM.PERSONAL_INFO.NAME}
                  </FormLabel>
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
                  <FormLabel>
                    {TEXT.HOME.LOAN_FORM.PERSONAL_INFO.SURNAME}
                  </FormLabel>
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
                  <FormLabel>
                    {TEXT.HOME.LOAN_FORM.PERSONAL_INFO.NATIONAL_CODE}
                  </FormLabel>
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
                  <FormLabel>
                    {TEXT.HOME.LOAN_FORM.PERSONAL_INFO.DATE_OF_BIRTH}
                  </FormLabel>
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
                  <FormLabel>
                    {TEXT.HOME.LOAN_FORM.PERSONAL_INFO.CONTACT_NUMBER}
                  </FormLabel>
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
            <CardTitle>{TEXT.HOME.LOAN_FORM.BANK_INFO.TITLE}</CardTitle>
            <FormField
              control={form.control}
              name="accountNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {TEXT.HOME.LOAN_FORM.BANK_INFO.ACCOUNT_NUMBER}
                  </FormLabel>
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
                  <FormLabel>
                    {TEXT.HOME.LOAN_FORM.BANK_INFO.SHABA_NUMBER}
                  </FormLabel>
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
                  <FormLabel>
                    {TEXT.HOME.LOAN_FORM.BANK_INFO.AVERAGE_BALANCE}
                  </FormLabel>
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
            <CardTitle>{TEXT.HOME.LOAN_FORM.LOAN_DETAILS.TITLE}</CardTitle>
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {TEXT.HOME.LOAN_FORM.LOAN_DETAILS.AMOUNT}
                  </FormLabel>
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
                  <FormLabel>
                    {TEXT.HOME.LOAN_FORM.LOAN_DETAILS.REPAYMENT_PERIOD}
                  </FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            TEXT.HOME.LOAN_FORM.LOAN_DETAILS
                              .REPAYMENT_PLACEHOLDER
                          }
                        />
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
            <CardTitle>{TEXT.HOME.LOAN_FORM.RESULT.TITLE}</CardTitle>
            {calculatedLoan && (
              <div>
                <p>
                  {TEXT.HOME.LOAN_FORM.RESULT.MONTHLY_PAYMENT}{" "}
                  {calculatedLoan.monthlyPayment} ریال
                </p>
                <p>
                  {TEXT.HOME.LOAN_FORM.RESULT.TOTAL_PAYMENT}{" "}
                  {calculatedLoan.totalPayment} ریال
                </p>
                <p>
                  {TEXT.HOME.LOAN_FORM.RESULT.TOTAL_INTEREST}{" "}
                  {calculatedLoan.totalInterest} ریال
                </p>
                <p>
                  {TEXT.HOME.LOAN_FORM.RESULT.ANNUAL_INTEREST_RATE}{" "}
                  {calculatedLoan.annualInterestRate}%
                </p>
                <p>
                  {TEXT.HOME.LOAN_FORM.RESULT.LATE_FEE} {calculatedLoan.lateFee}{" "}
                  ریال
                </p>
              </div>
            )}
            <p>{TEXT.HOME.LOAN_FORM.RESULT.SUCCESS_MESSAGE}</p>
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
            <CardTitle>{TEXT.HOME.LOAN_FORM.TITLE}</CardTitle>
          </CardHeader>
          <CardContent>{renderStep()}</CardContent>
          <CardFooter className="flex justify-between">
            {step > 0 && (
              <Button type="button" onClick={() => setStep(step - 1)}>
                {TEXT.HOME.LOAN_FORM.BUTTONS.PREVIOUS}
              </Button>
            )}
            {step < 4 ? (
              <Button type="submit">
                {step === 3
                  ? TEXT.HOME.LOAN_FORM.BUTTONS.CALCULATE_AND_SUBMIT
                  : TEXT.HOME.LOAN_FORM.BUTTONS.NEXT}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={() => console.log("Form finalized")}
              >
                {TEXT.HOME.LOAN_FORM.BUTTONS.FINAL_SUBMIT}
              </Button>
            )}
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default LoanApplicationForm;
