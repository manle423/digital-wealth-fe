'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EditQuestionRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    router.push('/admin/questions');
  }, [router]);
  
  return (
    <div className="flex justify-center py-8">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
} 