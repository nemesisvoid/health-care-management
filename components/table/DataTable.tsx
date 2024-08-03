'use client';

import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '../ui/button';
import Image from 'next/image';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className='data-table rounded-md border'>
      <Table className='shad-table'>
        <TableHeader className='bg-dark-200'>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow
              key={headerGroup.id}
              className='shad-table-row-header'>
              {headerGroup.headers.map(header => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map(row => (
              <TableRow
                className='shad-table-row'
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}>
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className='h-24 text-center'>
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className='table-actions'>
        <Button
          variant='outline'
          size='sm'
          className='shad-gray-btn'
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}>
          <Image
            src='/assets/icons/arrow.svg'
            width={24}
            height={24}
            alt='arrow'
          />
        </Button>
        <Button
          variant='outline'
          size='sm'
          className='shad-gray-btn'
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}>
          <Image
            src='/assets/icons/arrow.svg'
            width={24}
            height={24}
            alt='arrow'
            className='rotate-180'
          />
        </Button>
      </div>
    </div>
  );
}
