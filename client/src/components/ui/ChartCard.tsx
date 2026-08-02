import React, { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './Card';
import { ChevronDown, Check } from 'lucide-react';

interface ChartCardProps {
  icon: React.ReactNode;
  title: string;
  timeframeOptions?: string[];
  selectedTimeframe?: string;
  onTimeframeChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function CustomDropdown({
  options,
  selected,
  onChange,
}: {
  options: string[];
  selected: string;
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-teal-400 hover:border-teal-500 rounded-xl text-xs font-bold text-teal-700 shadow-2xs hover:shadow-xs transition cursor-pointer"
      >
        <span>{selected}</span>
        <ChevronDown className={`h-3.5 w-3.5 text-teal-600 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-1.5 w-36 bg-white rounded-xl shadow-xl border border-slate-200/90 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                selected === opt ? 'bg-teal-50 text-teal-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>{opt}</span>
              {selected === opt && <Check className="w-3.5 h-3.5 text-teal-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function ChartCard({
  icon,
  title,
  timeframeOptions = ['This Year', 'This Month', 'All Time'],
  selectedTimeframe = 'This Year',
  onTimeframeChange,
  children,
  className = '',
}: ChartCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-bold">
          {icon}
          {title}
        </CardTitle>

        {timeframeOptions && onTimeframeChange && (
          <CustomDropdown
            options={timeframeOptions}
            selected={selectedTimeframe}
            onChange={onTimeframeChange}
          />
        )}
      </CardHeader>
      <CardContent className="h-64">{children}</CardContent>
    </Card>
  );
}
