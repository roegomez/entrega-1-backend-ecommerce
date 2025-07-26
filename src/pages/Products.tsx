import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit2, Trash2, Package, Search } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Product } from "@/types/store";
import { useToast } from "@/hooks/use-toast";

const Products = () => {
  const [products, setProducts] = useLocalStorage<Product[]>("products", []);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    code: "",
    price: 0,
    status: true,
    stock: 0,
    category: "",
    thumbnails: ""
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      code: "",
      price: 0,
      status: true,
      stock: 0,
      category: "",
      thumbnails: ""
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData: Product = {
      id: editingProduct ? editingProduct.id : Date.now().toString(),
      ...formData,
      thumbnails: formData.thumbnails.split(",").map(url => url.trim()).filter(Boolean)
    };

    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? productData : p));
      toast({
        title: "Producto actualizado",
        description: "El producto se ha actualizado correctamente.",
      });
    } else {
      setProducts([...products, productData]);
      toast({
        title: "Producto creado",
        description: "El producto se ha creado correctamente.",
      });
    }

    resetForm();
  };

  const handleEdit = (product: Product) => {
    setFormData({
      title: product.title,
      description: product.description,
      code: product.code,
      price: product.price,
      status: product.status,
      stock: product.stock,
      category: product.category,
      thumbnails: product.thumbnails.join(", ")
    });
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
    toast({
      title: "Producto eliminado",
      description: "El producto se ha eliminado correctamente.",
      variant: "destructive"
    });
  };

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Productos</h1>
          <p className="text-muted-foreground">Administra el inventario de tu tienda</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-primary hover:bg-primary-hover">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Producto
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Product Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingProduct ? "Editar Producto" : "Nuevo Producto"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="code">Código</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="price">Precio</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="stock">Stock</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value)})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Categoría</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="status"
                    checked={formData.status}
                    onCheckedChange={(checked) => setFormData({...formData, status: checked})}
                  />
                  <Label htmlFor="status">Producto activo</Label>
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="thumbnails">URLs de imágenes (separadas por coma)</Label>
                <Input
                  id="thumbnails"
                  value={formData.thumbnails}
                  onChange={(e) => setFormData({...formData, thumbnails: e.target.value})}
                  placeholder="https://ejemplo.com/imagen1.jpg, https://ejemplo.com/imagen2.jpg"
                />
              </div>

              <div className="flex space-x-2">
                <Button type="submit" className="bg-success hover:bg-success/90">
                  {editingProduct ? "Actualizar" : "Crear"} Producto
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{product.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{product.code}</p>
                </div>
                <Badge variant={product.status ? "default" : "secondary"}>
                  {product.status ? "Activo" : "Inactivo"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {product.description}
                </p>
                
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-primary">
                    ${product.price.toFixed(2)}
                  </span>
                  <Badge variant="outline">
                    <Package className="h-3 w-3 mr-1" />
                    {product.stock}
                  </Badge>
                </div>

                <div className="flex justify-between items-center">
                  <Badge variant="secondary">{product.category}</Badge>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(product)}
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No hay productos</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? "No se encontraron productos con ese criterio" : "Comienza agregando tu primer producto"}
            </p>
            {!searchTerm && (
              <Button onClick={() => setShowForm(true)} className="bg-primary hover:bg-primary-hover">
                <Plus className="h-4 w-4 mr-2" />
                Crear Producto
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Products;