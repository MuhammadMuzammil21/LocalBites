import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Separator } from "../components/ui/separator"
import { useEffect, useState } from "react"
import { Trash } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

const mockCartItems: CartItem[] = [
  {
    id: "1",
    name: "Burger",
    price: 5.99,
    quantity: 2,
    image: "https://via.placeholder.com/40",
  },
  {
    id: "2",
    name: "Pizza",
    price: 9.99,
    quantity: 1,
    image: "https://via.placeholder.com/40",
  },
]

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    // Replace this with context or API call
    setCartItems(mockCartItems)
  }, [])

  const handleDelete = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id))
  }

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
      {cartItems.length === 0 ? (
        <p className="text-muted-foreground">Your cart is empty.</p>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Items in Cart</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded object-cover"
                  />
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      ${item.price.toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash className="w-5 h-5 text-destructive" />
                </Button>
              </div>
            ))}

            <Separator />

            <div className="flex justify-between items-center">
              <p className="text-lg font-semibold">Total:</p>
              <p className="text-lg font-bold">${total.toFixed(2)}</p>
            </div>

            <Button
              className="w-full mt-4"
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
