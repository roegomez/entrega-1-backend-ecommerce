import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, ShoppingCart, Trash2, Package, Minus } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Product, Cart, CartProduct } from "@/types/store";
import { useToast } from "@/hooks/use-toast";

const Carts = () => {
  const [carts, setCarts] = useLocalStorage<Cart[]>("carts", []);
  const [products] = useLocalStorage<Product[]>("products", []);
  const [showAddProductForm, setShowAddProductForm] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState("");
  const { toast } = useToast();

  const createCart = () => {
    const newCart: Cart = {
      id: Date.now().toString(),
      products: []
    };
    setCarts([...carts, newCart]);
    toast({
      title: "Carrito creado",
      description: "Se ha creado un nuevo carrito exitosamente.",
    });
  };

  const deleteCart = (cartId: string) => {
    setCarts(carts.filter(cart => cart.id !== cartId));
    toast({
      title: "Carrito eliminado",
      description: "El carrito se ha eliminado correctamente.",
      variant: "destructive"
    });
  };

  const addProductToCart = (cartId: string, productId: string) => {
    setCarts(carts.map(cart => {
      if (cart.id === cartId) {
        const existingProduct = cart.products.find(p => p.product === productId);
        if (existingProduct) {
          return {
            ...cart,
            products: cart.products.map(p =>
              p.product === productId
                ? { ...p, quantity: p.quantity + 1 }
                : p
            )
          };
        } else {
          return {
            ...cart,
            products: [...cart.products, { product: productId, quantity: 1 }]
          };
        }
      }
      return cart;
    }));
    
    setShowAddProductForm(null);
    setSelectedProductId("");
    toast({
      title: "Producto agregado",
      description: "El producto se ha agregado al carrito.",
    });
  };

  const updateProductQuantity = (cartId: string, productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeProductFromCart(cartId, productId);
      return;
    }

    setCarts(carts.map(cart => {
      if (cart.id === cartId) {
        return {
          ...cart,
          products: cart.products.map(p =>
            p.product === productId
              ? { ...p, quantity: newQuantity }
              : p
          )
        };
      }
      return cart;
    }));
  };

  const removeProductFromCart = (cartId: string, productId: string) => {
    setCarts(carts.map(cart => {
      if (cart.id === cartId) {
        return {
          ...cart,
          products: cart.products.filter(p => p.product !== productId)
        };
      }
      return cart;
    }));

    toast({
      title: "Producto eliminado",
      description: "El producto se ha eliminado del carrito.",
    });
  };

  const getProductById = (productId: string): Product | undefined => {
    return products.find(p => p.id === productId);
  };

  const getCartTotal = (cart: Cart): number => {
    return cart.products.reduce((total, cartProduct) => {
      const product = getProductById(cartProduct.product);
      return total + (product ? product.price * cartProduct.quantity : 0);
    }, 0);
  };

  const getCartItemsCount = (cart: Cart): number => {
    return cart.products.reduce((total, cartProduct) => total + cartProduct.quantity, 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Carritos</h1>
          <p className="text-muted-foreground">Administra los carritos de compra</p>
        </div>
        <Button onClick={createCart} className="bg-primary hover:bg-primary-hover">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Carrito
        </Button>
      </div>

      {carts.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No hay carritos</h3>
            <p className="text-muted-foreground mb-4">
              Comienza creando tu primer carrito
            </p>
            <Button onClick={createCart} className="bg-primary hover:bg-primary-hover">
              <Plus className="h-4 w-4 mr-2" />
              Crear Carrito
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {carts.map((cart) => (
            <Card key={cart.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5" />
                      Carrito {cart.id}
                    </CardTitle>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="secondary">
                        {getCartItemsCount(cart)} items
                      </Badge>
                      <Badge variant="outline">
                        Total: ${getCartTotal(cart).toFixed(2)}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteCart(cart.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Cart Products */}
                  {cart.products.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      Carrito vacío
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {cart.products.map((cartProduct) => {
                        const product = getProductById(cartProduct.product);
                        if (!product) return null;

                        return (
                          <div key={cartProduct.product} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                            <div className="flex-1">
                              <h4 className="font-medium">{product.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                ${product.price.toFixed(2)} c/u
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateProductQuantity(cart.id, cartProduct.product, cartProduct.quantity - 1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center">{cartProduct.quantity}</span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateProductQuantity(cart.id, cartProduct.product, cartProduct.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => removeProductFromCart(cart.id, cartProduct.product)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Add Product Form */}
                  {showAddProductForm === cart.id ? (
                    <div className="space-y-3 p-3 border rounded-md">
                      <Label htmlFor="product-select">Seleccionar Producto</Label>
                      <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Elegir producto..." />
                        </SelectTrigger>
                        <SelectContent>
                          {products
                            .filter(p => p.status)
                            .map((product) => (
                              <SelectItem key={product.id} value={product.id}>
                                {product.title} - ${product.price.toFixed(2)}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => selectedProductId && addProductToCart(cart.id, selectedProductId)}
                          disabled={!selectedProductId}
                          className="bg-success hover:bg-success/90"
                        >
                          Agregar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setShowAddProductForm(null);
                            setSelectedProductId("");
                          }}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAddProductForm(cart.id)}
                      disabled={products.filter(p => p.status).length === 0}
                      className="w-full"
                    >
                      <Package className="h-4 w-4 mr-2" />
                      Agregar Producto
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {products.filter(p => p.status).length === 0 && carts.length > 0 && (
        <Card>
          <CardContent className="text-center py-6">
            <Package className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">
              No hay productos activos disponibles para agregar a los carritos.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Carts;