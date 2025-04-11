import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8 text-center">Accounting PWA</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10">
          <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Invoice Management</h2>
            <p className="text-gray-600 mb-4">Upload, scan, or import invoices from email. Track your expenses with ease.</p>
            <Link 
              href="/invoices" 
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Manage Invoices
            </Link>
          </div>
          
          <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Transaction Tracking</h2>
            <p className="text-gray-600 mb-4">Record transactions and link them to invoices. Categorize and monitor your spending.</p>
            <Link 
              href="/transactions" 
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Track Transactions
            </Link>
          </div>
          
          <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Account Reconciliation</h2>
            <p className="text-gray-600 mb-4">Upload bank statements and reconcile them with recorded transactions.</p>
            <Link 
              href="/reconciliation" 
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Reconcile Accounts
            </Link>
          </div>
          
          <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Accounting Daybook</h2>
            <p className="text-gray-600 mb-4">Generate double-entry accounting daybook with links to invoice files.</p>
            <Link 
              href="/daybook" 
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              View Daybook
            </Link>
          </div>
        </div>
        
        <div className="mt-10 text-center">
          <p className="text-sm text-gray-500">
            A Progressive Web Application (PWA) for small teams to manage expense invoices,
            track payments, reconcile statements, and generate a double-entry accounting daybook.
          </p>
        </div>
      </div>
    </main>
  );
} 