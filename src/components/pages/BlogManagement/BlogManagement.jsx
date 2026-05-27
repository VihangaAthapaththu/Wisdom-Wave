import React from 'react';
import { FileText } from 'lucide-react';
import { Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components';
import { PageHeader } from '@/components/molecules';

export function BlogManagement() {
  const blogs = [
    { id: 1, title: 'Getting Started with React', author: 'John Smith', date: '2026-01-15', status: 'Published' },
    { id: 2, title: 'JavaScript Best Practices', author: 'Jane Doe', date: '2026-01-18', status: 'Draft' },
    { id: 3, title: 'Web Design Trends 2026', author: 'Mike Johnson', date: '2026-01-20', status: 'Published' },
  ];

  return (
    <div className="bg-[#faf8f5] min-h-screen p-4 md:p-6 lg:p-10 flex flex-col">
      <PageHeader title="Blog Management" buttonText="New Post" />

      <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.1)] overflow-hidden overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader className="bg-[#f5f5f5] border-b-2 border-[#FFA500]">
            <TableRow>
              <TableHead className="font-bold text-[#1a1a1a] p-4">Title</TableHead>
              <TableHead className="font-bold text-[#1a1a1a] p-4">Author</TableHead>
              <TableHead className="font-bold text-[#1a1a1a] p-4">Date</TableHead>
              <TableHead className="font-bold text-[#1a1a1a] p-4">Status</TableHead>
              <TableHead className="font-bold text-[#1a1a1a] p-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blogs.map((blog) => (
              <TableRow key={blog.id} className="hover:bg-[#f5f5f5] border-b border-[#e0e0e0]">
                <TableCell className="text-[#666666] p-4"><FileText size={16} className="inline mr-2" />{blog.title}</TableCell>
                <TableCell className="text-[#666666] p-4">{blog.author}</TableCell>
                <TableCell className="text-[#666666] p-4">{blog.date}</TableCell>
                <TableCell className="text-[#666666] p-4">{blog.status}</TableCell>
                <TableCell className="p-4">
                  <Button size="sm" className="bg-[#FFA500] text-white hover:bg-[#ff8c00] mr-2">Edit</Button>
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
