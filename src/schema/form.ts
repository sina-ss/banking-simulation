import { z } from "zod";
import { TEXT } from "@/constants/textConstants";

export const formSchema = z.object({
  facilityType: z.string().nonempty(TEXT.HOME.LOAN_FORM.ERROR.FACILITY_TYPE),
  name: z.string().nonempty(TEXT.HOME.LOAN_FORM.ERROR.NAME),
  surname: z.string().nonempty(TEXT.HOME.LOAN_FORM.ERROR.SURNAME),
  nationalCode: z.string().length(10, TEXT.HOME.LOAN_FORM.ERROR.NATIONAL_CODE),
  dateOfBirth: z.string().nonempty(TEXT.HOME.LOAN_FORM.ERROR.DATE_OF_BIRTH),
  contactNumber: z.string().min(10, TEXT.HOME.LOAN_FORM.ERROR.CONTACT_NUMBER),
  accountNumber: z.string().nonempty(TEXT.HOME.LOAN_FORM.ERROR.ACCOUNT_NUMBER),
  shabaNumber: z.string().length(24, TEXT.HOME.LOAN_FORM.ERROR.SHABA_NUMBER),
  averageAnnualBalance: z
    .string()
    .refine(
      (val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0,
      TEXT.HOME.LOAN_FORM.ERROR.AVERAGE_ANNUAL_BALANCE
    ),
  amount: z
    .string()
    .refine(
      (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
      TEXT.HOME.LOAN_FORM.ERROR.AMOUNT
    ),
  repaymentPeriod: z
    .string()
    .refine(
      (val) => !isNaN(parseInt(val)) && parseInt(val) > 0,
      TEXT.HOME.LOAN_FORM.ERROR.REPAYMENT_PERIOD
    ),
});
