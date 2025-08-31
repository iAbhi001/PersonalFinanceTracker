import Input from "../ui/Input"
import Button from "../ui/Button"
import { useState } from "react"

export default function AddTransactionForm() {
  const [desc, setDesc] = useState("")
  const [amount, setAmount] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    alert(`Transaction Added: ${desc} - $${amount}`)
    setDesc("")
    setAmount("")
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded shadow space-y-4"
    >
      <h3 className="text-xl font-bold">Add Transaction</h3>
      <Input
        type="text"
        placeholder="Description"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />
      <Input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <Button type="submit">Add Transaction</Button>
    </form>
  )
}
