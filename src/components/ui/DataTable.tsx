
import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface DataTableProps<T> {
  data: T[];
  columns: {
    key: keyof T | 'actions';
    header: string;
    render?: (item: T) => React.ReactNode;
    className?: string;
  }[];
  className?: string;
  pageSize?: number;
  isLoading?: boolean;
}

function DataTable<T extends { id: string | number }>({
  data,
  columns,
  className,
  pageSize = 10,
  isLoading = false,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const totalPages = Math.ceil(data.length / pageSize);
  
  const paginatedData = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return data.slice(start, end);
  }, [data, currentPage, pageSize]);

  const LoadingRow = () => (
    <tr>
      {columns.map((column, index) => (
        <td key={index} className="p-4">
          <div className="loading-shimmer h-6 rounded"></div>
        </td>
      ))}
    </tr>
  );

  return (
    <div className={cn("table-wrapper", className)}>
      <table className="w-full divide-y divide-border">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th 
                key={index} 
                className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-card divide-y divide-border">
          {isLoading ? (
            Array(3).fill(0).map((_, index) => <LoadingRow key={index} />)
          ) : paginatedData.length === 0 ? (
            <tr>
              <td 
                colSpan={columns.length} 
                className="px-4 py-8 text-center text-sm text-muted-foreground"
              >
                No data found
              </td>
            </tr>
          ) : (
            paginatedData.map((item, rowIndex) => (
              <tr 
                key={`row-${item.id}`} 
                className="transition-colors hover:bg-muted/30"
              >
                {columns.map((column, colIndex) => (
                  <td 
                    key={`cell-${item.id}-${colIndex}`} 
                    className={cn("px-4 py-3 text-sm", column.className)}
                  >
                    {column.key === 'actions' && column.render 
                      ? column.render(item)
                      : column.render 
                        ? column.render(item) 
                        : String(item[column.key])}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
      
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-medium">{Math.min(((currentPage - 1) * pageSize) + 1, data.length)}</span> to{' '}
            <span className="font-medium">{Math.min(currentPage * pageSize, data.length)}</span> of{' '}
            <span className="font-medium">{data.length}</span> results
          </div>
          
          <div className="flex space-x-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="h-8 w-8"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="h-8 w-8"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;
