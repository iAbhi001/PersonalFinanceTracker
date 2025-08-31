import Sidebar from "../components/dashboard/Sidebar"
import CategoryPieChart from "../components/dashboard/CategoryPieChart"
import AddTransactionForm from "../components/forms/AddTransactionForm"

export default function Dashboard() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-8 bg-gray-50 space-y-6">
        <header className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600">Welcome, DemoUser</p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CategoryPieChart />
          <AddTransactionForm />
        </section>
      </main>
    </div>
  )
}
