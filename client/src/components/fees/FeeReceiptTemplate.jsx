import React, { forwardRef } from 'react';
import { amountInWords } from '../../utils/numberToWords';

const FeeReceiptTemplate = forwardRef(({ payment }, ref) => {
  if (!payment || !payment.student) return null;

  const { student } = payment;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  return (
    <div 
      ref={ref}
      className="print-container bg-white p-8 max-w-[800px] mx-auto border border-gray-400 text-gray-900 shadow-md font-sans text-[11px] leading-relaxed relative flex flex-col justify-between"
      style={{ minHeight: '297mm', color: '#111' }}
    >
      <div>
        {/* 1. College-style Header layout */}
        <div className="flex items-center justify-between border-b border-gray-450 pb-3">
          <div className="flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="Logo" 
              className="h-14 w-14 object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <div>
              <h1 className="text-sm font-black tracking-widest text-gray-950 uppercase leading-none">
                B.R. International Sr. Sec. School
              </h1>
              <p className="text-[9px] text-gray-500 font-semibold leading-tight mt-1">
                Atta, Gulaothi-Saidpur Road, Bulandshahr (BSR), Uttar Pradesh - 203412
              </p>
              <p className="text-[8px] text-gray-400 leading-tight">
                Phone: 9536026897, 9410442828 | Email: contact@bris.edu.in | Website: www.bris.edu.in
              </p>
            </div>
          </div>
        </div>

        {/* 2. Sub-Header Row: Receipt No / Title / Copy identifier */}
        <div className="flex justify-between items-center border-b border-gray-300 py-1.5 font-bold tracking-wider px-1 text-gray-950">
          <span>Receipt No: {payment.receiptNo}</span>
          <span className="text-xs uppercase underline tracking-widest">Fee Receipt</span>
          <span className="text-[10px] italic">Student Copy</span>
        </div>

        {/* 3. Two-Column Detail Block (Adapted from demo) */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 py-4 border-b border-gray-300">
          {/* LEFT Column */}
          <div className="space-y-1">
            <div className="flex">
              <span className="w-24 font-bold text-gray-950">Receipt No</span>
              <span className="px-1">:</span>
              <span className="flex-1 font-semibold">{payment.receiptNo}</span>
            </div>
            <div className="flex">
              <span className="w-24 font-bold text-gray-950">Serial No</span>
              <span className="px-1">:</span>
              <span className="flex-1 font-bold text-navy-900">{student.serialNo}</span>
            </div>
            <div className="flex">
              <span className="w-24 font-bold text-gray-950">Student Name</span>
              <span className="px-1">:</span>
              <span className="flex-1 font-bold uppercase">{student.firstName} {student.lastName}</span>
            </div>
            <div className="flex">
              <span className="w-24 font-bold text-gray-950">Father's Name</span>
              <span className="px-1">:</span>
              <span className="flex-1 font-semibold">Mr. {student.fatherName}</span>
            </div>
            <div className="flex">
              <span className="w-24 font-bold text-gray-950">Address</span>
              <span className="px-1">:</span>
              <span className="flex-1 text-gray-700 leading-tight">
                {student.address?.current}, {student.address?.city}
              </span>
            </div>
          </div>

          {/* RIGHT Column */}
          <div className="space-y-1 pl-4">
            <div className="flex">
              <span className="w-28 font-bold text-gray-950">Receipt Date</span>
              <span className="px-1">:</span>
              <span className="flex-1 font-semibold">{formatDate(payment.receiptDate)}</span>
            </div>
            <div className="flex">
              <span className="w-28 font-bold text-gray-950">APAAR ID</span>
              <span className="px-1">:</span>
              <span className="flex-1 font-semibold">{student.apaarId || 'N/A'}</span>
            </div>
            <div className="flex">
              <span className="w-28 font-bold text-gray-950">Academic Year</span>
              <span className="px-1">:</span>
              <span className="flex-1 font-semibold">{payment.academicYear}</span>
            </div>
            <div className="flex">
              <span className="w-28 font-bold text-gray-950">Class & Section</span>
              <span className="px-1">:</span>
              <span className="flex-1 font-bold text-navy-900">{student.class} - {student.section}</span>
            </div>
            <div className="flex">
              <span className="w-28 font-bold text-gray-950">Category</span>
              <span className="px-1">:</span>
              <span className="flex-1 font-semibold">{student.category}</span>
            </div>
          </div>
        </div>

        {/* 4. Fee Detail Table (Column structure identical to reference) */}
        <div className="mt-4">
          <h3 className="font-bold text-gray-950 uppercase tracking-widest mb-1">Fee Particulars</h3>
          <table className="w-full text-left border-collapse border border-gray-400">
            <thead className="bg-gray-50 border-b border-gray-400 font-bold text-gray-950">
              <tr>
                <th className="border border-gray-400 px-2 py-1.5 text-center w-12">S No</th>
                <th className="border border-gray-400 px-2 py-1.5 w-24">Due Date</th>
                <th className="border border-gray-400 px-2 py-1.5">Particulars</th>
                <th className="border border-gray-400 px-2 py-1.5 text-right w-24">Dues (Rs.)</th>
                <th className="border border-gray-400 px-2 py-1.5 text-right w-24">Received (Rs.)</th>
                <th className="border border-gray-400 px-2 py-1.5 text-right w-24">Balance (Rs.)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300">
              {payment.feeItems.map((item, idx) => (
                <tr key={idx}>
                  <td className="border border-gray-400 px-2 py-1.5 text-center">{idx + 1}</td>
                  <td className="border border-gray-400 px-2 py-1.5">{formatDate(item.dueDate)}</td>
                  <td className="border border-gray-400 px-2 py-1.5 font-medium">{item.particular}</td>
                  <td className="border border-gray-400 px-2 py-1.5 text-right font-semibold">{item.dues.toFixed(2)}</td>
                  <td className="border border-gray-400 px-2 py-1.5 text-right font-semibold text-schoolGreen-850" style={{ color: '#2e7d32' }}>{item.received.toFixed(2)}</td>
                  <td className="border border-gray-400 px-2 py-1.5 text-right font-semibold text-red-650" style={{ color: '#c62828' }}>{item.balance.toFixed(2)}</td>
                </tr>
              ))}
              
              {/* Total Summaries row */}
              <tr className="bg-gray-50 border-t-2 border-gray-400 font-bold text-gray-950">
                <td className="border border-gray-400 px-2 py-2 text-right" colSpan={3}>Total</td>
                <td className="border border-gray-400 px-2 py-2 text-right">{payment.totalDues.toFixed(2)}</td>
                <td className="border border-gray-400 px-2 py-2 text-right" style={{ color: '#2e7d32' }}>{payment.totalReceived.toFixed(2)}</td>
                <td className="border border-gray-400 px-2 py-2 text-right text-red-650" style={{ color: '#c62828' }}>{payment.totalBalance.toFixed(2)}</td>
              </tr>
              {/* Adjustable row (matches demo layout) */}
              <tr className="font-bold text-gray-500">
                <td className="border border-gray-400 px-2 py-1 text-right" colSpan={5}>Adjustable :</td>
                <td className="border border-gray-400 px-2 py-1 text-right">0.00</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 5. Payment Details table (cash / online / checks) */}
        <div className="mt-4">
          <h3 className="font-bold text-gray-950 uppercase tracking-widest mb-1">Payment Details</h3>
          <table className="w-full text-left border-collapse border border-gray-400">
            <thead className="bg-gray-50 border-b border-gray-400 font-bold text-gray-950">
              <tr>
                <th className="border border-gray-400 px-2 py-1 text-center w-12">S No</th>
                <th className="border border-gray-400 px-2 py-1 w-20">Mode</th>
                <th className="border border-gray-400 px-2 py-1">Bank Name</th>
                <th className="border border-gray-400 px-2 py-1 w-28">Cheque/DD No</th>
                <th className="border border-gray-400 px-2 py-1 w-24">Cheque/DD Date</th>
                <th className="border border-gray-400 px-2 py-1">Payable At</th>
                <th className="border border-gray-400 px-2 py-1 text-right w-24">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-400 px-2 py-1 text-center">1</td>
                <td className="border border-gray-400 px-2 py-1 font-bold text-navy-900">{payment.paymentMode}</td>
                <td className="border border-gray-400 px-2 py-1">{payment.bankDetails?.bank || 'N/A'}</td>
                <td className="border border-gray-400 px-2 py-1">{payment.bankDetails?.chequeNo || 'N/A'}</td>
                <td className="border border-gray-400 px-2 py-1">{payment.bankDetails?.chequeDate ? formatDate(payment.bankDetails.chequeDate) : 'N/A'}</td>
                <td className="border border-gray-400 px-2 py-1">{payment.payableAt || 'N/A'}</td>
                <td className="border border-gray-400 px-2 py-1 text-right font-bold">{payment.totalReceived.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 6. mini reference table (mirroring college demo visual balances) */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            {payment.remark && (
              <p className="text-[10px] text-gray-500 font-medium">
                <span className="font-bold text-gray-900">Remarks:</span> {payment.remark}
              </p>
            )}
          </div>
          <div>
            <table className="w-full border-collapse border border-gray-300 text-[9px] text-gray-500">
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-2 py-1 bg-gray-50 font-bold">S No. To Be Received From</td>
                  <td className="border border-gray-300 px-2 py-1 font-bold">Ref No.</td>
                  <td className="border border-gray-300 px-2 py-1 text-right font-bold">Amount</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-2 py-1">1</td>
                  <td className="border border-gray-300 px-2 py-1">N/A</td>
                  <td className="border border-gray-300 px-2 py-1 text-right">0.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 7. Rupees Word acknowledgement */}
        <div className="mt-5 bg-gray-50 border border-gray-300 rounded-sm p-3 font-bold text-navy-900 text-[10px] uppercase tracking-wider italic text-center">
          WE THANKFULLY ACKNOWLEDGE THE RECEIPT OF (₹{payment.totalReceived.toFixed(2)}) 
          <br />
          <span className="text-gray-950 font-extrabold">(Rupees {amountInWords(payment.totalReceived)} only)</span>
        </div>
      </div>

      {/* 8. Signature stamps */}
      <div className="mt-8 flex justify-between items-end text-[9px] font-bold uppercase tracking-wider text-gray-900">
        <div>
          <p className="text-gray-400">Cashier Counter: 1</p>
        </div>
        <div className="text-center">
          <p className="mb-6 font-semibold lowercase text-gray-300 select-none">authenticated signature</p>
          <div className="border-t border-gray-400 pt-1">
            (Accountant/Account Officer)
          </div>
        </div>
        <div className="text-center">
          <p className="text-[8px] tracking-widest text-navy-900 mb-6 font-extrabold">For B.R. International School</p>
          <div className="border-t border-gray-400 pt-1">
            Authorized Signatory
          </div>
        </div>
      </div>
    </div>
  );
});

FeeReceiptTemplate.displayName = 'FeeReceiptTemplate';

export default FeeReceiptTemplate;
