import React from 'react';
import { Search, Filter, GraduationCap } from 'lucide-react';

interface MembersSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  roleFilter: string;
  setRoleFilter: (role: string) => void;
  yearFilter: string;
  setYearFilter: (year: string) => void;
  availableRoles: string[];
  availableYears: number[];
}

const MembersSearch: React.FC<MembersSearchProps> = ({
  searchTerm,
  setSearchTerm,
  roleFilter,
  setRoleFilter,
  yearFilter,
  setYearFilter,
  availableRoles,
  availableYears
}) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-2xl border border-blue mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name, roll number, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue border border-neutral-700"
          />
        </div>

        {/* Role Filter */}
<div className="relative">
  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white w-5 h-5" />
  <select
    value={roleFilter}
    onChange={(e) => setRoleFilter(e.target.value)}
    className="pl-10 pr-8 py-3 bg-blue-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-300 appearance-none cursor-pointer border-0"
  >
    <option value="">All Roles</option>
    {availableRoles.map(role => (
      <option key={role} value={role}>{role}</option>
    ))}
  </select>
</div>

{/* Year Filter */}
<div className="relative">
  <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white w-5 h-5" />
  <select
    value={yearFilter}
    onChange={(e) => setYearFilter(e.target.value)}
    className="pl-10 pr-8 py-3 bg-blue-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-300 appearance-none cursor-pointer border-0"
  >
    <option value="">All Years</option>
    {availableYears.map(year => (
      <option key={year} value={year.toString()}>Year {year}</option>
    ))}
  </select>
</div>
      </div>
    </div>
  );
};

export default MembersSearch;