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
    <div className="bg-bg-paper min-h-screen p-4 md:p-6 lg:p-10 flex flex-col">
      <PageHeader title="Blog Management" buttonText="New Post" />

      <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.1)] overflow-hidden overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader className="bg-bg-surface border-b-2 border-primary">
            <TableRow>
              <TableHead className="font-bold text-text-strong p-4">Title</TableHead>
              <TableHead className="font-bold text-text-strong p-4">Author</TableHead>
              <TableHead className="font-bold text-text-strong p-4">Date</TableHead>
              <TableHead className="font-bold text-text-strong p-4">Status</TableHead>
              <TableHead className="font-bold text-text-strong p-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blogs.map((blog) => (
              <TableRow key={blog.id} className="hover:bg-bg-surface border-b border-border">
                <TableCell className="text-text-strong p-4 font-medium"><FileText size={16} className="inline mr-2 text-primary" />{blog.title}</TableCell>
                <TableCell className="text-muted p-4">{blog.author}</TableCell>
                <TableCell className="text-muted p-4 text-sm">{blog.date}</TableCell>
                <TableCell className="p-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                    blog.status === 'Published' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
                  }`}>{blog.status}</span>
                </TableCell>
                <TableCell className="p-4 flex gap-2">
                  <Button size="sm" variant="outline">Edit</Button>
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
