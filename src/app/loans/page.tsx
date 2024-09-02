import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import loanTypesData from "@/data/facilityData.json";
import { formatToPersianDate } from "@/utils/formatToPersianDate";
import { formatToPersianNumber } from "@/utils/formatToPersianNumber";
import UserLoans from "@/components/UserLoans";

type LoanApplication = {
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

const Loans: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">تسهیلات</h1>

      <UserLoans />

      {/* JSON Data Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">انواع تسهیلات</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {loanTypesData.data.map((loanType) => (
            <Card key={loanType.id}>
              <CardHeader>
                <CardTitle>{loanType.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">تاریخ ایجاد</TableCell>
                      <TableCell>
                        {formatToPersianDate(loanType.createdDate)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">مبلغ</TableCell>
                      <TableCell>
                        {formatToPersianNumber(loanType.amount)} ریال
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">نرخ سود</TableCell>
                      <TableCell>
                        {formatToPersianNumber(
                          loanType.percentageRate || loanType.interestRate || 0
                        )}
                        %
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">نرخ جریمه</TableCell>
                      <TableCell>
                        {formatToPersianNumber(loanType.penaltyRate)}%
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        دوره بازپرداخت
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {loanType.repaymentType.map((repayment, index) => (
                            <Badge key={index} variant="secondary">
                              {repayment.name}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Loans;
