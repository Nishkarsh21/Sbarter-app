
import React from 'react';
import { User } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Coins, ArrowUpCircle, ArrowDownCircle, Info, ShieldAlert } from 'lucide-react';

const data = [
  { name: 'Mon', credits: 5 },
  { name: 'Tue', credits: 4 },
  { name: 'Wed', credits: 6 },
  { name: 'Thu', credits: 8 },
  { name: 'Fri', credits: 7 },
  { name: 'Sat', credits: 9 },
  { name: 'Sun', credits: 11 },
];

const CreditsPanel: React.FC<{ user: User }> = ({ user }) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="bg-slate-900 rounded-3xl p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/40">
              <Coins size={28} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold">Wallet</h2>
          </div>
          <p className="text-slate-400 mb-6 max-w-sm">Skills are the currency on this platform. Earn credits by teaching and spend them to learn from others.</p>
          <div className="flex items-baseline space-x-2">
            <span className="text-6xl font-black text-white">{user.credits}</span>
            <span className="text-amber-500 font-bold uppercase tracking-widest">Available Credits</span>
          </div>
        </div>

        <div className="w-full md:w-1/2 h-64 relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorCredits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }}
                itemStyle={{ color: '#f59e0b' }}
              />
              <Area type="monotone" dataKey="credits" stroke="#f59e0b" strokeWidth={4} fillOpacity={1} fill="url(#colorCredits)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            Transaction History
          </h3>
          <div className="space-y-4">
            {[
              { type: 'earn', label: 'Teaching Session', amount: '+1', date: 'Today' },
              { type: 'spend', label: 'Learning Session', amount: '-1', date: 'Yesterday' },
              { type: 'penalty', label: 'Safety Compensation', amount: '+3', date: 'Oct 24, 2024' },
              { type: 'earn', label: 'Welcome Bonus', amount: '+5', date: 'Oct 20, 2024' },
            ].map((tx, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-xl ${tx.type === 'earn' || tx.type === 'penalty' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                    {tx.type === 'earn' || tx.type === 'penalty' ? <ArrowUpCircle size={20} /> : <ArrowDownCircle size={20} />}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{tx.label}</p>
                    <p className="text-xs text-slate-500">{tx.date}</p>
                  </div>
                </div>
                <span className={`font-bold text-lg ${tx.type === 'earn' || tx.type === 'penalty' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {tx.amount}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200">
          <div className="flex items-center space-x-3 mb-6">
            <Info size={24} className="text-indigo-200" />
            <h3 className="text-lg font-bold">Policy Overview</h3>
          </div>
          <ul className="space-y-6">
            <li className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold border border-indigo-400 mt-0.5">1</div>
              <div>
                <p className="font-bold text-sm">Welcome Bonus</p>
                <p className="text-xs text-indigo-200 mt-1">Receive 5 credits upon joining.</p>
              </div>
            </li>
            <li className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold border border-indigo-400 mt-0.5">2</div>
              <div>
                <p className="font-bold text-sm">Exchange Rate</p>
                <p className="text-xs text-indigo-200 mt-1">Earn 1 credit for teaching. Spend 1 credit for learning.</p>
              </div>
            </li>
            <li className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-rose-500 flex items-center justify-center text-xs font-bold border border-rose-400 mt-0.5"><ShieldAlert size={12}/></div>
              <div>
                <p className="font-bold text-sm text-rose-300">Penalty Policy</p>
                <p className="text-xs text-indigo-200 mt-1">Misbehavior or inactivity results in a 3-credit deduction.</p>
              </div>
            </li>
            <li className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold border border-indigo-400 mt-0.5">4</div>
              <div>
                <p className="font-bold text-sm">System Alerts</p>
                <p className="text-xs text-indigo-200 mt-1">Three warnings are provided before a session is automatically closed.</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreditsPanel;
