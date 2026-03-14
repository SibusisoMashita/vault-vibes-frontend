import { Member } from '../../types';
import { OwnershipCard } from '../../features/dashboard/components/OwnershipCard';

interface ShareSummaryCardProps {
  member: Member;
  perShareValue: number;
}

export function ShareSummaryCard({ member, perShareValue }: ShareSummaryCardProps) {
  return <OwnershipCard member={member} perShareValue={perShareValue} />;
}

