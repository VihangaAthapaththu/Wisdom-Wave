import React from 'react';
import { BarChart3, Download } from 'lucide-react';
import { Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components';
import { PageHeader } from '@/components/molecules';

export function ReportManagement() {
  const reports = [
    { id: 1, title: 'Q1 Performance Report', date: '2026-01-20', status: 'Generated' },
    { id: 2, title: 'Student Progress Report', date: '2026-01-18', status: 'Generated' },
    { id: 3, title: 'Course Analytics', date: '2026-01-15', status: 'Generated' },
  ];

  return (
    <div className="bg-[#faf8f5] min-h-screen p-4 md:p-6 lg:p-10 flex flex-col">
      <PageHeader title="Report Management" />

      <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.1)] overflow-hidden overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader className="bg-[#f5f5f5] border-b-2 border-[#FFA500]">
            <TableRow>
              <TableHead className="font-bold text-[#1a1a1a] p-4">Report Title</TableHead>
              <TableHead className="font-bold text-[#1a1a1a] p-4">Date</TableHead>
              <TableHead className="font-bold text-[#1a1a1a] p-4">Status</TableHead>
              <TableHead className="font-bold text-[#1a1a1a] p-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id} className="hover:bg-[#f5f5f5] border-b border-[#e0e0e0]">
                <TableCell className="text-muted p-4"><BarChart3 size={16} className="inline mr-2" />{report.title}</TableCell>
                <TableCell className="text-muted p-4">{report.date}</TableCell>
                <TableCell className="text-muted p-4">{report.status}</TableCell>
                <TableCell className="p-4">
                  <Button size="sm" className="bg-[#FFA500] text-white hover:bg-[#ff8c00]">
                    <Download size={14} className="inline" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
