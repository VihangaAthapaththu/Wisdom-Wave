import React from 'react';
import { Card, Button } from '@/components';
import { BookOpen, Trash2, Edit } from 'lucide-react';

export function LecturerCoursesList({ courses = [], onEdit, onDelete }) {
  if (!courses || courses.length === 0) {
    return (
      <Card className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
        <p className="text-sm text-gray-500">You have no assigned courses yet. Ask an admin to assign one.</p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {courses.map((course) => (
        <Card key={course._id || course.id} className="flex items-center justify-between p-4">
          <div className="flex items-start gap-4 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFA500]/15 to-[#ff8c00]/10 flex items-center justify-center shrink-0">
              <BookOpen size={18} className="text-[#FFA500]" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-semibold text-gray-900 truncate">{course.title}</h3>
              <p className="text-xs text-gray-500 truncate">{course.description || '—'}</p>
            </div>
          </div>

          {(onEdit || onDelete) && (
            <div className="flex items-center gap-2">
              {onEdit && (
                <Button size="sm" className="bg-[#FFA500] text-white" onClick={() => onEdit(course)}>
                  <Edit size={14} />
                </Button>
              )}
              {onDelete && (
                <Button size="sm" variant="destructive" onClick={() => onDelete(course)}>
                  <Trash2 size={14} />
                </Button>
              )}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}

export default LecturerCoursesList;
