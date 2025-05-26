'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { use } from 'react';
import debtManagementService from '@/services/debt-management.service';
import DebtForm from '@/components/debts/DebtForm';
import { Debt } from '@/types/debt-management.types';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditDebtPage(props: PageProps) {
  const params = use(props.params);
  const id = params.id;
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [debt, setDebt] = useState<Debt | null>(null);

  useEffect(() => {
    fetchDebt();
  }, [id]);

  const fetchDebt = async () => {
    try {
      setLoading(true);
      const response = await debtManagementService.getDebtById(id);
      
      if (response.success && response.data) {
        setDebt(response.data);
      } else {
        toast.error(response.message);
        router.push('/account/debts');
      }
    } catch (error) {
      console.error('Error fetching debt:', error);
      toast.error('Không thể tải thông tin khoản nợ');
      router.push('/account/debts');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!debt) {
    return null;
  }

  return <DebtForm mode="edit" initialData={debt} debtId={id} />;
} 