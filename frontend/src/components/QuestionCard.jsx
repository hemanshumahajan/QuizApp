import React from 'react';
import { motion } from 'framer-motion';

export default function QuestionCard({ question, index, total }) {
  return (
    <motion.div
      key={index}
      className="glass-strong p-6 md:p-8 rounded-3xl"
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -30, scale: 0.96 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Question number chip */}
      <div className="flex items-center gap-2 mb-4">
        <span
          className="px-3 py-1 rounded-full text-xs font-display font-bold tracking-widest uppercase"
          style={{
            background: 'rgba(123,47,255,0.25)',
            border: '1px solid rgba(123,47,255,0.5)',
            color: '#b97aff',
          }}
        >
          Question {index + 1}
        </span>
      </div>

      {/* Question image — backend serves from /Images/<ImageName> */}
      {question.ImageName && (
        <div className="mb-5 rounded-2xl overflow-hidden">
          <img
            src={`http://localhost:5000/Images/${question.ImageName}`}
            alt="Question visual"
            className="w-full object-cover max-h-48"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        </div>
      )}

      {/* Question text — backend field: QnInWords */}
      <p className="text-white font-display font-semibold text-xl md:text-2xl leading-tight">
        {question.QnInWords || question.questionText || question.text || 'Question'}
      </p>
    </motion.div>
  );
}
