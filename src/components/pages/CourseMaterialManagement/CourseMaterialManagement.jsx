import React from 'react';
import { FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PageHeader } from '@/components/molecules';

export function CourseMaterialManagement() {
  const materials = [
    { id: 1, title: 'Lecture 1 - Introduction', type: 'PDF', date: '2026-01-15', size: '2.4 MB' },
    { id: 2, title: 'Lecture 2 - Components', type: 'Video', date: '2026-01-18', size: '156 MB' },
    { id: 3, title: 'Quiz 1', type: 'Document', date: '2026-01-20', size: '0.8 MB' },
  ];

  return (
    <div className="bg-[#faf8f5] min-h-screen p-4 md:p-6 lg:p-10 flex flex-col">
      <PageHeader title="Course Materials" buttonText="Upload Material" />

      <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.1)] overflow-hidden overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader className="bg-[#f5f5f5] border-b-2 border-[#FFA500]">
            <TableRow>
              <TableHead className="font-bold text-[#1a1a1a] p-4">Title</TableHead>
              <TableHead className="font-bold text-[#1a1a1a] p-4">Type</TableHead>
              <TableHead className="font-bold text-[#1a1a1a] p-4">Date</TableHead>
              <TableHead className="font-bold text-[#1a1a1a] p-4">Size</TableHead>
              <TableHead className="font-bold text-[#1a1a1a] p-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {materials.map((material) => (
              <TableRow key={material.id} className="hover:bg-[#f5f5f5] border-b border-[#e0e0e0]">
                <TableCell className="text-[#666666] p-4"><FileText size={16} className="inline mr-2" />{material.title}</TableCell>
                <TableCell className="text-[#666666] p-4">{material.type}</TableCell>
                <TableCell className="text-[#666666] p-4">{material.date}</TableCell>
                <TableCell className="text-[#666666] p-4">{material.size}</TableCell>
                <TableCell className="p-4 flex gap-2">
                  <Button size="sm" className="bg-[#FFA500] text-white hover:bg-[#ff8c00]">
                    <Download size={14} />
                  </Button>
                  <Button size="sm" variant="destructive">Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
