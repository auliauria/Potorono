'use client'

import { ReactNode } from 'react'

interface Column<T> {
  key: string
  label: string
  render?: (row: T) => ReactNode
}

interface DataTableProps<T extends Record<string, unknown>> {
  columns: Column<T>[]
  data: T[]
  keyField: keyof T
  onEdit?: (row: T) => void
  onDelete?: (row: T) => void
  isDeleting?: string | null
}

export default function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  keyField,
  onEdit,
  onDelete,
  isDeleting,
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
        <p className="text-gray-400 text-sm">Belum ada data.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
      <table className="w-full bg-white text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            {columns.map(col => (
              <th
                key={col.key}
                className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap"
              >
                {col.label}
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {data.map(row => {
            const id = String(row[keyField])
            return (
              <tr key={id} className="hover:bg-gray-50/50 transition-colors">
                {columns.map(col => (
                  <td key={col.key} className="px-4 py-3 text-gray-700 whitespace-nowrap">
                    {col.render
                      ? col.render(row)
                      // ✅ Pakai keyof + string conversion, tidak perlu any
                      : String(row[col.key as keyof T] ?? '-')}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(row)}
                          className="px-3 py-1.5 text-xs font-medium text-[#1B4332] bg-[#1B4332]/10
                            rounded-lg hover:bg-[#1B4332]/20 transition-colors"
                        >
                          Edit
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(row)}
                          disabled={isDeleting === id}
                          className="px-3 py-1.5 text-xs font-medium text-red-500 bg-red-50
                            rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                        >
                          {isDeleting === id ? '...' : 'Hapus'}
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}