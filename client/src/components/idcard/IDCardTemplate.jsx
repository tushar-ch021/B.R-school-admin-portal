import React, { forwardRef } from 'react';
import { useAuth } from '../../context/AuthContext';

const IDCardTemplate = forwardRef(({ student }, ref) => {
  const { admin } = useAuth();
  if (!student) return null;

  const signatureSrc = admin?.signatureUrl || "";

  return (
    <div 
      ref={ref}
      className="print-container bg-white border border-gray-300 rounded-[12px] shadow-lg overflow-hidden font-sans select-none relative"
      style={{ 
        width: '324px',
        height: '516px',
        minWidth: '324px',
        minHeight: '516px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* 1. Curved Navy Header */}
      <div 
        style={{
          backgroundColor: '#1b3a6b',
          color: '#ffffff',
          paddingTop: '8px',
          paddingBottom: '6px',
          paddingLeft: '12px',
          paddingRight: '12px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          height: '100px',
          flexShrink: 0,
          borderBottomLeftRadius: '32px',
          borderBottomRightRadius: '32px',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Emblem logo */}
        <div 
          style={{
            height: '44px',
            width: '44px',
            backgroundColor: '#ffffff',
            borderRadius: '50%',
            padding: '2px',
            border: '1px solid white',
            marginBottom: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            flexShrink: 0,
          }}
        >
          <img 
            src="/logo.png" 
            alt="BRIS Logo" 
            style={{ height: '100%', width: '100%', objectFit: 'contain', display: 'block' }}
            crossOrigin="anonymous"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>

        {/* School Name Lines */}
        <h1 style={{ fontSize: '16px', fontWeight: '800', letterSpacing: '0.05em', lineHeight: '1', margin: 0 }}>
          B.R.INTERNATIONAL
        </h1>
        <h2 style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '0.1em', lineHeight: '1', marginTop: '4px', color: '#f3f4f6' }}>
          SR.SEC.SCHOOL
        </h2>
      </div>

      {/* 2. Thin Green Transition Accent */}
      <div 
        style={{
          position: 'absolute',
          top: '88px',
          left: '0',
          right: '0',
          height: '22px',
          backgroundColor: '#2e7d32',
          borderBottomLeftRadius: '32px',
          borderBottomRightRadius: '32px',
          zIndex: 5,
        }}
      />

      {/* 3. Photo & ID Card Banner Strip & Details */}
      <div 
        style={{
          flex: '1 1 auto',
          display: 'block',
          padding: '20px 16px 8px 16px',
          position: 'relative',
          zIndex: 20,
          textAlign: 'center',
        }}
      >
        
        {/* Student Image Box */}
        <div 
          style={{
            height: '96px',
            width: '80px',
            overflow: 'hidden',
            border: '2px solid #d1d5db',
            borderRadius: '2px',
            backgroundColor: '#f9fafb',
            margin: '0 auto',
            flexShrink: 0,
          }}
        >
          {student.photo?.url ? (
            <img 
              src={student.photo.url} 
              alt={student.firstName} 
              style={{ height: '100%', width: '100%', objectFit: 'cover', display: 'block' }}
              crossOrigin="anonymous"
            />
          ) : (
            <div style={{ display: 'flex', height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center', color: '#d1d5db' }}>
              <span style={{ fontSize: '10px' }}>No Photo</span>
            </div>
          )}
        </div>

        {/* Identity card academic cycle strip */}
        <div
          style={{
            width: '170px',
            margin: '6px auto 0 auto',
            padding: '6px 0',
            backgroundColor: '#1b3a6b',
            color: '#ffffff',
            fontSize: '9px',
            fontWeight: '800',
            textTransform: 'uppercase',
            textAlign: 'center',
            letterSpacing: '0.05em',
            borderRadius: '2px',
            lineHeight: '1',
            boxSizing: 'border-box',
            flexShrink: 0,
          }}
        >
          IDENTITY CARD-{student.academicYear}
        </div>

        {/* Student Name */}
        <h3 style={{ fontSize: '16px', fontWeight: '900', letterSpacing: '0.05em', textAlign: 'center', textTransform: 'uppercase', color: '#D6336C', marginTop: '12px', marginBottom: '0' }}>
          {student.firstName} {student.lastName}
        </h3>

        {/* Information Table Rows */}
        <div style={{ width: '100%', fontSize: '10px', color: '#111827', marginTop: '16px', paddingLeft: '4px', paddingRight: '4px', lineHeight: '1.625', fontWeight: '600', textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '6px' }}>
            <span style={{ width: '96px', color: '#030712', fontWeight: '800', flexShrink: 0 }}>Reg. No</span>
            <span style={{ padding: '0 4px' }}>:</span>
            <span style={{ flex: '1', color: '#1b3a6b', fontWeight: '800', whiteSpace: 'nowrap' }}>{student.serialNo}</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '6px' }}>
            <span style={{ width: '96px', color: '#030712', fontWeight: '800', flexShrink: 0 }}>Father's Name</span>
            <span style={{ padding: '0 4px' }}>:</span>
            <span style={{ flex: '1', color: '#1f2937', whiteSpace: 'nowrap' }}>{student.fatherName}</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '6px' }}>
            <span style={{ width: '96px', color: '#030712', fontWeight: '800', flexShrink: 0 }}>Class & Sec</span>
            <span style={{ padding: '0 4px' }}>:</span>
            <span style={{ flex: '1', color: '#1f2937', whiteSpace: 'nowrap' }}>{student.class} - {student.section}</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '6px' }}>
            <span style={{ width: '96px', color: '#030712', fontWeight: '800', flexShrink: 0 }}>Res. Address</span>
            <span style={{ padding: '0 4px' }}>:</span>
            <span style={{ flex: '1', color: '#1f2937', whiteSpace: 'nowrap' }}>{student.address?.city}</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <span style={{ width: '96px', color: '#030712', fontWeight: '800', flexShrink: 0 }}>Mobile No</span>
            <span style={{ padding: '0 4px' }}>:</span>
            <span style={{ flex: '1', color: '#1f2937', whiteSpace: 'nowrap' }}>{student.contactNo}</span>
          </div>
        </div>

        {/* Principal signature block */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginTop: '16px', paddingRight: '16px' }}>
          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Signature image overlay */}
            <div style={{ height: '24px', width: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {signatureSrc ? (
                <img 
                  src={signatureSrc} 
                  alt="Principal Signature" 
                  style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', display: 'block' }}
                  crossOrigin="anonymous"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : null}
            </div>
            <div style={{ width: '80px', borderBottom: '1px solid #9ca3af', opacity: '0.3', marginTop: '2px' }} />
            <p style={{ fontSize: '8px', fontWeight: '800', color: '#1b3a6b', letterSpacing: '0.05em', marginTop: '2px', textTransform: 'uppercase' }}>
              Principal
            </p>
          </div>
        </div>
      </div>

      {/* 4. Footer Contact details banner */}
      <div 
        style={{
          backgroundColor: '#1b3a6b',
          color: '#ffffff',
          fontSize: '7.5px',
          padding: '6px 8px',
          textAlign: 'center',
          borderTop: '1px solid #15305a',
          lineHeight: '1.4',
          fontWeight: '700',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          flexShrink: 0,
        }}
      >
        <p style={{ margin: 0 }}>ATTA, GULAOTHI-SAIDPUR ROAD (BSR)</p>
        <p style={{ margin: 0, marginTop: '2px', color: '#d1d5db' }}>
          MOB :- 9536026897, 9410442828
        </p>
      </div>
    </div>
  );
});

IDCardTemplate.displayName = 'IDCardTemplate';

export default IDCardTemplate;
