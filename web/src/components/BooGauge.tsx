// web/src/components/BooGauge.tsx

"use client";

import { motion } from 'framer-motion';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface GaugeItemProps {
  label: string;
  score: number;
}

const GaugeItem = ({ label, score }: GaugeItemProps) => {
  const percentage = score * 10;
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <h4 className="text-sm font-medium text-secondary">{label}</h4>
        <p className="text-base font-bold text-foreground">{score}/10</p>
      </div>
      <div className="w-full bg-white/10 rounded-full h-2">
        <motion.div
          className="bg-foreground h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
        />
      </div>
    </div>
  );
};

export interface BooGaugeData {
  mainBooGauge?: number;
  dread?: number;
  jumpScares?: number;
  gore?: number;
  psychological?: number;
  atmosphere?: number;
  lingeringEffect?: number;
}

interface BooGaugeProps {
  data: BooGaugeData;
}

export default function BooGauge({ data }: BooGaugeProps) {
  const mainScore = data.mainBooGauge || 0;
  const mainPercentage = mainScore * 10;

  return (
    // This new flexbox layout is the key to the alignment fix
    <div className="flex flex-col h-full">
      {/* Top Section: Main Gauge */}
      <div className="flex flex-col items-center pt-4">
        <div className="w-40 h-40">
          <CircularProgressbar
            value={mainPercentage}
            text={`${mainScore}`}
            strokeWidth={8}
            styles={buildStyles({
              textColor: '#EDEDED',
              pathColor: '#FFFFFF',
              trailColor: 'rgba(255, 255, 255, 0.1)',
              textSize: '28px',
            })}
          />
        </div>
      </div>

      {/* The Magic Spacer: This div expands to take up all extra vertical space */}
      <div className="flex-grow" />

      {/* Bottom Section: Sub-Attributes */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-5">
        <GaugeItem label="Dread" score={data.dread || 0} />
        <GaugeItem label="Jump Scares" score={data.jumpScares || 0} />
        <GaugeItem label="Gore" score={data.gore || 0} />
        <GaugeItem label="Psychological" score={data.psychological || 0} />
        <GaugeItem label="Atmosphere" score={data.atmosphere || 0} />
        <GaugeItem label="Lingering Effect" score={data.lingeringEffect || 0} />
      </div>
    </div>
  );
}