
import React, { useMemo } from 'react';
import { Transaction } from '../types';
import { TRANSLATIONS } from '../constants';
import { TrendingUp, TrendingDown, Edit2, Eraser, Calendar } from 'lucide-react';

interface AccountingProps {
  transactions: Transaction[];
  language: 'ta' | 'en';
  onEdit: (txn: Transaction) => void;
  onClear: () => void;
}

const Accounting: React.FC<AccountingProps> = ({ transactions, language, onEdit, onClear }) => {
  const t = TRANSLATIONS[language];

  // Calculate running balance by iterating through sorted transactions
  const transactionsWithBalance = useMemo(() => {
    const sorted = [...transactions].sort((a, b) => a.date - b.date);
    let currentBal = 0;
    return sorted.map(txn => {
      if (txn.type === 'INCOME') currentBal += txn.amount;
      else currentBal -= txn.amount;
      return { ...txn, runningBalance: currentBal };
    }).reverse(); // Reverse to show latest first
  }, [transactions]);

  const grouped = transactionsWithBalance.reduce((acc: any, txn) => {
    const month = new Date(txn.date).toLocaleString(language, { month: 'long', year: 'numeric' });
    if (!acc[month]) acc[month] = [];
    acc[month].push(txn);
    return acc;
  }, {});

  return (
    <div className="p-4 space-y-6 pb-28">
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-2">
            <h2 className="text-xl font-black tamil-font text-slate-800">{t.accounts}</h2>
            <div className="px-3 py-1 bg-indigo-100 rounded-full">
                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                {transactions.length} {language === 'ta' ? 'பதிவுகள்' : 'Entries'}
                </p>
            </div>
         </div>
         
         {transactions.length > 0 && (
            <button 
              onClick={onClear}
              className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition active:scale-95 border border-red-100"
            >
               <Eraser size={14} />
               <span className="text-[10px] font-bold tamil-font">{t.clearAll}</span>
            </button>
         )}
      </div>

      {Object.keys(grouped).length === 0 && (
         <div className="text-center py-20 opacity-50">
            <Calendar size={48} className="mx-auto mb-2 text-gray-300"/>
            <p className="text-sm font-bold text-gray-400 tamil-font">{t.noData}</p>
         </div>
      )}

      {Object.keys(grouped).map(month => (
        <div key={month} className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-px bg-gray-200 flex-1"></div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{month}</span>
            <div className="h-px bg-gray-200 flex-1"></div>
          </div>
          
          <div className="space-y-3">
            {grouped[month].map((txn: any) => (
              <div key={txn.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50 transition-all hover:shadow-md">
                 <div className="flex justify-between items-start mb-3">
                    <div className="flex items-start gap-3">
                       <div className={`p-2 rounded-xl ${txn.type === 'INCOME' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                          {txn.type === 'INCOME' ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                       </div>
                       <div>
                          <p className="font-bold text-gray-800 text-sm">{txn.category}</p>
                          {txn.description && <p className="text-xs text-gray-500 mt-0.5">{txn.description}</p>}
                          <p className="text-[10px] text-gray-400 mt-1 font-medium">{new Date(txn.date).toLocaleTimeString(language, {hour: '2-digit', minute:'2-digit'})}</p>
                       </div>
                    </div>
                    <div className="text-right">
                        <p className={`font-black text-lg ${txn.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                        {txn.type === 'INCOME' ? '+' : '-'} ₹{txn.amount}
                        </p>
                        <p className="text-[10px] text-gray-400 font-bold mt-1 bg-gray-50 px-2 py-0.5 rounded-md inline-block">
                           {language === 'ta' ? 'இருப்பு' : 'Bal'}: ₹{txn.runningBalance}
                        </p>
                    </div>
                 </div>

                 {/* Action Buttons */}
                 <div className="flex justify-end gap-2 border-t border-gray-50 pt-2.5 mt-2">
                    <button 
                      onClick={() => onEdit(txn)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-bold hover:bg-indigo-100 transition"
                    >
                       <Edit2 size={12} /> {language === 'ta' ? 'மாற்ற' : 'Edit'}
                    </button>
                 </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Accounting;
