import React, { useState, useEffect, useRef } from 'react';
import studentService from '../services/studentService';
import feeService from '../services/feeService';
import ClassSectionFilter from '../components/common/ClassSectionFilter';
import SearchBar from '../components/common/SearchBar';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import FeeCollectionForm from '../components/fees/FeeCollectionForm';
import FeeHistoryTable from '../components/fees/FeeHistoryTable';
import FeeReceiptTemplate from '../components/fees/FeeReceiptTemplate';
import { downloadPDF } from '../utils/generatePDF';
import { useReactToPrint } from 'react-to-print';
import { IndianRupee, Printer, Download, CreditCard, Receipt } from 'lucide-react';
import toast from 'react-hot-toast';

const FeeManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Filter states
  const [search, setSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState('10th');
  const [selectedSection, setSelectedSection] = useState('A');

  // Modal target states
  const [targetStudent, setTargetStudent] = useState(null);
  const [collectOpen, setCollectOpen] = useState(false);
  
  const [historyStudent, setHistoryStudent] = useState(null);
  const [historyPayments, setHistoryPayments] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  const [activeReceipt, setActiveReceipt] = useState(null);
  const [receiptOpen, setReceiptOpen] = useState(false);

  const receiptRef = useRef(null);

  // Hook react-to-print browser printing
  const handleReceiptPrint = useReactToPrint({
    content: () => receiptRef.current,
    documentTitle: `Receipt_${activeReceipt?.receiptNo || 'payment'}`
  });

  const handleReceiptDownload = async () => {
    if (!activeReceipt) return;
    const toastId = toast.loading('Compiling fee receipt PDF...');
    try {
      const filename = `Fee_Receipt_${targetStudent?.firstName || 'student'}_${activeReceipt.receiptNo}.pdf`;
      await downloadPDF(receiptRef.current, filename, { useA4: true });
      toast.success('Fee receipt PDF downloaded', { id: toastId });
    } catch (err) {
      toast.error('Failed to compile PDF', { id: toastId });
    }
  };

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const data = await studentService.getStudents({
          className: selectedClass,
          section: selectedSection,
          search,
          limit: 1000 // Get all matched students for fee management selector list
        });
        setStudents(data.students || data);
      } catch (err) {
        toast.error('Failed to retrieve students database directories');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [selectedClass, selectedSection, search]);

  const handleCollectTrigger = (student) => {
    setTargetStudent(student);
    setCollectOpen(true);
  };

  const handleHistoryTrigger = async (student) => {
    setHistoryStudent(student);
    setHistoryLoading(true);
    setHistoryOpen(true);
    try {
      const logs = await feeService.getFeeHistory(student._id);
      setHistoryPayments(logs);
    } catch (err) {
      toast.error('Failed to query fee transactions log history');
      setHistoryOpen(false);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleCollectFeeSubmit = async (payload) => {
    setSubmitting(true);
    const toastId = toast.loading('Recording payment receipt transaction...');
    try {
      const savedReceipt = await feeService.collectFee(payload);
      toast.success(`Fee collected successfully! Receipt No: ${savedReceipt.receiptNo}`, { id: toastId });
      
      setCollectOpen(false);
      // Immediately open receipt reprint overlay
      setActiveReceipt(savedReceipt);
      setReceiptOpen(true);
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to submit fee payment details';
      toast.error(errMsg, { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReprintReceipt = (payment) => {
    setActiveReceipt(payment);
    // Hide history modal, open receipt modal
    setHistoryOpen(false);
    setReceiptOpen(true);
  };

  const columns = [
    {
      header: 'Serial No',
      key: 'serialNo',
      className: 'font-semibold text-navy-900'
    },
    {
      header: 'Student Name',
      key: 'name',
      render: (s) => (
        <span className="font-semibold text-gray-950">
          {s.firstName} {s.lastName}
        </span>
      )
    },
    {
      header: 'Class & Section',
      key: 'classSection',
      render: (s) => <span>{s.class} - {s.section}</span>
    },
    {
      header: 'Uses Bus Route',
      key: 'usesTransport',
      render: (s) => (
        <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ${
          s.usesTransport 
            ? 'bg-schoolGreen-50 text-schoolGreen-800 border border-schoolGreen-100' 
            : 'bg-gray-100 text-gray-500 border border-gray-200'
        }`}>
          {s.usesTransport ? 'Yes (Bus)' : 'No (Self)'}
        </span>
      )
    },
    {
      header: 'Billing Actions',
      key: 'actions',
      style: { width: '220px' },
      render: (s) => (
        <div className="flex items-center gap-2 no-print" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => handleCollectTrigger(s)}
            className="flex items-center gap-1 rounded-lg bg-schoolGreen-800 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-schoolGreen-700 transition-colors"
          >
            <IndianRupee className="h-3.5 w-3.5" />
            Collect Fee
          </button>
          
          <button
            onClick={() => handleHistoryTrigger(s)}
            className="flex items-center gap-1 rounded-lg border border-navy-900 bg-white px-3 py-1.5 text-xs font-bold text-navy-900 hover:bg-navy-50 transition-colors"
          >
            <Receipt className="h-3.5 w-3.5" />
            History
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="no-print">
        <h2 className="text-xl font-extrabold text-navy-900 md:text-2xl">Fee Management</h2>
        <p className="text-xs text-gray-500 font-medium">
          Select class-section directories to issue fee receipts, record Tuition and Transport collections, and reprint transaction ledger histories.
        </p>
      </div>

      {/* Directory Filter Bar */}
      <div className="rounded-card border border-gray-200 bg-white p-5 shadow-flat flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between no-print">
        <SearchBar 
          value={search} 
          onChange={setSearch} 
          placeholder="Search by student name or serial..." 
        />
        
        <ClassSectionFilter
          selectedClass={selectedClass}
          onClassChange={setSelectedClass}
          selectedSection={selectedSection}
          onSectionChange={setSelectedSection}
          showAllOption={false}
        />
      </div>

      {/* Active Directory Table list */}
      <DataTable
        columns={columns}
        data={students}
        loading={loading}
        onRowClick={handleCollectTrigger}
        emptyMessage="No active students found in this class segment."
      />

      {/* --- MODAL DIALOGS INDEX --- */}

      {/* Modal 1: Collect Fee Form */}
      <Modal
        isOpen={collectOpen}
        onClose={() => setCollectOpen(false)}
        title={`Fee Collection — ${targetStudent?.firstName} ${targetStudent?.lastName} (${targetStudent?.serialNo})`}
        size="lg"
      >
        {targetStudent && (
          <FeeCollectionForm
            student={targetStudent}
            onSubmit={handleCollectFeeSubmit}
            isSubmitting={submitting}
          />
        )}
      </Modal>

      {/* Modal 2: Fee History Table */}
      <Modal
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        title={`Fee Ledger History — ${historyStudent?.firstName} ${historyStudent?.lastName}`}
        size="lg"
      >
        {historyStudent && (
          <div className="space-y-4">
            <p className="text-xs text-gray-500 font-medium">
              Class {historyStudent.class} - Section {historyStudent.section} | Serial: {historyStudent.serialNo}
            </p>
            <FeeHistoryTable
              payments={historyPayments}
              loading={historyLoading}
              onReprint={handleReprintReceipt}
            />
          </div>
        )}
      </Modal>

      {/* Modal 3: Reprint Receipt Invoice */}
      <Modal
        isOpen={receiptOpen}
        onClose={() => setReceiptOpen(false)}
        title={`Reprint Fee Receipt — Receipt: ${activeReceipt?.receiptNo || ''}`}
        size="lg"
      >
        <div className="space-y-4">
          <div className="flex justify-end gap-2 no-print">
            <button
              onClick={handleReceiptPrint}
              className="flex items-center gap-2 rounded-lg bg-navy-900 px-4 py-2 text-xs font-bold text-white shadow-premium hover:bg-navy-800 transition-colors"
            >
              <Printer className="h-4 w-4" />
              Print
            </button>
            <button
              onClick={handleReceiptDownload}
              className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Download className="h-4 w-4" />
              Download PDF
            </button>
          </div>
          
          <div className="overflow-x-auto bg-gray-50/50 p-4 border border-gray-200 rounded-lg">
            {activeReceipt && (
              <FeeReceiptTemplate ref={receiptRef} payment={activeReceipt} />
            )}
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default FeeManagement;
