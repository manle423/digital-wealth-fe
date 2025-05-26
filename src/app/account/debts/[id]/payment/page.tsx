'use client';

import { use } from 'react';
import DebtPaymentForm from '@/components/debts/DebtPaymentForm';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function DebtPaymentPage(props: PageProps) {
  const params = use(props.params);
  const id = params.id;

  return <DebtPaymentForm debtId={id} />;
} 