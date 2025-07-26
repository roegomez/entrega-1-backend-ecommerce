import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, TrendingUp, Users } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Product, Cart } from "@/types/store";

const Dashboard = () => {
  const [products] = useLocalStorage<Product[]>("products", []);
  const [carts] = useLocalStorage<Cart[]>("carts", []);

  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.status).length;
  const totalCarts = carts.length;
  const totalStock = products.reduce((acc, product) => acc + product.stock, 0);

  const stats = [
    {
      title: "Total Productos",
      value: totalProducts,
      icon: Package,
      description: `${activeProducts} activos`,
      color: "text-primary"
    },
    {
      title: "Carritos Creados", 
      value: totalCarts,
      icon: ShoppingCart,
      description: "Carritos en sistema",
      color: "text-success"
    },
    {
      title: "Stock Total",
      value: totalStock,
      icon: TrendingUp,
      description: "Unidades disponibles",
      color: "text-warning"
    },
    {
      title: "Categorías",
      value: new Set(products.map(p => p.category)).size,
      icon: Users,
      description: "Categorías únicas",
      color: "text-muted-foreground"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Resumen general de tu tienda online</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Productos Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            {products.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No hay productos creados aún
              </p>
            ) : (
              <div className="space-y-2">
                {products.slice(0, 5).map((product) => (
                  <div key={product.id} className="flex justify-between items-center p-2 rounded-md bg-muted/50">
                    <div>
                      <p className="font-medium">{product.title}</p>
                      <p className="text-sm text-muted-foreground">{product.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${product.price}</p>
                      <p className="text-sm text-muted-foreground">Stock: {product.stock}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Carritos Activos</CardTitle>
          </CardHeader>
          <CardContent>
            {carts.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No hay carritos creados aún
              </p>
            ) : (
              <div className="space-y-2">
                {carts.slice(0, 5).map((cart) => (
                  <div key={cart.id} className="flex justify-between items-center p-2 rounded-md bg-muted/50">
                    <div>
                      <p className="font-medium">Carrito {cart.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {cart.products.length} productos
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {cart.products.reduce((acc, p) => acc + p.quantity, 0)} items
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;