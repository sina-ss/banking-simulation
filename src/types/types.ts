export interface LoanFacility {
  id: string;
  createdDate: string;
  name: string;
  repaymentType: { name: string; value: number }[];
  amount: number;
  percentageRate?: number;
  interestRate?: number;
  penaltyRate: number;
}

interface RepaymentType {
  name: string;
  value: number;
}

interface LoanType {
  id: string;
  createdDate: string;
  name: string;
  repaymentType: RepaymentType[];
  amount: number;
  percentageRate?: number;
  interestRate?: number;
  penaltyRate: number;
}

interface LoanTypesData {
  data: LoanType[];
}

export type LoanApplication = {
  facilityType: string;
  name: string;
  surname: string;
  nationalCode: string;
  dateOfBirth: string;
  contactNumber: string;
  accountNumber: string;
  shabaNumber: string;
  averageAnnualBalance: number;
  amount: number;
  repaymentPeriod: number;
  createdDate: string;
  calculatedLoan?: {
    monthlyPayment: number;
    totalPayment: number;
    totalInterest: number;
    annualInterestRate: number;
    lateFee: number;
  };
};
