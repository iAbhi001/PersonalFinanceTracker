import { NavLink } from "react-router-dom"

export default function Sidebar() {
  const linkClass = ({ isActive }) =>
    `block py-2 px-4 rounded hover:bg-blue-100 ${isActive ? "bg-blue-200 font-bold" : ""}`

  return (
    <aside className="w-64 bg-white shadow-md p-6 flex flex-col space-y-4">
      <h2 className="text-xl font-bold mb-4">Menu</h2>
      <NavLink to="/dashboard" className={linkClass}>
        Dashboard
      </NavLink>
      <NavLink to="/accounts" className={linkClass}>
        Accounts
      </NavLink>
      <NavLink to="/budgets" className={linkClass}>
        Budgets
      </NavLink>
      <NavLink to="/reports" className={linkClass}>
        Reports
      </NavLink>
    </aside>
  )
}
