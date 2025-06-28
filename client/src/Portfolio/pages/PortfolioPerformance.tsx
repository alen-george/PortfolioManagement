import * as React from 'react';
import { portfolioData } from '../mock/Portfolio_performance';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

const PortfolioPerformance: React.FC = () => {
  const { totalValue, totalGain, allocation, performance } = portfolioData;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Portfolio Performance</h1>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-lg font-semibold">Total Value</h2>
          <p className="text-2xl font-bold text-green-600">${totalValue.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-lg font-semibold">Total Gain</h2>
          <p className="text-2xl font-bold text-blue-600">${totalGain.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white p-4 shadow rounded mb-6">
        <h2 className="text-lg font-semibold mb-2">Performance Over Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={performance}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-4 shadow rounded">
        <h2 className="text-lg font-semibold mb-2">Asset Allocation</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={allocation}
              dataKey="value"
              nameKey="asset"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {allocation.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PortfolioPerformance;
