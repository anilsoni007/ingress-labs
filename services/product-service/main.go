package main

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type Product struct {
	ID          int     `json:"id"`
	Name        string  `json:"name"`
	Description string  `json:"description"`
	Price       float64 `json:"price"`
	Category    string  `json:"category"`
	InStock     bool    `json:"in_stock"`
	CreatedAt   string  `json:"created_at"`
}

var products = []Product{
	{1, "Laptop Pro", "High-performance laptop for professionals", 1299.99, "Electronics", true, "2024-01-01T00:00:00Z"},
	{2, "Wireless Mouse", "Ergonomic wireless mouse with precision tracking", 29.99, "Electronics", true, "2024-01-02T00:00:00Z"},
	{3, "Coffee Mug", "Ceramic coffee mug with heat retention", 12.99, "Kitchen", true, "2024-01-03T00:00:00Z"},
	{4, "Desk Chair", "Comfortable office chair with lumbar support", 199.99, "Furniture", false, "2024-01-04T00:00:00Z"},
	{5, "Smartphone", "Latest smartphone with advanced camera", 799.99, "Electronics", true, "2024-01-05T00:00:00Z"},
}

func main() {
	r := gin.Default()

	// CORS middleware
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"*"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Health check endpoint
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":    "healthy",
			"service":   "product-service",
			"version":   "1.0.0",
			"timestamp": time.Now().Format(time.RFC3339),
		})
	})

	// API routes
	api := r.Group("/api")
	{
		api.GET("/products", getProducts)
		api.GET("/products/:id", getProduct)
		api.POST("/products", createProduct)
		api.PUT("/products/:id", updateProduct)
		api.DELETE("/products/:id", deleteProduct)
		api.GET("/categories", getCategories)
		api.GET("/stats", getStats)
	}

	r.Run(":8080")
}

func getProducts(c *gin.Context) {
	category := c.Query("category")
	inStock := c.Query("in_stock")

	filteredProducts := products

	if category != "" {
		var filtered []Product
		for _, p := range filteredProducts {
			if p.Category == category {
				filtered = append(filtered, p)
			}
		}
		filteredProducts = filtered
	}

	if inStock != "" {
		stockFilter, _ := strconv.ParseBool(inStock)
		var filtered []Product
		for _, p := range filteredProducts {
			if p.InStock == stockFilter {
				filtered = append(filtered, p)
			}
		}
		filteredProducts = filtered
	}

	c.JSON(http.StatusOK, filteredProducts)
}

func getProduct(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product ID"})
		return
	}

	for _, product := range products {
		if product.ID == id {
			c.JSON(http.StatusOK, product)
			return
		}
	}

	c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
}

func createProduct(c *gin.Context) {
	var newProduct Product
	if err := c.ShouldBindJSON(&newProduct); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	newProduct.ID = len(products) + 1
	newProduct.CreatedAt = time.Now().Format(time.RFC3339)
	products = append(products, newProduct)

	c.JSON(http.StatusCreated, newProduct)
}

func updateProduct(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product ID"})
		return
	}

	for i, product := range products {
		if product.ID == id {
			var updatedProduct Product
			if err := c.ShouldBindJSON(&updatedProduct); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}

			updatedProduct.ID = id
			updatedProduct.CreatedAt = product.CreatedAt
			products[i] = updatedProduct

			c.JSON(http.StatusOK, updatedProduct)
			return
		}
	}

	c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
}

func deleteProduct(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product ID"})
		return
	}

	for i, product := range products {
		if product.ID == id {
			products = append(products[:i], products[i+1:]...)
			c.JSON(http.StatusOK, gin.H{"message": "Product deleted successfully"})
			return
		}
	}

	c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
}

func getCategories(c *gin.Context) {
	categories := make(map[string]int)
	for _, product := range products {
		categories[product.Category]++
	}

	c.JSON(http.StatusOK, categories)
}

func getStats(c *gin.Context) {
	totalProducts := len(products)
	inStockCount := 0
	totalValue := 0.0

	for _, product := range products {
		if product.InStock {
			inStockCount++
		}
		totalValue += product.Price
	}

	c.JSON(http.StatusOK, gin.H{
		"total_products": totalProducts,
		"in_stock":       inStockCount,
		"out_of_stock":   totalProducts - inStockCount,
		"total_value":    totalValue,
	})
}