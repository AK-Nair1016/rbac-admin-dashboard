import StatCard from "./common/StatCard";

interface MetricCardProps {
  label: string;
  value: string | number;
  hint?: string;
}

const MetricCard = ({ label, value, hint }: MetricCardProps) => {
  return <StatCard label={label} value={value} hint={hint} />;
};

export default MetricCard;
